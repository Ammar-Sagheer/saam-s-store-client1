import { createSupabaseServer } from "@/app/_lib/supabase-server";
import AccountLoginPrompt from "@/app/_components/account/AccountLoginPrompt";
import AddressList from "@/app/_components/account/AddressList";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function AddressesPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AccountLoginPrompt />;
  }

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/account"
          className="p-2 text-text-light hover:text-primary hover:bg-gray-light rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">Saved Addresses</h1>
      </div>
      <AddressList addresses={addresses || []} />
    </div>
  );
}
