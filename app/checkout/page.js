"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useCart } from "@/app/_components/cart/CartContext";
import { formatPrice } from "@/app/_lib/helpers";
import { placeOrder } from "@/app/_lib/actions";
import { US_STATES } from "@/app/_lib/usStates";
import { FREE_SHIPPING_THRESHOLD } from "@/app/_lib/helpers";
import { supabaseAuth } from "@/app/_lib/supabase-auth";
import { siteConfig } from "@/app/_lib/siteConfig";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer w-full bg-primary hover:bg-primary-hover text-white font-medium py-4 transition-colors disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
    >
      {pending ? "Placing Order..." : "Place Order"}
    </button>
  );
}

export default function CheckoutPage() {
  const { cartItems, totalPrice } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabaseAuth.auth.getUser();
      setUser(user);

      if (user) {
        const { data: addressData } = await supabaseAuth
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });

        setAddresses(addressData || []);

        const defaultAddress =
          addressData?.find((a) => a.is_default) || addressData?.[0];
        if (defaultAddress) setSelectedAddressId(defaultAddress.id);
      }

      setMounted(true);
    }
    init();
  }, []);

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 15;
  const orderTotal = totalPrice + shippingCost;

  const fullName = user?.user_metadata?.full_name || "";
  const [prefilledFirstName, ...rest] = fullName.split(" ");
  const prefilledLastName = rest.join(" ");
  const prefilledEmail = user?.email || "";
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  if (!mounted) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-text-light text-sm">
          Loading checkout...
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-text-light text-lg">Your cart is empty.</p>
        <Link
          href="/shop"
          className="bg-primary hover:bg-primary-hover text-white text-sm font-medium py-2 px-6 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-light min-h-screen">
      {/* Page Header */}
      <div className="bg-dark-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-gray-medium">/</span>
            <span className="text-gray-medium">Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <form action={placeOrder}>
          {/* Hidden Fields */}
          <input
            type="hidden"
            name="order_items"
            value={JSON.stringify(cartItems)}
          />
          <input type="hidden" name="subtotal" value={totalPrice} />
          <input type="hidden" name="total" value={orderTotal} />
          <input type="hidden" name="payment_method" value={paymentMethod} />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Form */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Contact Info */}
              <div className="bg-white p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-dark">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-text font-medium">
                      First Name <span className="text-sale">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      placeholder="First name"
                      defaultValue={prefilledFirstName}
                      className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-text font-medium">
                      Last Name <span className="text-sale">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      placeholder="Last name"
                      defaultValue={prefilledLastName}
                      className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-text font-medium">
                    Email <span className="text-sale">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email address"
                    defaultValue={prefilledEmail}
                    className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-text font-medium">
                    Phone <span className="text-sale">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Phone number"
                    key={`phone-${selectedAddressId}`}
                    defaultValue={selectedAddress?.phone || ""}
                    className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-dark">
                  Shipping Address
                </h2>

                {addresses.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-text font-medium">
                      Use a saved address
                    </label>
                    <select
                      value={selectedAddressId || ""}
                      onChange={(e) =>
                        setSelectedAddressId(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-white"
                    >
                      <option value="">Enter a new address</option>
                      {addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.label || addr.city}
                          {addr.is_default ? " (Default)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-text font-medium">
                    Country
                  </label>
                  <select
                    name="country"
                    key={selectedAddressId}
                    defaultValue={selectedAddress?.country || "United States"}
                    className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-white"
                  >
                    <option value="United States">United States (US)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-text font-medium">
                    Street Address <span className="text-sale">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    key={`address-${selectedAddressId}`}
                    required
                    placeholder="House number and street name"
                    defaultValue={selectedAddress?.address || ""}
                    className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-text font-medium">
                    Town / City <span className="text-sale">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    key={`city-${selectedAddressId}`}
                    defaultValue={selectedAddress?.city || ""}
                    className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-text font-medium">
                    State <span className="text-sale">*</span>
                  </label>
                  <select
                    name="state"
                    required
                    defaultValue=""
                    className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-white"
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
                    required
                    key={`zip-${selectedAddressId}`}
                    placeholder="ZIP code"
                    maxLength={10}
                    defaultValue={selectedAddress?.postal_code || ""}
                    className="w-full border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-dark">Payment</h2>
                <p className="text-text-light text-sm">
                  All transactions are secure and encrypted.
                </p>

                {/* Bank Transfer */}
                <label
                  className={`flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                    paymentMethod === "bank_transfer"
                      ? "border-primary bg-primary/5"
                      : "border-gray-medium hover:border-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method_radio"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="mt-1 accent-primary"
                  />
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-text">
                      Direct Bank Transfer
                    </span>
                    {paymentMethod === "bank_transfer" && (
                      <div className="text-xs text-text-light bg-gray-light p-3 flex flex-col gap-1">
                        <p>Make your payment directly into our bank account.</p>
                        <p>
                          Please use your Order ID as the payment reference.
                        </p>
                        <p className="mt-2 font-medium text-text">
                          Account Name: {siteConfig.bankTransfer.accountName}
                        </p>
                        <p className="font-medium text-text">
                          Account Details:{" "}
                          {siteConfig.bankTransfer.accountNumber}
                        </p>
                        <p className="font-medium text-text">
                          Routing Number:{" "}
                          {siteConfig.bankTransfer.routingNumber}
                        </p>
                        <p className="font-medium text-text">
                          Bank Name: {siteConfig.bankTransfer.bankName}
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${
                    paymentMethod === "cash_on_delivery"
                      ? "border-primary bg-primary/5"
                      : "border-gray-medium hover:border-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method_radio"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={() => setPaymentMethod("cash_on_delivery")}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium text-text">
                    Cash on Delivery
                  </span>
                </label>
              </div>

              <SubmitButton />
            </div>

            {/* Right - Order Summary */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-white p-6 flex flex-col gap-4 sticky top-24">
                <h2 className="text-lg font-bold text-dark">Order Summary</h2>

                {/* Items */}
                <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 bg-gray-light shrink-0 overflow-visible">
                        {item.images?.[0] && (
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-contain"
                            sizes="56px"
                          />
                        )}
                        <span className="absolute -top-0.3 -right-2 bg-dark text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-text text-xs font-medium line-clamp-2">
                          {item.name}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-dark shrink-0">
                        {formatPrice(
                          (item.sale_price || item.price) * item.quantity,
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-medium pt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text">Subtotal</span>
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text">Shipping</span>
                    <span className="text-sm text-text-light">
                      {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-medium pt-3">
                    <span className="text-base font-bold text-dark">Total</span>
                    <span className="text-lg font-bold text-dark">
                      {formatPrice(orderTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
