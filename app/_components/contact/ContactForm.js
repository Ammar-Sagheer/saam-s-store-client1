"use client";

import { useFormStatus } from "react-dom";
import { submitContactForm } from "@/app/_lib/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer bg-primary hover:bg-primary-hover text-white font-medium py-3 transition-colors uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
}

export default function ContactForm() {
  return (
    <form action={submitContactForm} className="flex flex-col gap-4">
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
            className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-white"
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
            className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-white"
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
          className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-white"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-text font-medium">Subject</label>
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-white"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-text font-medium">
          Message <span className="text-sale">*</span>
        </label>
        <textarea
          name="message"
          required
          placeholder="Your message..."
          rows={5}
          className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors bg-white resize-none"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
