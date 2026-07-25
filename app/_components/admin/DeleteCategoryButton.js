"use client";

import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { deleteCategoryAction } from "@/app/_lib/actions";
import ConfirmModal from "./ConfirmModal";

export default function DeleteCategoryButton({ categoryId, productCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleClick() {
    if (productCount > 0) {
      toast.error(`Cannot delete. This category has ${productCount} products.`);
      return;
    }
    setIsOpen(true);
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      await deleteCategoryAction(categoryId);
      toast.success("Category deleted successfully");
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to delete category");
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="cursor-pointer p-2 text-text-light hover:text-sale hover:bg-gray-light rounded transition-colors"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        loading={loading}
      />
    </>
  );
}
