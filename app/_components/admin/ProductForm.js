"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { supabaseAuth } from "@/app/_lib/supabase-auth";
import { createProductAction, updateProductAction } from "@/app/_lib/actions";
import toast from "react-hot-toast";

export default function ProductForm({ categories, product }) {
  const router = useRouter();
  const isEditing = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || "",
    sale_price: product?.sale_price || "",
    stock: product?.stock || 0,
    category_id: product?.category_id || "",
    is_featured: product?.is_featured || false,
  });

  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setError("");
    const uploadedUrls = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/admin-uploads/${fileName}`;

      const { error: uploadError } = await supabaseAuth.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) {
        setError(`Failed to upload ${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data } = supabaseAuth.storage
        .from("images")
        .getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (images.length === 0) {
      setError("Please upload at least one product image.");
      setLoading(false);
      return;
    }

    // ✅ Validate sale price vs regular price
    const price = parseFloat(form.price);
    const salePrice = form.sale_price ? parseFloat(form.sale_price) : null;

    if (salePrice !== null && salePrice > price) {
      setError("Sale price cannot be greater than the regular price.");
      setLoading(false);
      return;
    }

    if (salePrice !== null && salePrice < 0) {
      setError("Sale price cannot be negative.");
      setLoading(false);
      return;
    }

    if (price <= 0) {
      setError("Price must be greater than 0.");
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await updateProductAction(product.id, form, images);
        toast.success("Product updated successfully");
      } else {
        await createProductAction(form, images);
        toast.success("Product added successfully");
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to save product");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Info */}
          <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
            <h2 className="font-bold text-heading">Basic Information</h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-text font-medium">
                Product Name <span className="text-sale">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Product name"
                className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-text font-medium">Slug</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                placeholder="product-slug"
                className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
              />
              <p className="text-xs text-text-light">
                Auto-generated from name. Editable.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-text font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Product description"
                className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors resize-none rounded text-text"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
            <h2 className="font-bold text-heading">Product Images</h2>
            <p className="text-xs text-text-light">
              First image is main. Second shows on hover. Upload multiple
              images.
            </p>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-24 bg-gray-light rounded overflow-hidden">
                      <Image
                        src={img}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="96px"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="cursor-pointer absolute -top-2 -right-2 bg-sale text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1 rounded">
                        Main
                      </span>
                    )}
                    {index === 1 && (
                      <span className="absolute bottom-1 left-1 bg-dark text-white text-xs px-1 rounded">
                        Hover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <label className="cursor-pointer border-2 border-dashed border-gray-medium hover:border-primary transition-colors rounded-lg p-6 flex flex-col items-center gap-2">
              <PhotoIcon className="w-8 h-8 text-text-light" />
              <span className="text-sm text-text-light">
                {uploading ? "Uploading..." : "Click to upload images"}
              </span>
              <span className="text-xs text-text-light">
                PNG, JPG up to 10MB each
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Pricing */}
          <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
            <h2 className="font-bold text-heading">Pricing</h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-text font-medium">
                Price <span className="text-sale">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="0.00"
                className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-text font-medium">
                Sale Price
              </label>
              <input
                type="number"
                name="sale_price"
                value={form.sale_price}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00 (optional)"
                className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-text font-medium">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
            <h2 className="font-bold text-heading">Category</h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-text font-medium">
                Category <span className="text-sale">*</span>
              </label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-surface text-text rounded"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-text font-medium">
                Featured Product
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || uploading}
              className="cursor-pointer w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Product"
                  : "Add Product"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer w-full bg-surface border border-gray-medium text-text font-medium py-3 rounded hover:bg-gray-light transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
