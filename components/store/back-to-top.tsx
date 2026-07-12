"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Kembali ke atas"
      className={`fixed bottom-6 right-24 z-50 flex h-10 w-10 items-center justify-center rounded-full border bg-background text-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
