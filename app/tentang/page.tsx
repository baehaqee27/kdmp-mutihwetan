import {
  Handshake,
  Target,
  Eye,
  Users,
  MapPin,
  Heart,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { STORE } from "@/lib/constants";
import { waLink } from "@/lib/wa";
import { WaveDivider } from "@/components/store/wave-divider";

const values = [
  {
    icon: Heart,
    title: "Melayani dengan Ikhlas",
    desc: "Setiap produk yang kami jual adalah cerminan kepedulian kami terhadap kesejahteraan warga desa.",
  },
  {
    icon: Users,
    title: "Gotong Royong",
    desc: "Kami percaya bahwa kekuatan terbesar desa ada pada semangat kebersamaan dan gotong royong.",
  },
  {
    icon: Target,
    title: "Kualitas Terjamin",
    desc: "Produk yang kami pasarkan telah melalui proses kurasi dan pengecekan kualitas.",
  },
  {
    icon: MapPin,
    title: "Berakar di Desa",
    desc: "Kami lahir dari desa, berjuang untuk desa, dan hasilnya kembali untuk desa.",
  },
];

const timeline = [
  {
    year: "2024",
    title: "Pendirian Koperasi",
    desc: "Koperasi Desa Merah Putih resmi didirikan oleh tokoh masyarakat Desa Mutih Wetan.",
  },
  {
    year: "2024",
    title: "Peluncuran Toko Online",
    desc: "Platform online diluncurkan untuk mempermudah warga berbelanja produk lokal.",
  },
  {
    year: "2025",
    title: "Ekspansi ke 6 Desa",
    desc: "Cakupan layanan kami meluas hingga melayani 6 desa di sekitar wilayah.",
  },
  {
    year: "2025",
    title: "500+ Produk Terjual",
    desc: "Kami telah berhasil menjual lebih dari 500 produk kepada warga desa.",
  },
];

export default function TentangPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container-page text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <Handshake className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">Tentang Kami</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-primary-foreground/85 md:text-base">
            Mengenal lebih dekat {STORE.name} dan misi kami untuk
            membangun ekonomi desa.
          </p>
        </div>
      </section>

      <WaveDivider />

      {/* Visi Misi */}
      <section className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Visi Kami
            </span>
            <h2 className="mt-3 text-2xl font-bold">Menjadi Jembatan Ekonomi Desa</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {STORE.name} bercita-cita menjadi jembatan antara produk unggulan
              desa dengan masyarakat luas. Kami ingin setiap produk berkualitas
              dari desa memiliki pasar yang adil dan dapat diakses oleh siapa
              saja.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Melalui platform digital ini, kami memastikan bahwa produk-produk
              lokal tidak kalah bersaing dengan produk kota, sekaligus menjaga
              keaslian dan kualitasnya.
            </p>
          </div>
          <div>
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Misi Kami
            </span>
            <h2 className="mt-3 text-2xl font-bold">Langkah Nyata untuk Desa</h2>
            <div className="mt-4 space-y-4">
              {[
                "Mempromosikan produk UMKM dan petani lokal secara digital.",
                "Memberikan kemudahan akses belanja bagi warga desa.",
                "Membuka lapangan kerja baru bagi pemuda desa.",
                "Menjaga kualitas dan keaslian setiap produk yang dijual.",
                "Membangun kemandirian ekonomi desa secara berkelanjutan.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nilai */}
      <section className="bg-secondary/30 py-16">
        <div className="container-page">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Nilai Kami
            </span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Prinsip yang Kami Pegang
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border bg-card p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-base font-semibold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-page py-16">
        <div className="mb-10 text-center">
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Perjalanan Kami
          </span>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">
            Sejarah {STORE.short}
          </h2>
        </div>
        <div className="mx-auto max-w-2xl">
          {timeline.map((t, i) => (
            <div key={i} className="relative flex gap-6 pb-10 last:pb-0">
              {i < timeline.length - 1 && (
                <div className="absolute left-[19px] top-10 h-full w-px bg-border" />
              )}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {t.year.slice(-2)}
              </div>
              <div className="pt-1">
                <span className="text-xs font-semibold text-primary">
                  {t.year}
                </span>
                <h3 className="mt-0.5 text-base font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wave: white -> red */}
      <WaveDivider flip />

      {/* CTA */}
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="container-page text-center">
          <Eye className="mx-auto mb-4 h-10 w-10" />
          <h2 className="text-2xl font-bold">Yuk, Bergabung Bersama Kami</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/85">
            Jadilah bagian dari pergerakan ekonomi desa. Belanja di {STORE.short}
            atau daftar sebagai anggota.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={waLink(
                STORE.waAdmin,
                `Halo ${STORE.name}, saya mau daftar menjadi anggota.`
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <MessageCircle className="h-4 w-4" /> Daftar via WhatsApp
            </a>
            <a
              href="/produk"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Lihat Produk <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
