"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { supabaseAuth } from "@/app/_lib/supabase-auth";

export default function AdminNavbar({ session }) {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await supabaseAuth.auth.signOut();
    window.location.assign("/admin/login");
  }

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  }

  return (
    <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between pl-16 md:pl-6">
      <div>
        <h2 className="text-heading font-semibold">Welcome back!</h2>
        <p className="text-text-light text-xs">{session?.user?.email}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="cursor-pointer p-2 rounded-lg hover:bg-gray-medium text-text-light hover:text-heading transition-colors"
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={handleLogout}
          className="cursor-pointer flex items-center gap-2 bg-gray-light hover:bg-gray-medium text-text px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
