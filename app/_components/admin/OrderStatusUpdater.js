"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/app/_lib/actions";
import toast from "react-hot-toast";

const STATUSES = ["pending", "processing", "shipped", "delivered"];

export default function OrderStatusUpdater({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    try {
      await updateOrderStatusAction(orderId, status);
      toast.success("Order status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm text-text font-medium">Order Status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-surface text-text rounded capitalize"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="cursor-pointer bg-primary hover:bg-primary-hover text-white text-sm font-medium py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : saved ? "Saved!" : "Update Status"}
      </button>
    </div>
  );
}
