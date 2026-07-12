"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { STORE } from "@/lib/constants";
import { waLink } from "@/lib/wa";

export function WhatsAppFloat() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={waLink(
        STORE.waAdmin,
        `Halo ${STORE.name}, saya ingin bertanya tentang produk.`
      )}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-[#25D366]" />
      </span>
    </a>
  );
}
