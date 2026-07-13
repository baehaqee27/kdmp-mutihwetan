"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Package, Check } from "lucide-react";
import { getProducts } from "@/lib/api";
import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/store/product-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ReviewSection } from "@/components/store/review-section";
import { ImageLightbox } from "@/components/store/image-lightbox";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();

  const [related, setRelated] = React.useState<Product[]>([]);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    getProducts({ categorySlug: product.category?.slug }).then((list) =>
      setRelated(list.filter((x) => x.id !== product.id).slice(0, 4))
    );
  }, [product]);

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
            <ImageLightbox src={product.image_url} alt={product.name} />
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
        <ReviewSection productId={product.id} productName={product.name} />
      </div>
    </div>
  );
}
