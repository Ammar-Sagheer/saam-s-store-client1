"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { supabaseAuth } from "@/app/_lib/supabase-auth";
import { createCategoryAction, updateCategoryAction } from "@/app/_lib/actions";
import { compressImage } from "@/app/_lib/compressImage";
import toast from "react-hot-toast";

export default function CategoryForm({ category }) {
  const router = useRouter();
  const isEditing = !!category;

  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
  });

  const [imageUrl, setImageUrl] = useState(category?.image_url || "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "name") {
      setForm({
        name: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    let uploadFile = file;
    try {
      uploadFile = await compressImage(file, { maxWidth: 800 });
    } catch (compressErr) {
      // Fall back to the original file rather than blocking the upload.
    }

    const fileExt = uploadFile.type === "image/jpeg" ? "jpg" : file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${process.env.NEXT_PUBLIC_TENANT_ID}/categories/admin-uploads/${fileName}`;

    const { error: uploadError } = await supabaseAuth.storage
      .from("images")
      .upload(filePath, uploadFile);

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabaseAuth.storage.from("images").getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditing) {
        await updateCategoryAction(category.id, form, imageUrl);
        toast.success("Category updated successfully");
      } else {
        await createCategoryAction(form, imageUrl);
        toast.success("Category added successfully");
      }
      router.push("/admin/categories");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to save category");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
        <h2 className="font-bold text-heading">Category Information</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-text font-medium">
            Category Name <span className="text-sale">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Category name"
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
            placeholder="category-slug"
            className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
          />
          <p className="text-xs text-text-light">
            Auto-generated from name. Editable.
          </p>
        </div>

        {/* Image */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text font-medium">
            Category Image
          </label>

          {imageUrl ? (
            <div className="relative w-full h-40 bg-gray-light rounded overflow-hidden group">
              <Image
                src={imageUrl}
                alt="Category"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 512px"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="cursor-pointer absolute top-2 right-2 bg-sale text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer border-2 border-dashed border-gray-medium hover:border-primary transition-colors rounded-lg p-6 flex flex-col items-center gap-2">
              <PhotoIcon className="w-8 h-8 text-text-light" />
              <span className="text-sm text-text-light">
                {uploading ? "Uploading..." : "Click to upload image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="cursor-pointer bg-primary hover:bg-primary-hover text-white font-medium py-3 px-8 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Category"
              : "Add Category"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer bg-surface border border-gray-medium text-text font-medium py-3 px-8 rounded hover:bg-gray-light transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
