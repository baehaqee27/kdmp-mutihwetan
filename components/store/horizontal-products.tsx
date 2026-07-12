"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types";

interface HorizontalProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
}

export function HorizontalProducts({
  title,
  subtitle,
  products,
  href = "/produk",
}: HorizontalProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-background py-6">
      <div className="container-page">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-base font-bold">{title}</h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:underline"
          >
            Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2 sm:container-page sm:px-0">
          {products.map((p) => (
            <div key={p.id} className="w-[140px] shrink-0 sm:w-auto sm:flex-1">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
