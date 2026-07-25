import { supabase } from "@/app/_lib/supabase";
import { shapeProductImages } from "@/app/_lib/helpers";
import { createSupabaseServer } from "@/app/_lib/supabase-server";

const TENANT_ID = process.env.TENANT_ID;

// ==================== CATEGORIES ====================

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("tenant_id", TENANT_ID)
    .order("name");

  if (error) throw new Error(error.message);
  return data;
}

export async function getCategoriesWithCount() {
  const { data, error } = await supabase
    .from("categories")
    .select("*, products(count)")
    .eq("tenant_id", TENANT_ID)
    .order("name");

  if (error) throw new Error(error.message);
  return data;
}

export async function getPriceRange() {
  const { data, error } = await supabase.rpc("get_price_range", {
    p_tenant_id: TENANT_ID,
  });

  if (error) throw new Error(error.message);

  const result = data?.[0];
  return {
    min: Math.floor(result?.min_price ?? 0),
    max: Math.ceil(result?.max_price ?? 0),
  };
}

// ==================== PRODUCTS ====================

export async function getProducts({
  search,
  category,
  minPrice,
  maxPrice,
  sort,
} = {}) {
  let query = supabase
    .from("products")
    .select(
      "*, categories!inner(name, slug), product_images(image_url, display_order)",
    )
    .eq("tenant_id", TENANT_ID);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (category) {
    query = query.eq("categories.slug", category);
  }

  if (minPrice) {
    query = query.gte("price", Number(minPrice));
  }

  if (maxPrice) {
    query = query.lte("price", Number(maxPrice));
  }

  if (sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data.map(shapeProductImages);
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, categories(name, slug), product_images(image_url, display_order)",
    )
    .eq("tenant_id", TENANT_ID)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map(shapeProductImages);
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, categories(name, slug), product_images(image_url, display_order)",
    )
    .eq("tenant_id", TENANT_ID)
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);

  return shapeProductImages(data);
}

export async function getRelatedProducts(categoryId, currentProductId) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, categories(name, slug), product_images(image_url, display_order)",
    )
    .eq("tenant_id", TENANT_ID)
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .limit(4);

  if (error) throw new Error(error.message);

  return data.map(shapeProductImages);
}

// ==================== ORDERS ====================

export async function getOrder(orderId) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("tenant_id", TENANT_ID)
    .eq("id", orderId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getAllOrders(page = 1, pageSize = 5) {
  const supabaseServer = await createSupabaseServer();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabaseServer
    .from("orders")
    .select("*", { count: "exact" })
    .eq("tenant_id", TENANT_ID)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    orders: data,
    totalCount: count,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
  };
}

export async function getOrderById(id) {
  const supabaseServer = await createSupabaseServer();
  const { data, error } = await supabaseServer
    .from("orders")
    .select("*")
    .eq("tenant_id", TENANT_ID)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getOrderByIdAndEmail(orderId, email) {
  const { data, error } = await supabase.rpc("get_order_by_id_and_email", {
    order_id: orderId,
    order_email: email,
    p_tenant_id: TENANT_ID,
  });

  if (error) throw new Error(error.message);
  return data?.[0] || null;
}

// ==================== ADMIN ====================

export async function getAdminStats() {
  const supabase = await createSupabaseServer();
  const [products, orders, messages] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", TENANT_ID),
    supabase
      .from("orders")
      .select("*")
      .eq("tenant_id", TENANT_ID)
      .order("created_at", { ascending: false }),
    supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", TENANT_ID),
  ]);

  const totalRevenue =
    orders.data?.reduce((acc, order) => acc + order.total, 0) || 0;

  return {
    totalProducts: products.count || 0,
    totalOrders: orders.data?.length || 0,
    totalMessages: messages.count || 0,
    totalRevenue,
    orders: orders.data || [],
  };
}

export async function getAllProductsAdmin(page = 1, pageSize = 15) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select(
      "*, categories(name, slug), product_images(image_url, display_order)",
      { count: "exact" },
    )
    .eq("tenant_id", TENANT_ID)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  const products = data.map(shapeProductImages);

  const totalPages = Math.ceil((count || 0) / pageSize);

  return { products, totalPages, currentPage: page, totalCount: count || 0 };
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, categories(name, slug), product_images(image_url, display_order)",
    )
    .eq("tenant_id", TENANT_ID)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return shapeProductImages(data);
}

export async function getCategoryById(id) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("tenant_id", TENANT_ID)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ==================== HERO SLIDES ====================

export async function getHeroSlides() {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("tenant_id", TENANT_ID)
    .order("display_order");

  if (error) throw new Error(error.message);
  return data;
}

export async function getHeroSlideById(id) {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("tenant_id", TENANT_ID)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ==================== MESSAGES ====================

export async function getAllMessages(page = 1, pageSize = 3) {
  const supabaseServer = await createSupabaseServer();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabaseServer
    .from("contacts")
    .select("*", { count: "exact" })
    .eq("tenant_id", TENANT_ID)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    messages: data,
    totalCount: count,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
  };
}
