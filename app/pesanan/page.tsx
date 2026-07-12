"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package, MessageCircle, ChevronRight } from "lucide-react";
import { getOrderTracking } from "@/lib/api";
import { waLink } from "@/lib/wa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatDate } from "@/lib/utils";
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

function TrackingContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = React.useState(
    searchParams.get("order") ?? ""
  );
  const [phone, setPhone] = React.useState(searchParams.get("phone") ?? "");
  const [result, setResult] = React.useState<{
    order: Order;
    items: OrderItem[];
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!orderNumber.trim() || !phone.trim()) {
      setError("No. Order dan nomor WhatsApp wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await getOrderTracking(orderNumber.trim(), phone.trim());
      if (!res) {
        setError("Pesanan tidak ditemukan. Periksa No. Order dan nomor WhatsApp.");
      } else {
        setResult(res);
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page max-w-2xl py-8">
      <h1 className="text-2xl font-bold">Lacak Pesanan</h1>
      <p className="text-sm text-muted-foreground">
        Masukkan No. Order dan nomor WhatsApp Anda.
      </p>

      <form
        onSubmit={track}
        className="mt-6 grid gap-3 rounded-xl border bg-card p-5 sm:grid-cols-[1fr_1fr_auto]"
      >
        <div className="space-y-1.5">
          <Label htmlFor="on">No. Order</Label>
          <Input
            id="on"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="KMP20250101xxxx"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ph">Nomor WhatsApp</Label>
          <Input
            id="ph"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            <Search className="h-4 w-4" /> Lacak
          </Button>
        </div>
      </form>

      {error && (
        <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card p-5">
            <div>
              <p className="text-xs text-muted-foreground">No. Order</p>
              <p className="font-bold">{result.order.order_number}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(result.order.created_at)}
              </p>
            </div>
            <Badge className={statusMeta(result.order.status).color}>
              {statusMeta(result.order.status).label}
            </Badge>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-3 text-sm font-bold">Item Pesanan</h2>
            <div className="space-y-2">
              {result.items.map((it) => (
                <div key={it.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {it.qty}x {it.product_name}
                  </span>
                  <span className="font-medium">
                    {formatRupiah(it.qty * it.price)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 border-t pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ongkir</span>
                <span>
                  {result.order.ongkir > 0
                    ? formatRupiah(result.order.ongkir)
                    : "Gratis / Menyusul"}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {formatRupiah(result.order.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <a
                href={waLink(
                  STORE.waAdmin,
                  `Halo, saya cek pesanan ${result.order.order_number}.`
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> Hubungi Admin
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/produk">Belanja Lagi</Link>
            </Button>
          </div>
        </div>
      )}

      {!result && !error && (
        <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border border-dashed py-12 text-muted-foreground">
          <Package className="h-8 w-8" />
          <p className="text-sm">Belum ada pesanan yang dilacak.</p>
        </div>
      )}
    </div>
  );
}

export default function PesananPage() {
  return (
    <React.Suspense fallback={<div className="container-page py-8 text-sm text-muted-foreground">Memuat...</div>}>
      <TrackingContent />
    </React.Suspense>
  );
}
