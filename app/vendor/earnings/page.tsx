"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { IndianRupee, TrendingUp, Percent, ShoppingBag } from "lucide-react";

interface EarningsSummary {
  totalRevenue: number;
  platformFee: number;
  netEarnings: number;
  commissionRate: number;
  totalOrders: number;
}

interface Transaction {
  id: string;
  orderNumber: string;
  title: string;
  quantity: number;
  amount: number;
  fee: number;
  net: number;
  status: string;
  date: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  fee: number;
  net: number;
}

export default function VendorEarningsPage() {
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/earnings")
      .then((r) => r.json())
      .then((data) => {
        setSummary(data.summary || null);
        setTransactions(data.recentTransactions || []);
        setMonthlyData(data.monthlyData || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  const stats = summary
    ? [
        { label: "Total Revenue", value: formatPrice(summary.totalRevenue), icon: IndianRupee, color: "bg-blue-50 text-blue-700" },
        { label: "Platform Fee", value: formatPrice(summary.platformFee), icon: Percent, color: "bg-red-50 text-red-700" },
        { label: "Net Earnings", value: formatPrice(summary.netEarnings), icon: TrendingUp, color: "bg-emerald-50 text-emerald-700" },
        { label: "Total Orders", value: summary.totalOrders.toString(), icon: ShoppingBag, color: "bg-amber-50 text-amber-700" },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Earnings</h1>
        <p className="mt-1 text-sm text-stone-500">
          Track your revenue, fees, and net earnings.
          {summary && (
            <span className="ml-1 text-stone-400">
              Platform commission rate: {summary.commissionRate}%
            </span>
          )}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-stone-900">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Breakdown */}
      {monthlyData.length > 0 && (
        <div className="bg-white rounded-lg border border-stone-200 mb-6">
          <div className="p-5 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900">Monthly Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Month</th>
                  <th className="px-5 py-3 text-right">Revenue</th>
                  <th className="px-5 py-3 text-right">Platform Fee</th>
                  <th className="px-5 py-3 text-right">Net Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {monthlyData.map((m) => (
                  <tr key={m.month}>
                    <td className="px-5 py-3 font-medium text-stone-900">
                      {new Date(m.month + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-right text-stone-600">{formatPrice(m.revenue)}</td>
                    <td className="px-5 py-3 text-right text-red-600">-{formatPrice(m.fee)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-emerald-700">{formatPrice(m.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-stone-200">
        <div className="p-5 border-b border-stone-200">
          <h2 className="font-semibold text-stone-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {transactions.map((t) => (
            <div key={t.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-900">{t.title}</p>
                <p className="text-xs text-stone-500">
                  Order #{t.orderNumber} &middot; Qty: {t.quantity} &middot;{" "}
                  {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-700">+{formatPrice(t.net)}</p>
                <p className="text-xs text-stone-400">Fee: -{formatPrice(t.fee)}</p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="p-8 text-center text-sm text-stone-400">No transactions yet. Start selling to see your earnings!</div>
          )}
        </div>
      </div>
    </div>
  );
}
