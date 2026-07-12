"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getMyOrders } from "@/lib/api";
import { waLink } from "@/lib/wa";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS, STORE } from "@/lib/constants";
import type { Order } from "@/lib/types";

function statusMeta(status: string) {
  return (
    ORDER_STATUS.find((s) => s.id === status) ?? {
      id: status,
      label: status,
      color: "bg-muted text-muted-foreground",
    }
  );
}

export default function PesananSayaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/masuk?redirect=/akun/pesanan");
    }
  }, [authLoading, user, router]);

  React.useEffect(() => {
    if (user?.email) {
      getMyOrders(user.email)
        .then(setOrders)
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="container-page py-8 text-sm text-muted-foreground">
        Memuat...
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl py-8">
      <h1 className="mb-1 text-2xl font-bold">Pesanan Saya</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Riwayat transaksi {user?.name || user?.email}
      </p>

      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Package className="h-8 w-8" />
          <p className="text-sm">Belum ada pesanan.</p>
          <Button asChild>
            <Link href="/produk">Mulai Belanja</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold">{o.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(o.created_at)} - {o.desa}
                  </p>
                </div>
                <Badge className={statusMeta(o.status).color}>
                  {statusMeta(o.status).label}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <span className="text-sm font-bold text-primary">
                  {formatRupiah(o.total)}
                </span>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/pesanan?order=${o.order_number}&phone=${o.phone}`}
                    >
                      Detail
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <a
                      href={waLink(
                        STORE.waAdmin,
                        `Halo, cek pesanan ${o.order_number}.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
