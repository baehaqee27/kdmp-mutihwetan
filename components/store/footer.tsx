import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { STORE } from "@/lib/constants";
import { Logo } from "@/components/store/logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-secondary/40">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold">
            <Logo size={32} />
            <span className="text-sm font-bold text-primary">{STORE.short}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Toko online resmi Koperasi Desa Merah Putih, Desa {STORE.village}.
            Belanja produk lokal berkualitas.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Navigasi</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="transition-colors hover:text-primary">Beranda</Link></li>
            <li><Link href="/produk" className="transition-colors hover:text-primary">Semua Produk</Link></li>
            <li><Link href="/tentang" className="transition-colors hover:text-primary">Tentang Kami</Link></li>
            <li><Link href="/kontak" className="transition-colors hover:text-primary">Kontak</Link></li>
            <li><Link href="/faq" className="transition-colors hover:text-primary">FAQ</Link></li>
            <li><Link href="/pesanan" className="transition-colors hover:text-primary">Lacak Pesanan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Pembayaran</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Transfer Bank</li>
            <li>QRIS</li>
            <li>COD (Bayar di Tempat)</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Kontak</h4>
          <a
            href={`https://wa.me/62${STORE.waAdmin.replace(/\D/g, "").replace(/^0/, "")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Admin
          </a>
        </div>
      </div>
      <div className="border-t py-4">
        <p className="container-page text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {STORE.name} - Desa {STORE.village}. Dibangun untuk warga desa.
        </p>
      </div>
    </footer>
  );
}
