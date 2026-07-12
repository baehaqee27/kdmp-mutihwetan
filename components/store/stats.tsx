"use client";

import * as React from "react";
import { ShoppingBag, Users, MapPin, Award } from "lucide-react";

const stats = [
  { icon: ShoppingBag, value: 500, suffix: "+", label: "Produk Terjual" },
  { icon: Users, value: 200, suffix: "+", label: "Anggota Aktif" },
  { icon: MapPin, value: 6, suffix: "", label: "Desa Terjangkau" },
  { icon: Award, value: 100, suffix: "%", label: "Produk Lokal" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const hasRun = React.useRef(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const duration = 1500;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl font-bold md:text-4xl">
      {count.toLocaleString("id-ID")}
      {suffix}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="bg-primary py-14 text-primary-foreground">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <s.icon className="h-6 w-6" />
              </div>
              <Counter value={s.value} suffix={s.suffix} />
              <p className="mt-1 text-sm text-primary-foreground/80">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
