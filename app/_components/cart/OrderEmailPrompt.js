"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function OrderEmailPrompt({ orderId, notFound = false }) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    router.push(
      `/order-confirmation?orderId=${orderId}&email=${encodeURIComponent(email.trim())}`,
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
      <div className="bg-primary/10 p-4 rounded-full">
        <EnvelopeIcon className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-xl font-bold text-dark">Verify Your Order</h1>
      {notFound && (
        <p className="text-sale text-sm bg-red-50 px-4 py-2 rounded-lg w-full">
          We couldn&apos;t find that order. Please check your order number and
          email address, then try again.
        </p>
      )}
      <p className="text-text-light text-sm">
        Enter the email address used for order #{orderId} to view its details.
      </p>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full border border-gray-medium px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors rounded"
        />
        <button
          type="submit"
          className="cursor-pointer w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded transition-colors"
        >
          View Order
        </button>
      </form>
    </div>
  );
}
