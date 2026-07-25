"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAddressAction, updateAddressAction } from "@/app/_lib/actions";
import { US_STATES } from "@/app/_lib/usStates";
import toast from "react-hot-toast";

export default function AddressForm({ address, onClose }) {
  const router = useRouter();
  const isEditing = !!address;

  const [form, setForm] = useState({
    label: address?.label || "",
    first_name: address?.first_name || "",
    last_name: address?.last_name || "",
    phone: address?.phone || "",
    address: address?.address || "",
    city: address?.city || "",
    state: address?.state || "",
    postal_code: address?.postal_code || "",
    country: address?.country || "United States",
    is_default: address?.is_default || false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditing) {
        await updateAddressAction(address.id, form);
        toast.success("Address updated");
      } else {
        await createAddressAction(form);
        toast.success("Address saved");
      }
      router.refresh();
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error("Failed to save address");
      setLoading(false);
    }
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
        <label className="text-sm text-text font-medium">
          Label <span className="text-text-light font-normal">(optional)</span>
        </label>
        <input
          type="text"
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder="e.g. Home, Work"
          className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text font-medium">
            First Name <span className="text-sale">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
            className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text font-medium">
            Last Name <span className="text-sale">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
            className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-text font-medium">
          Phone <span className="text-sale">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-text font-medium">
          Street Address <span className="text-sale">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-text font-medium">
          Town / City <span className="text-sale">*</span>
        </label>
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          required
          className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-text font-medium">
          State <span className="text-sale">*</span>
        </label>
        <select
          name="state"
          value={form.state}
          onChange={handleChange}
          required
          className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-white rounded"
        >
          <option value="" disabled>
            Select a state
          </option>
          {US_STATES.map((state) => (
            <option key={state.abbr} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-text font-medium">
          ZIP Code <span className="text-sale">*</span>
        </label>
        <input
          type="text"
          name="postal_code"
          value={form.postal_code}
          onChange={handleChange}
          required
          maxLength={10}
          className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="is_default"
          checked={form.is_default}
          onChange={handleChange}
          className="accent-primary w-4 h-4"
        />
        <span className="text-sm text-text font-medium">
          Set as default address
        </span>
      </label>

      <div className="flex items-center gap-3 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer flex-1 bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded transition-colors disabled:opacity-70"
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Address"
              : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer border border-gray-medium text-text font-medium py-2.5 px-6 rounded hover:bg-gray-light transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
