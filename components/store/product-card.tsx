"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-context";

function isNew(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const out = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const brandNew = product.created_at && isNew(product.created_at);

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Package className="h-10 w-10" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-0 top-0 flex flex-col gap-1 p-2">
          {brandNew && (
            <span className="rounded-md bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              BARU
            </span>
          )}
          {lowStock && (
            <span className="rounded-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              Stok Terbatas
            </span>
          )}
        </div>

        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.category && (
          <span className="text-[11px] font-medium text-primary">
            {product.category.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between pt-1">
          <span className="text-base font-bold text-primary">
            {formatRupiah(product.price)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={out}
            aria-label="Tambah ke keranjang"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all active:scale-90 hover:bg-primary/90 disabled:opacity-40"
            )}
          >
            <Plus
              className={cn(
                "h-4 w-4 transition-transform",
                added && "scale-125"
              )}
            />
          </button>
        </div>
      </div>
    </Link>
  );
}
