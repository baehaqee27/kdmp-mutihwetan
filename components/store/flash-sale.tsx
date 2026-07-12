"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types";

function Countdown() {
  const [time, setTime] = React.useState({ h: 0, m: 0, s: 0 });

  React.useEffect(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const tick = () => {
      const now = new Date();
      const diff = Math.max(
        0,
        Math.floor((end.getTime() - now.getTime()) / 1000)
      );
      setTime({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1">
      {[time.h, time.m, time.s].map((val, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="text-xs font-bold text-primary">:</span>
          )}
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[11px] font-bold tabular-nums text-primary-foreground">
            {pad(val)}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export function FlashSale({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-background py-6">
      <div className="container-page">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold">Flash Sale</h2>
            </div>
            <Countdown />
          </div>
          <Link
            href="/produk"
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
