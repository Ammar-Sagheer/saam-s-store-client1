import {
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { formatPrice } from "@/app/_lib/helpers";

export default function AdminStats({
  totalProducts,
  totalOrders,
  totalRevenue,
  totalMessages,
}) {
  const stats = [
    {
      id: 1,
      title: "Total Products",
      value: totalProducts,
      icon: <ShoppingBagIcon className="w-6 h-6 text-white" />,
      bg: "bg-blue-500",
    },
    {
      id: 2,
      title: "Total Orders",
      value: totalOrders,
      icon: <ClipboardDocumentListIcon className="w-6 h-6 text-white" />,
      bg: "bg-primary",
    },
    {
      id: 3,
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: <CurrencyDollarIcon className="w-6 h-6 text-white" />,
      bg: "bg-success",
    },
    {
      id: 4,
      title: "Messages",
      value: totalMessages,
      icon: <EnvelopeIcon className="w-6 h-6 text-white" />,
      bg: "bg-sale",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-surface border border-border rounded-lg p-4 shadow-sm flex items-center gap-3"
        >
          <div className={`${stat.bg} p-2 rounded-lg shrink-0`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-text-light text-sm">{stat.title}</p>
            <p className="text-heading font-bold text-2xl">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
