"use client";

import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { deleteMessageAction } from "@/app/_lib/actions";
import ConfirmModal from "./ConfirmModal";

export default function DeleteMessageButton({ messageId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await deleteMessageAction(messageId);
      toast.success("Message deleted successfully");
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to delete message");
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer p-2 text-text-light hover:text-sale hover:bg-gray-light rounded transition-colors"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        loading={loading}
      />
    </>
  );
}
