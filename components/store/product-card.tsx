"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-context";

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

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
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
        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Badge variant="muted">Stok Habis</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category && (
          <span className="text-xs font-medium text-primary">
            {product.category.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-foreground">
            {formatRupiah(product.price)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={out}
            aria-label="Tambah ke keranjang"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all active:scale-90 hover:bg-primary/90 disabled:opacity-40"
            )}
          >
            <Plus className={cn("h-4 w-4 transition-transform", added && "scale-125")} />
          </button>
        </div>
      </div>
    </Link>
  );
}
