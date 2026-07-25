"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertProfileAction } from "@/app/_lib/actions";
import toast from "react-hot-toast";

export default function SettingsForm({ user, profile }) {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: profile?.full_name || user.user_metadata?.full_name || "",
    phone: profile?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await upsertProfileAction(form);
      toast.success("Settings saved");
      router.refresh();
    } catch (err) {
      setError(err.message);
      toast.error("Failed to save settings");
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-medium rounded-lg p-6 flex flex-col gap-4"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm text-text font-medium">Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full border border-gray-medium px-4 py-2 text-sm rounded bg-gray-light text-text-light cursor-not-allowed"
        />
        <p className="text-xs text-text-light">
          Your email is linked to your Google account and can&apos;t be changed
          here.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-text font-medium">Full Name</label>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Your full name"
          className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-text font-medium">Phone</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Your phone number"
          className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded transition-colors disabled:opacity-70 mt-2"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
