"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Truck, Timer } from "lucide-react";
import { STORE } from "@/lib/constants";
import { waLink } from "@/lib/wa";

function CountdownTimer() {
  const [time, setTime] = React.useState({ h: 0, m: 0, s: 0 });

  React.useEffect(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const tick = () => {
      const now = new Date();
      const diff = Math.max(
        0,
        Math.floor((end.getTime() - now.getTime()) / 1000),
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
    <div className="flex items-center gap-1.5">
      {[
        { val: time.h, label: "J" },
        { val: time.m, label: "M" },
        { val: time.s, label: "D" },
      ].map((t, i) => (
        <React.Fragment key={t.label}>
          {i > 0 && <span className="text-sm font-bold text-white/60">:</span>}
          <div className="flex flex-col items-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 text-sm font-bold tabular-nums backdrop-blur sm:h-9 sm:w-9">
              {pad(t.val)}
            </span>
            <span className="mt-0.5 text-[10px] text-white/70">{t.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-1/2 -left-1/4 h-full w-full rounded-full bg-white/20" />
        <div className="absolute -bottom-1/2 -right-1/4 h-full w-full rounded-full bg-white/10" />
      </div>

      <div className="container-page relative py-6 sm:py-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <Zap className="h-3.5 w-3.5" /> Promo Hari Ini
            </div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Gratis Ongkir untuk Desa {STORE.village}
            </h2>
            <p className="max-w-md text-sm text-white/85">
              Berbelanja tanpa biaya pengiriman untuk wilayah {STORE.freeDesa}.
              Berlaku untuk semua produk tanpa minimal pembelian.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/produk"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Belanja Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Timer className="h-4 w-4" />
                <span>Berlaku hingga:</span>
                <CountdownTimer />
              </div>
            </div>
          </div>

          <div className="hidden shrink-0 lg:block">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Truck className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
