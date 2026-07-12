import Link from "next/link";
import { SearchX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold">404</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Halaman yang Anda cari tidak ditemukan atau sudah dipindahkan.
      </p>
      <Button asChild>
        <Link href="/">
          <Home className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </Button>
    </div>
  );
}
