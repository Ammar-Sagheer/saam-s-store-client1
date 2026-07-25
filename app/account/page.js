import { createSupabaseServer } from "@/app/_lib/supabase-server";
import AccountLoginPrompt from "@/app/_components/account/AccountLoginPrompt";
import AccountDashboard from "@/app/_components/account/AccountDashboard";

export default async function AccountPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AccountLoginPrompt />;
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("tenant_id", process.env.TENANT_ID)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return <AccountDashboard user={user} orders={orders || []} />;
}
