"use client";

import * as React from "react";
import { X, Construction } from "lucide-react";

export function DevBanner() {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-semibold text-black">
      <Construction className="h-4 w-4" />
      <span>Situs ini masih dalam tahap pengembangan</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 rounded p-0.5 transition-colors hover:bg-amber-600 hover:text-white"
        aria-label="Tutup"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
