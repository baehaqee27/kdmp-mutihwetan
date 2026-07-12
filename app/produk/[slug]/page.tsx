"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Package, Check } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/api";
import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/store/product-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ReviewSection } from "@/components/store/review-section";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = String(params.slug);
  const router = useRouter();
  const { add } = useCart();

  const [product, setProduct] = React.useState<Product | null>(null);
  const [related, setRelated] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    getProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        if (p) {
          getProducts({ categorySlug: p.category?.slug }).then((list) =>
            setRelated(list.filter((x) => x.id !== p.id).slice(0, 4))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-page grid gap-8 py-10 md:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-xl bg-muted" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page flex flex-col items-center gap-3 py-20 text-center">
        <Package className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-lg font-bold">Produk tidak ditemukan</h1>
        <Button asChild variant="outline">
          <Link href="/produk">Kembali ke Produk</Link>
        </Button>
      </div>
    );
  }

  const out = product.stock <= 0;

  const addToCart = () => {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const buyNow = () => {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
      qty
    );
    router.push("/checkout");
  };

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[
          { label: "Produk", href: "/produk" },
          ...(product.category
            ? [{ label: product.category.name, href: `/produk?cat=${product.category.slug}` }]
            : []),
          { label: product.name },
        ]}
        className="mb-6"
      />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Package className="h-16 w-16" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {product.category && (
            <Badge variant="outline" className="w-fit text-primary">
              {product.category.name}
            </Badge>
          )}
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-2xl font-bold text-primary">
            {formatRupiah(product.price)}
          </div>

          {product.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="text-sm">
            {out ? (
              <Badge variant="muted">Stok Habis</Badge>
            ) : (
              <span className="text-muted-foreground">
                Stok tersedia: <strong className="text-foreground">{product.stock}</strong>
              </span>
            )}
          </div>

          {!out && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Jumlah:</span>
              <div className="flex items-center rounded-lg border">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-accent active:scale-90"
                  aria-label="Kurang"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-accent active:scale-90"
                  aria-label="Tambah"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-3">
            <Button onClick={addToCart} disabled={out} variant="outline" size="lg">
              {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {added ? "Ditambahkan" : "Keranjang"}
            </Button>
            <Button onClick={buyNow} disabled={out} size="lg">
              Beli Sekarang
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-lg font-bold">Produk Terkait</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <ReviewSection productName={product.name} />
      </div>
    </div>
  );
}
