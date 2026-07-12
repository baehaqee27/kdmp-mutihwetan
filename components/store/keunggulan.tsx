import {
  Shield,
  Truck,
  CreditCard,
  HeadphonesIcon,
  Leaf,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Produk Lokal Asli",
    desc: "Semua produk langsung dari UMKM dan petani Desa Mutih Wetan, segar dan berkualitas.",
  },
  {
    icon: Truck,
    title: "Gratis Ongkir Desa",
    desc: "Pengiriman gratis untuk wilayah Desa Mutih Wetan dan sekitarnya.",
  },
  {
    icon: CreditCard,
    title: "Bayar Fleksibel",
    desc: "Transfer bank, QRIS, atau bayar di tempat (COD). Pilih yang paling mudah.",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    desc: "Koperasi resmi yang dikelola oleh warga desa untuk warga desa.",
  },
  {
    icon: HeadphonesIcon,
    title: "Layanan Pelanggan",
    desc: "Tim kami siap membantu via WhatsApp untuk pertanyaan dan keluhan Anda.",
  },
  {
    icon: Users,
    title: "Dukung Ekonomi Desa",
    desc: "Setiap pembelian Anda langsung mendukung kesejahteraan warga desa.",
  },
];

export function KeunggulanSection() {
  return (
    <section className="bg-background py-16">
      <div className="container-page">
        <div className="mb-10 text-center">
          <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            Mengapa KDKMP?
          </span>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">
            Belanja Mudah, Dukung Desa
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Kami hadir untuk memudahkan warga berbelanja sekaligus membangun
            ekonomi desa bersama.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1 text-base font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
