"use client";

import * as React from "react";
import Link from "next/link";
import {
  Droplets,
  Coffee,
  UtensilsCrossed,
  Palette,
  Sprout,
  Grid3x3,
  ShoppingBag,
  Cookie,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/types";

const iconMap: Record<string, { icon: LucideIcon; color: string }> = {
  sabun: { icon: Droplets, color: "bg-blue-50 text-blue-600" },
  sampo: { icon: Droplets, color: "bg-purple-50 text-purple-600" },
  kopi: { icon: Coffee, color: "bg-amber-50 text-amber-700" },
  makanan: { icon: UtensilsCrossed, color: "bg-orange-50 text-orange-600" },
  minuman: { icon: Cookie, color: "bg-pink-50 text-pink-600" },
  kerajinan: { icon: Palette, color: "bg-teal-50 text-teal-600" },
  pertanian: { icon: Sprout, color: "bg-green-50 text-green-600" },
  pakaian: { icon: ShoppingBag, color: "bg-indigo-50 text-indigo-600" },
};

const fallback = { icon: Grid3x3, color: "bg-gray-50 text-gray-600" };

export function CategoryGrid() {
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="bg-background py-6">
      <div className="container-page">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold">Kategori</h2>
          <Link
            href="/produk"
            className="text-xs font-medium text-primary transition-colors hover:underline"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8">
          <Link
            href="/produk"
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform active:scale-95">
              <Grid3x3 className="h-6 w-6" />
            </div>
            <span className="text-center text-xs font-medium">Semua</span>
          </Link>
          {categories.map((c) => {
            const slug = c.slug?.toLowerCase() ?? "";
            const match = iconMap[slug] ?? fallback;
            const Icon = match.icon;
            return (
              <Link
                key={c.id}
                href={`/produk?cat=${c.slug}`}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-transform active:scale-95 ${match.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-center text-xs font-medium">
                  {c.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
