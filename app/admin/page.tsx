"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  ClipboardList,
  Clock,
  DollarSign,
  ArrowRight,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { adminGetAllProducts, adminGetOrders } from "@/lib/api";
import { formatRupiah, formatDate } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Order, Product } from "@/lib/types";

function statusMeta(status: string) {
  return (
    ORDER_STATUS.find((s) => s.id === status) ?? {
      id: status,
      label: status,
      color: "bg-muted text-muted-foreground",
    }
  );
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function getMonthlyRevenue(orders: Order[]) {
  const now = new Date();
  const year = now.getFullYear();
  return MONTHS.map((month, i) => {
    const total = orders
      .filter((o) => {
        const d = new Date(o.created_at);
        return (
          d.getFullYear() === year &&
          d.getMonth() === i &&
          o.status === "selesai"
        );
      })
      .reduce((s, o) => s + o.total, 0);
    return { name: month, total };
  });
}

function getOrdersPerMonth(orders: Order[]) {
  const now = new Date();
  const year = now.getFullYear();
  return MONTHS.map((month, i) => {
    const count = orders.filter((o) => {
      const d = new Date(o.created_at);
      return d.getFullYear() === year && d.getMonth() === i;
    }).length;
    return { name: month, total: count };
  });
}

export default function AdminDashboard() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([adminGetAllProducts(), adminGetOrders()])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending = orders.filter(
    (o) => o.status === "menunggu_konfirmasi"
  ).length;
  const revenue = orders
    .filter((o) => o.status === "selesai")
    .reduce((s, o) => s + o.total, 0);
  const recent = orders.slice(0, 8);
  const monthlyRevenue = getMonthlyRevenue(orders);
  const monthlyOrders = getOrdersPerMonth(orders);

  const stats = [
    {
      label: "Total Produk",
      value: products.length,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Pesanan",
      value: orders.length,
      icon: ShoppingCart,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Omzet Selesai",
      value: formatRupiah(revenue),
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Menunggu",
      value: pending,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan toko koperasi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-lg ${s.color}`}
              >
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="analytics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Revenue Chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Omzet Bulanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenue}>
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) =>
                        v >= 1000000
                          ? `${(v / 1000000).toFixed(0)}jt`
                          : v >= 1000
                            ? `${(v / 1000).toFixed(0)}rb`
                            : v
                      }
                    />
                    <Tooltip
                      formatter={(value) => [formatRupiah(Number(value)), "Omzet"]}
                    />
                    <Bar
                      dataKey="total"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    Pesanan Terbaru
                  </CardTitle>
                  <Link
                    href="/admin/pesanan"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Lihat Semua
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recent.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada pesanan.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recent.map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {o.customer_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {o.customer_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {o.order_number}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {formatRupiah(o.total)}
                          </p>
                          <Badge
                            className={`text-[10px] ${statusMeta(o.status).color}`}
                          >
                            {statusMeta(o.status).label}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Orders per month */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Pesanan per Bulan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyOrders}>
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="total"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Summary stats */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Ringkasan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">Pesanan Selesai</span>
                  </div>
                  <span className="text-sm font-bold">
                    {orders.filter((o) => o.status === "selesai").length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Perlu Diproses</span>
                  </div>
                  <span className="text-sm font-bold">{pending}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Total Produk Aktif</span>
                  </div>
                  <span className="text-sm font-bold">
                    {products.filter((p) => p.active).length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm">Rata-rata Pesanan</span>
                  </div>
                  <span className="text-sm font-bold">
                    {orders.length > 0
                      ? formatRupiah(
                          Math.round(
                            orders.reduce((s, o) => s + o.total, 0) /
                              orders.length
                          )
                        )
                      : formatRupiah(0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
