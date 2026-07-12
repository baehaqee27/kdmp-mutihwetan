"use client";

import * as React from "react";
import Link from "next/link";
import { Package, ClipboardList, Clock, ArrowRight } from "lucide-react";
import { adminGetAllProducts, adminGetOrders } from "@/lib/api";
import { formatRupiah, formatDate } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const pending = orders.filter((o) => o.status === "menunggu_konfirmasi").length;
  const revenue = orders
    .filter((o) => o.status === "selesai")
    .reduce((s, o) => s + o.total, 0);
  const recent = orders.slice(0, 6);

  const stats = [
    { label: "Total Produk", value: products.length, icon: Package },
    { label: "Total Pesanan", value: orders.length, icon: ClipboardList },
    { label: "Menunggu Konfirmasi", value: pending, icon: Clock },
  ];

  if (loading) {
    return <div className="text-sm text-muted-foreground">Memuat dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan toko koperasi</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
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

      <Card>
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold">Pesanan Terbaru</h2>
            <Link
              href="/admin/pesanan"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Belum ada pesanan.
            </p>
          ) : (
            <div className="divide-y">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.customer_name} - {formatDate(o.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {formatRupiah(o.total)}
                    </span>
                    <Badge className={statusMeta(o.status).color}>
                      {statusMeta(o.status).label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {orders.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Total omzet selesai: {formatRupiah(revenue)}
        </p>
      )}
    </div>
  );
}
