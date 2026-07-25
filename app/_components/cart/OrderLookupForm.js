"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function OrderLookupForm() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) return;
    router.push(
      `/order-confirmation?orderId=${orderId.trim()}&email=${encodeURIComponent(email.trim())}`,
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 flex flex-col items-center gap-4">
      <div className="bg-primary/10 p-4 rounded-full">
        <MagnifyingGlassIcon className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-xl font-bold text-dark text-center">
        Track Your Order
      </h1>
      <p className="text-text-light text-sm text-center">
        Enter your order number and the email used at checkout to view its
        status.
      </p>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <input
          type="text"
          required
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order Number (e.g. 25)"
          className="w-full border border-gray-medium px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors rounded"
        />
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
          Track Order
        </button>
      </form>
    </div>
  );
}
