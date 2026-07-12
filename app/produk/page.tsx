"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package } from "lucide-react";
import { getCategories, getProducts } from "@/lib/api";
import { ProductCard } from "@/components/store/product-card";
import type { Category, Product } from "@/lib/types";

function ProductsContent() {
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat") ?? "semua";
  const searchParam = searchParams.get("search") ?? "";

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState(searchParam);

  React.useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([getCategories(), getProducts({ categorySlug: cat, search })])
      .then(([c, p]) => {
        setCategories(c);
        setProducts(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cat, search]);

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Produk Koperasi</h1>
        <p className="text-sm text-muted-foreground">
          Produk lokal berkualitas dari Desa Mutih Wetan
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Link
            href="/produk"
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              cat === "semua"
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            Semua
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/produk?cat=${c.slug}`}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                cat === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Package className="h-8 w-8" />
          <p className="text-sm">Tidak ada produk yang cocok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProdukPage() {
  return (
    <React.Suspense fallback={<div className="container-page py-8 text-sm text-muted-foreground">Memuat...</div>}>
      <ProductsContent />
    </React.Suspense>
  );
}
