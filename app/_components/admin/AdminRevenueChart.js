"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FILTERS = [
  { label: "1 Day", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
];

export default function AdminRevenueChart({ orders }) {
  const [days, setDays] = useState(7);

  const chartData = useMemo(() => {
    const now = new Date();
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
      return diffDays <= days;
    });

    const grouped = {};
    filtered.forEach((order) => {
      const date = new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!grouped[date]) {
        grouped[date] = { date, revenue: 0, orders: 0 };
      }
      grouped[date].revenue += order.total;
      grouped[date].orders += 1;
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  }, [orders, days]);

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-heading font-bold text-lg">Revenue Overview</h2>
        <div className="flex items-center gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setDays(filter.value)}
              className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                days === filter.value
                  ? "bg-primary text-white"
                  : "bg-gray-light text-text-light hover:bg-gray-medium"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-56 flex items-center justify-center">
          <p className="text-text-light text-sm">No orders in this period</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "var(--color-text-light)" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--color-text-light)" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-text)",
              }}
              formatter={(value, name) => [
                name === "revenue" ? `$${value.toFixed(2)}` : value,
                name === "revenue" ? "Revenue" : "Orders",
              ]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: "var(--color-primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
