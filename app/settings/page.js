import { createSupabaseServer } from "@/app/_lib/supabase-server";
import AccountLoginPrompt from "@/app/_components/account/AccountLoginPrompt";
import SettingsForm from "@/app/_components/account/SettingsForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function SettingsPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AccountLoginPrompt />;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/account"
          className="p-2 text-text-light hover:text-primary hover:bg-gray-light rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">Account Settings</h1>
      </div>
      <SettingsForm user={user} profile={profile} />
    </div>
  );
}
