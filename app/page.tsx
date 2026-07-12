"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  QrCode,
  Banknote,
  Truck,
  Leaf,
  ArrowRight,
  Package,
} from "lucide-react";
import { STORE, PAYMENT_METHODS } from "@/lib/constants";
import { getCategories, getProducts } from "@/lib/api";
import { waLink } from "@/lib/wa";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import { WaveDivider } from "@/components/store/wave-divider";
import { KeunggulanSection } from "@/components/store/keunggulan";
import { StatsSection } from "@/components/store/stats";
import { TestimoniSection } from "@/components/store/testimoni";
import { TentangSection } from "@/components/store/tentang-section";
import { CTASection } from "@/components/store/cta-section";
import { PromoBanner } from "@/components/store/promo-banner";
import type { Category, Product } from "@/lib/types";

export default function HomePage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([getCategories(), getProducts()])
      .then(([c, p]) => {
        setCategories(c);
        setProducts(p.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-primary text-primary-foreground lg:min-h-[100vh]">
        <Image
          src="/hero.png"
          alt="Koperasi Desa Merah Putih"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        <div className="container-page relative grid items-center gap-8 py-16 md:grid-cols-2">
          <div className="flex flex-col justify-center gap-5 animate-fade-in">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Leaf className="h-3.5 w-3.5" /> Produk Lokal Desa {STORE.village}
            </span>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              {STORE.tagline}
            </h1>
            <p className="max-w-md text-sm text-primary-foreground/90 md:text-base">
              Dukung ekonomi desa dengan berbelanja produk berkualitas dari{" "}
              {STORE.short}. Mudah, aman, dan bisa bayar melalui transfer, QRIS,
              maupun COD.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/produk">
                  <ShoppingBag className="h-4 w-4" /> Belanja Sekarang
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <a
                  href={waLink(
                    STORE.waAdmin,
                    `Halo ${STORE.name}, saya mau tanya produk.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Hubungi WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="hidden items-center justify-center md:flex">
            <div className="grid w-full max-w-sm grid-cols-2 gap-4">
              {[
                { icon: Banknote, label: "Transfer Bank" },
                { icon: QrCode, label: "QRIS" },
                { icon: Truck, label: "COD" },
                { icon: ShoppingBag, label: "Gratis Ongkir Desa" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-5 text-center backdrop-blur transition-transform hover:-translate-y-1"
                >
                  <f.icon className="h-7 w-7" />
                  <span className="text-xs font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner />

      {/* Wave: hero -> white */}
      <WaveDivider />

      {/* Categories */}
      <section className="container-page py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Kategori</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/produk"
            className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Semua
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/produk?cat=${c.slug}`}
              className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-page py-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold">Produk Unggulan</h2>
            <p className="text-sm text-muted-foreground">
              Pilihan terbaik dari koperasi desa
            </p>
          </div>
          <Link
            href="/produk"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
          >
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
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
            <p className="text-sm">
              Belum ada produk. Hubungi admin untuk menambah.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Stats */}
      <StatsSection />

      {/* Wave: red -> white */}
      <WaveDivider />

      {/* Keunggulan */}
      <KeunggulanSection />

      {/* Payment info */}
      <section className="container-page py-10">
        <div className="rounded-2xl border bg-secondary/40 p-6 md:p-8">
          <h2 className="mb-1 text-lg font-bold">Cara Bayar</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Pilih metode yang paling mudah untuk Anda.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {PAYMENT_METHODS.map((m) => {
              const Icon =
                m.id === "transfer"
                  ? Banknote
                  : m.id === "qris"
                    ? QrCode
                    : Truck;
              return (
                <div
                  key={m.id}
                  className="flex gap-3 rounded-xl bg-background p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{m.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {m.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tentang */}
      <TentangSection />

      {/* Testimoni */}
      <TestimoniSection />

      {/* Wave: white -> red */}
      <WaveDivider flip />

      {/* CTA */}
      <CTASection />
    </div>
  );
}
