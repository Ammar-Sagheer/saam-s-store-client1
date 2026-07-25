import Link from "next/link";
import { createSupabaseServer } from "@/app/_lib/supabase-server";
import AccountLoginPrompt from "@/app/_components/account/AccountLoginPrompt";
import Pagination from "@/app/_components/admin/Pagination";
import { formatPrice } from "@/app/_lib/helpers";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const PAGE_SIZE = 10;

function StatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-bold text-white capitalize ${
        status === "delivered"
          ? "bg-success"
          : status === "shipped"
            ? "bg-blue-500"
            : status === "processing"
              ? "bg-yellow-500"
              : "bg-sale"
      }`}
    >
      {status}
    </span>
  );
}

export default async function OrdersPage({ searchParams }) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AccountLoginPrompt />;
  }

  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: orders, count } = await supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("tenant_id", process.env.TENANT_ID)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/account"
          className="p-2 text-text-light hover:text-primary hover:bg-gray-light rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">My Orders</h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="bg-gray-light rounded-lg p-8 text-center">
          <p className="text-text-light text-sm mb-3">
            You haven&apos;t placed any orders yet.
          </p>
          <Link href="/shop" className="text-primary text-sm hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-medium rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-dark text-sm">
                    Order #{order.id}
                  </p>
                  <p className="text-text-light text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-primary text-sm">
                    {formatPrice(order.total)}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/orders"
          />
        </>
      )}
    </div>
  );
}
