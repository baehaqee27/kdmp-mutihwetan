"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";

export default function CartPage() {
  const { items, setQty, remove, total, count } = useCart();

  if (count === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-bold">Keranjang kosong</h1>
        <p className="text-sm text-muted-foreground">
          Belum ada produk di keranjang Anda.
        </p>
        <Button asChild>
          <Link href="/produk">Mulai Belanja</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold">Keranjang Belanja</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border bg-card p-3 transition-shadow hover:shadow-sm"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/produk/${item.slug}`}
                  className="line-clamp-2 text-sm font-semibold transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm font-bold text-primary">
                  {formatRupiah(item.price)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center rounded-lg border">
                  <button
                    type="button"
                    onClick={() => setQty(item.id, item.qty - 1)}
                    className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-accent active:scale-90"
                    aria-label="Kurang"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(item.id, item.qty + 1)}
                    className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-accent active:scale-90"
                    aria-label="Tambah"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl border bg-card p-5 lg:sticky lg:top-20">
          <h2 className="mb-4 text-base font-bold">Ringkasan</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total ({count} item)</span>
            <span className="font-bold">{formatRupiah(total)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Ongkos kirim dihitung saat checkout. Gratis untuk Desa Mutih Wetan.
          </p>
          <Button asChild size="lg" className="mt-4 w-full">
            <Link href="/checkout">
              Lanjut Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link href="/produk">Tambah Produk</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
