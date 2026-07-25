"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddressForm from "./AddressForm";
import { deleteAddressAction } from "@/app/_lib/actions";
import toast from "react-hot-toast";

export default function AddressList({ addresses }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  function openAddForm() {
    setEditingAddress(null);
    setShowForm(true);
  }

  function openEditForm(address) {
    setEditingAddress(address);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingAddress(null);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this address?")) return;
    setDeletingId(id);
    try {
      await deleteAddressAction(id);
      toast.success("Address deleted");
      router.refresh();
    } catch (err) {
      toast.error("Failed to delete address");
    }
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {showForm ? (
        <AddressForm address={editingAddress} onClose={closeForm} />
      ) : (
        <button
          onClick={openAddForm}
          className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-gray-medium hover:border-primary text-text-light hover:text-primary font-medium py-4 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Address
        </button>
      )}

      {addresses.length === 0 && !showForm && (
        <p className="text-text-light text-sm text-center py-8">
          You don&apos;t have any saved addresses yet.
        </p>
      )}

      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="border border-gray-medium rounded-lg p-5 flex items-start justify-between gap-4"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {addr.label && (
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {addr.label}
                </span>
              )}
              {addr.is_default && (
                <span className="text-xs font-bold text-white bg-primary px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </div>
            <p className="font-medium text-dark text-sm">
              {addr.first_name} {addr.last_name}
            </p>
            <p className="text-text-light text-sm">{addr.phone}</p>
            <p className="text-text-light text-sm">
              {addr.address}, {addr.city}, {addr.state} {addr.postal_code}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openEditForm(addr)}
              className="cursor-pointer p-2 text-text-light hover:text-primary hover:bg-gray-light rounded transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(addr.id)}
              disabled={deletingId === addr.id}
              className="cursor-pointer p-2 text-text-light hover:text-sale hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
