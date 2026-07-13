"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Package, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getOrderTracking } from "@/lib/api";
import { waLink } from "@/lib/wa";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ORDER_STATUS, STORE } from "@/lib/constants";
import type { Order, OrderItem } from "@/lib/types";

function statusMeta(status: string) {
  return (
    ORDER_STATUS.find((s) => s.id === status) ?? {
      id: status,
      label: status,
      color: "bg-muted text-muted-foreground",
    }
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = String(params.id);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = React.useState<Order | null>(null);
  const [items, setItems] = React.useState<OrderItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/masuk?redirect=/akun/pesanan");
    }
  }, [authLoading, user, router]);

  React.useEffect(() => {
    if (!user) return;

    const fetchOrder = async () => {
      try {
        const { data: o, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .eq("user_id", user.id)
          .single();

        if (error || !o) {
          setLoading(false);
          return;
        }

        setOrder(o as Order);

        const { data: itemsData } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId);

        setItems((itemsData ?? []) as OrderItem[]);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  if (authLoading || loading) {
    return (
      <div className="container-page py-8 text-sm text-muted-foreground">
        Memuat...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-page flex flex-col items-center gap-3 py-20 text-center">
        <Package className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-lg font-bold">Pesanan tidak ditemukan</h1>
        <Button asChild variant="outline">
          <Link href="/akun/pesanan">Kembali</Link>
        </Button>
      </div>
    );
  }

  const meta = statusMeta(order.status);

  return (
    <div className="container-page max-w-3xl py-8">
      <Breadcrumb
        items={[
          { label: "Pesanan Saya", href: "/akun/pesanan" },
          { label: order.order_number },
        ]}
        className="mb-6"
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.created_at)}
          </p>
        </div>
        <Badge className={meta.color}>{meta.label}</Badge>
      </div>

      <div className="space-y-4">
        {/* Info Penerima */}
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-3 text-base font-bold">Info Penerima</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Nama</p>
              <p className="font-medium">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">WhatsApp</p>
              <p className="font-medium">{order.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Alamat</p>
              <p className="font-medium">{order.address}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Desa</p>
              <p className="font-medium">{order.desa}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Pembayaran</p>
              <p className="font-medium capitalize">{order.payment_method}</p>
            </div>
          </div>
        </section>

        {/* Item Pesanan */}
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-3 text-base font-bold">Item Pesanan</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.qty} x {formatRupiah(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-primary">
                  {formatRupiah(item.qty * item.price)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatRupiah(order.total - order.ongkir)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ongkir</span>
              <span>{order.ongkir === 0 ? "Gratis" : formatRupiah(order.ongkir)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-primary">{formatRupiah(order.total)}</span>
            </div>
          </div>
        </section>

        {/* Bukti Bayar */}
        {order.proof_url && (
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-3 text-base font-bold">Bukti Pembayaran</h2>
            <a href={order.proof_url} target="_blank" rel="noreferrer">
              <img
                src={order.proof_url}
                alt="Bukti bayar"
                className="max-h-64 rounded-lg border object-contain"
              />
            </a>
          </section>
        )}

        {/* Catatan */}
        {order.note && (
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-3 text-base font-bold">Catatan</h2>
            <p className="text-sm text-muted-foreground">{order.note}</p>
          </section>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/akun/pesanan">
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Link>
          </Button>
          <Button asChild>
            <a
              href={waLink(
                STORE.waAdmin,
                `Halo, saya ingin menanyakan pesanan ${order.order_number}.`
              )}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Hubungi Admin
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
