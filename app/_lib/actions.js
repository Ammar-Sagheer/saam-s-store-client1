"use server";

import { supabase } from "@/app/_lib/supabase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/app/_lib/supabase-server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const TENANT_ID = process.env.TENANT_ID;

async function requireAdmin(supabaseServer) {
  const { data, error } = await supabaseServer.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims || claims.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized.");
  }
}

export async function placeOrder(formData) {
  const supabaseServer = await createSupabaseServer();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  const orderData = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    postal_code: formData.get("postal_code"),
    country: formData.get("country"),
    payment_method: formData.get("payment_method"),
    order_items: JSON.parse(formData.get("order_items")),
    subtotal: Number(formData.get("subtotal")),
    total: Number(formData.get("total")),
    status: "pending",
    user_id: user?.id || null,
    tenant_id: TENANT_ID,
  };

  // Basic validation
  if (
    !orderData.first_name ||
    !orderData.last_name ||
    !orderData.email ||
    !orderData.phone ||
    !orderData.address ||
    !orderData.city ||
    !orderData.state ||
    !orderData.postal_code
  ) {
    throw new Error("Please fill in all required fields.");
  }

  const { data, error } = await supabaseServer.rpc("create_order", {
    order_data: orderData,
  });

  if (error) throw new Error(error.message);

  redirect(
    `/order-confirmation?orderId=${data.id}&email=${encodeURIComponent(orderData.email)}`,
  );
}

export async function submitContactForm(formData) {
  const contactData = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    tenant_id: TENANT_ID,
  };

  if (!contactData.first_name || !contactData.email || !contactData.message) {
    throw new Error("Please fill in all required fields.");
  }

  const { error } = await supabase.from("contacts").insert(contactData);

  if (error) throw new Error(error.message);

  redirect("/contact?success=true");
}

export async function deleteProductAction(productId) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("tenant_id", TENANT_ID)
    .eq("id", productId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

export async function createProductAction(formData, images) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  const price = Number(formData.price);
  const salePrice = formData.sale_price ? Number(formData.sale_price) : null;

  if (salePrice !== null && salePrice > price) {
    throw new Error("Sale price cannot be greater than the regular price.");
  }
  if (salePrice !== null && salePrice < 0) {
    throw new Error("Sale price cannot be negative.");
  }
  if (price <= 0) {
    throw new Error("Price must be greater than 0.");
  }

  const productData = {
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    price: price,
    sale_price: salePrice,
    stock: Number(formData.stock),
    category_id: Number(formData.category_id),
    is_featured: formData.is_featured,
    tenant_id: TENANT_ID,
  };

  const { data: product, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (images.length > 0) {
    const imageRows = images.map((url, index) => ({
      product_id: product.id,
      image_url: url,
      display_order: index,
      tenant_id: TENANT_ID,
    }));

    const { error: imgError } = await supabase
      .from("product_images")
      .insert(imageRows);
    if (imgError) throw new Error(imgError.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function updateProductAction(productId, formData, images) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  const price = Number(formData.price);
  const salePrice = formData.sale_price ? Number(formData.sale_price) : null;

  if (salePrice !== null && salePrice > price) {
    throw new Error("Sale price cannot be greater than the regular price.");
  }
  if (salePrice !== null && salePrice < 0) {
    throw new Error("Sale price cannot be negative.");
  }
  if (price <= 0) {
    throw new Error("Price must be greater than 0.");
  }

  const productData = {
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    price: price,
    sale_price: salePrice,
    stock: Number(formData.stock),
    category_id: Number(formData.category_id),
    is_featured: formData.is_featured,
  };
  const { error } = await supabase
    .from("products")
    .update(productData)
    .eq("tenant_id", TENANT_ID)
    .eq("id", productId);
  if (error) throw new Error(error.message);

  await supabase
    .from("product_images")
    .delete()
    .eq("tenant_id", TENANT_ID)
    .eq("product_id", productId);

  if (images.length > 0) {
    const imageRows = images.map((url, index) => ({
      product_id: productId,
      image_url: url,
      display_order: index,
      tenant_id: TENANT_ID,
    }));
    const { error: imgError } = await supabase
      .from("product_images")
      .insert(imageRows);
    if (imgError) throw new Error(imgError.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function bulkImportProducts(rows) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  const results = [];
  const categoryCache = new Map();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      if (!row.name) throw new Error("Missing product name.");

      const price = Number(row.price);
      const salePrice = row.sale_price ? Number(row.sale_price) : null;

      if (!price || price <= 0) {
        throw new Error("Price must be a positive number.");
      }
      if (salePrice !== null && (salePrice < 0 || salePrice > price)) {
        throw new Error("Sale price invalid (negative or greater than price).");
      }

      const categoryName = (row.category || "").trim();
      if (!categoryName) throw new Error("Missing category.");

      let categoryId = categoryCache.get(categoryName.toLowerCase());

      if (!categoryId) {
        const { data: existingCategory } = await supabase
          .from("categories")
          .select("id")
          .eq("tenant_id", TENANT_ID)
          .ilike("name", categoryName)
          .maybeSingle();

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const slug = categoryName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          const { data: newCategory, error: catError } = await supabase
            .from("categories")
            .insert({ name: categoryName, slug, image_url: null, tenant_id: TENANT_ID })
            .select()
            .single();

          if (catError)
            throw new Error(`Category creation failed: ${catError.message}`);
          categoryId = newCategory.id;
        }
        categoryCache.set(categoryName.toLowerCase(), categoryId);
      }

      const slug =
        row.slug?.trim() ||
        row.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const productData = {
        name: row.name,
        slug,
        description: row.description || "",
        price,
        sale_price: salePrice,
        stock: Number(row.stock) || 0,
        category_id: categoryId,
        is_featured: row.is_featured === "true" || row.is_featured === true,
        tenant_id: TENANT_ID,
      };

      const { data: product, error: productError } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

      if (productError) throw new Error(productError.message);

      if (row.imageUrls?.length > 0) {
        const imageRows = row.imageUrls.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          display_order: index,
          tenant_id: TENANT_ID,
        }));
        const { error: imgError } = await supabase
          .from("product_images")
          .insert(imageRows);
        if (imgError) throw new Error(`Images: ${imgError.message}`);
      }

      results.push({ row: i + 1, name: row.name, success: true });
    } catch (err) {
      results.push({
        row: i + 1,
        name: row.name || "(unnamed)",
        success: false,
        error: err.message,
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/", "layout");

  return results;
}

export async function createCategoryAction(formData, imageUrl) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  if (!formData.name?.trim()) {
    throw new Error("Category name is required.");
  }
  if (!formData.slug?.trim()) {
    throw new Error("Category slug is required.");
  }

  const categoryData = {
    name: formData.name.trim(),
    slug: formData.slug.trim(),
    image_url: imageUrl || null,
    tenant_id: TENANT_ID,
  };

  const { error } = await supabase.from("categories").insert(categoryData);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  revalidatePath("/shop");
}

export async function updateCategoryAction(categoryId, formData, imageUrl) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  if (!formData.name?.trim()) {
    throw new Error("Category name is required.");
  }
  if (!formData.slug?.trim()) {
    throw new Error("Category slug is required.");
  }

  const categoryData = {
    name: formData.name.trim(),
    slug: formData.slug.trim(),
    image_url: imageUrl || null,
  };

  const { error } = await supabase
    .from("categories")
    .update(categoryData)
    .eq("tenant_id", TENANT_ID)
    .eq("id", categoryId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  revalidatePath("/shop");
}

export async function deleteCategoryAction(categoryId) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("tenant_id", TENANT_ID)
    .eq("id", categoryId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  revalidatePath("/shop");
}

export async function createHeroSlideAction(formData, imageUrl) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  if (!formData.title?.trim()) {
    throw new Error("Title is required.");
  }

  const slideData = {
    title: formData.title.trim(),
    subtitle: formData.subtitle?.trim() || null,
    description: formData.description?.trim() || null,
    cta_text: formData.cta_text?.trim() || "SHOP NOW",
    cta_link: formData.cta_link?.trim() || "/shop",
    image_url: imageUrl || null,
    display_order: Number(formData.display_order) || 0,
    tenant_id: TENANT_ID,
  };

  const { error } = await supabase.from("hero_slides").insert(slideData);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function updateHeroSlideAction(slideId, formData, imageUrl) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  if (!formData.title?.trim()) {
    throw new Error("Title is required.");
  }

  const slideData = {
    title: formData.title.trim(),
    subtitle: formData.subtitle?.trim() || null,
    description: formData.description?.trim() || null,
    cta_text: formData.cta_text?.trim() || "SHOP NOW",
    cta_link: formData.cta_link?.trim() || "/shop",
    image_url: imageUrl || null,
    display_order: Number(formData.display_order) || 0,
  };

  const { error } = await supabase
    .from("hero_slides")
    .update(slideData)
    .eq("tenant_id", TENANT_ID)
    .eq("id", slideId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function deleteHeroSlideAction(slideId) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  const { error } = await supabase
    .from("hero_slides")
    .delete()
    .eq("tenant_id", TENANT_ID)
    .eq("id", slideId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function updateOrderStatusAction(orderId, status) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  const VALID_STATUSES = ["pending", "processing", "shipped", "delivered"];
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid status value.");
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("tenant_id", TENANT_ID)
    .eq("id", orderId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function deleteMessageAction(messageId) {
  const supabase = await createSupabaseServer();
  await requireAdmin(supabase);

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("tenant_id", TENANT_ID)
    .eq("id", messageId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/messages");
}

export async function createAddressAction(formData) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in to save an address.");

  const addressData = {
    user_id: user.id,
    label: formData.label || null,
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    phone: formData.phone.trim(),
    address: formData.address.trim(),
    city: formData.city.trim(),
    state: formData.state.trim(),
    postal_code: formData.postal_code.trim(),
    country: formData.country?.trim() || "United States",
    is_default: formData.is_default || false,
  };

  if (addressData.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase.from("addresses").insert(addressData);
  if (error) throw new Error(error.message);

  revalidatePath("/addresses");
  revalidatePath("/checkout");
}

export async function updateAddressAction(addressId, formData) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in.");

  if (formData.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      label: formData.label || null,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      postal_code: formData.postal_code.trim(),
      country: formData.country?.trim() || "United States",
      is_default: formData.is_default || false,
    })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/addresses");
  revalidatePath("/checkout");
}

export async function deleteAddressAction(addressId) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in.");

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/addresses");
  revalidatePath("/checkout");
}

export async function upsertProfileAction(formData) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in.");

  const { error } = await supabase.from("profiles").upsert({
    user_id: user.id,
    full_name: formData.full_name?.trim(),
    phone: formData.phone?.trim(),
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  revalidatePath("/account");
}

export async function toggleWishlistAction(productId) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in to save items.");

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    revalidatePath("/wishlist");
    return { added: false };
  } else {
    const { error } = await supabase
      .from("wishlist_items")
      .insert({ user_id: user.id, product_id: productId });
    if (error) throw new Error(error.message);
    revalidatePath("/wishlist");
    return { added: true };
  }
}
