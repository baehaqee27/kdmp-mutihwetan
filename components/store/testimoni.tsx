import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ibu Siti",
    village: "Mutih Wetan",
    text: "Belanja di KDKMP sangat mudah, tinggal pesan lewat WhatsApp barang langsung sampai di rumah. Produknya segar semua!",
    rating: 5,
  },
  {
    name: "Pak Joko",
    village: "Mutih Kulon",
    text: "Kopi lokalnya enak banget, beda dari yang di kota. Harganya juga terjangkau. Cocok buat hadiah keluarga.",
    rating: 5,
  },
  {
    name: "Ibu Ratna",
    village: "Kalongan",
    text: "Sabun berasnya bagus, kulit jadi lembut. Senang bisa beli produk desa tanpa harus ke kota. Terima kasih KDKMP!",
    rating: 5,
  },
  {
    name: "Pak Budi",
    village: "Sambong",
    text: "COD-nya mantap, bayar di tempat pas barang datang. Praktis banget. Recommended untuk yang belum percaya belanja online.",
    rating: 5,
  },
];

export function TestimoniSection() {
  return (
    <section className="bg-background py-16">
      <div className="container-page">
        <div className="mb-10 text-center">
          <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            Testimoni
          </span>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">
            Apa Kata Mereka?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Ribuan warga desa sudah merasakan kemudahan berbelanja di KDKMP.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t pt-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {t.name.split(" ").pop()?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.village}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
