"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { supabaseAuth } from "@/app/_lib/supabase-auth";
import {
  createHeroSlideAction,
  updateHeroSlideAction,
} from "@/app/_lib/actions";
import toast from "react-hot-toast";

export default function HeroSlideForm({ slide }) {
  const router = useRouter();
  const isEditing = !!slide;

  const [form, setForm] = useState({
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    description: slide?.description || "",
    cta_text: slide?.cta_text || "SHOP NOW",
    cta_link: slide?.cta_link || "/shop",
    display_order: slide?.display_order ?? 0,
  });

  const [imageUrl, setImageUrl] = useState(slide?.image_url || "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${process.env.NEXT_PUBLIC_TENANT_ID}/hero/admin-uploads/${fileName}`;

    const { error: uploadError } = await supabaseAuth.storage
      .from("images")
      .upload(filePath, file);

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
        await updateHeroSlideAction(slide.id, form, imageUrl);
        toast.success("Slide updated successfully");
      } else {
        await createHeroSlideAction(form, imageUrl);
        toast.success("Slide added successfully");
      }
      router.push("/admin/hero");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to save slide");
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
        <h2 className="font-bold text-heading">Slide Content</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-text font-medium">
            Title <span className="text-sale">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="New Arrivals"
            className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-text font-medium">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Fresh Products Just Landed"
            className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-text font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Discover our latest collection of quality essentials."
            className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text font-medium">
              Button Text
            </label>
            <input
              type="text"
              name="cta_text"
              value={form.cta_text}
              onChange={handleChange}
              className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text font-medium">
              Button Link
            </label>
            <input
              type="text"
              name="cta_link"
              value={form.cta_link}
              onChange={handleChange}
              className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-text font-medium">
            Display Order
          </label>
          <input
            type="number"
            name="display_order"
            value={form.display_order}
            onChange={handleChange}
            className="bg-surface border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded text-text w-32"
          />
          <p className="text-xs text-text-light">
            Lower numbers show first.
          </p>
        </div>

        {/* Image */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text font-medium">
            Banner Image
          </label>

          {imageUrl ? (
            <div className="relative w-full h-40 bg-gray-light rounded overflow-hidden group">
              <Image
                src={imageUrl}
                alt="Hero slide"
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
          <p className="text-xs text-text-light">
            Optional — if left blank, this slide uses a plain background
            color instead of a photo.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="cursor-pointer bg-primary hover:bg-primary-hover text-white font-medium py-3 px-8 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : isEditing ? "Update Slide" : "Add Slide"}
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
