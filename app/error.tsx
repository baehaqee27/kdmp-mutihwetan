"use client";

import { RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <RefreshCw className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-xl font-bold">Terjadi Kesalahan</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error.message || "Sepertinya ada yang salah. Silakan coba lagi."}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline">
          <RefreshCw className="h-4 w-4" /> Coba Lagi
        </Button>
        <Button onClick={() => (window.location.href = "/")}>
          <Home className="h-4 w-4" /> Beranda
        </Button>
      </div>
    </div>
  );
}
