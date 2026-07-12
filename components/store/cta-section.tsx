import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { STORE } from "@/lib/constants";
import { waLink } from "@/lib/wa";

export function CTASection() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container-page text-center">
        <div className="mx-auto max-w-lg">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
              <MessageCircle className="h-7 w-7" />
            </div>
          </div>
          <h2 className="text-2xl font-bold md:text-3xl">
            Ada Pertanyaan? Hubungi Kami
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/85">
            Tim {STORE.short} siap membantu Anda menemukan produk yang tepat
            atau menjawab pertanyaan seputar pesanan.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={waLink(
                STORE.waAdmin,
                `Halo ${STORE.name}, saya ingin bertanya.`
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <MessageCircle className="h-4 w-4" /> Chat WhatsApp
            </a>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Lihat Kontak <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
