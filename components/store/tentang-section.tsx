import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";
import { STORE } from "@/lib/constants";

export function TentangSection() {
  return (
    <section className="bg-secondary/30 py-16">
      <div className="container-page">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Tentang Kami
            </span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              {STORE.name}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {STORE.name} ({STORE.short}) adalah lembaga koperasi yang
              bergerak di bidang pemberdayaan ekonomi desa. Kami menghimpun
              produk-produk unggulan dari UMKM dan petani lokal Desa{" "}
              {STORE.village} untuk dipasarkan secara online maupun offline.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Dengan berbelanja di {STORE.short}, Anda turut serta dalam
              membangun kesejahteraan masyarakat desa dan menjaga kelestarian
              produk lokal berkualitas.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:underline"
              >
                Pelajari Lebih Lanjut <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:underline"
              >
                Hubungi Kami <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative flex h-64 w-full max-w-sm items-center justify-center rounded-3xl bg-primary/5 md:h-72">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Handshake className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">Sejak 2024</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Melayani warga desa dengan sepenuh hati
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
