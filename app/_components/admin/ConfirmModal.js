"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-60 w-[90%] max-w-md bg-surface border border-border rounded-lg shadow-xl p-6 flex flex-col gap-4">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 mx-auto">
          <ExclamationTriangleIcon className="w-6 h-6 text-sale" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-heading">{title}</h3>
          <p className="text-text-light text-sm mt-1">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer flex-1 bg-surface border border-gray-medium text-text font-medium py-2 rounded-lg hover:bg-gray-light transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="cursor-pointer flex-1 bg-sale hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </>
  );
}
