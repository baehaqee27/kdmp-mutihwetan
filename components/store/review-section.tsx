import { Star } from "lucide-react";

const reviews = [
  {
    name: "Ibu Siti Aminah",
    rating: 5,
    date: "2 hari lalu",
    text: "Produk sangat bagus dan sesuai deskripsi. Pengiriman juga cepat. Pasti bakal beli lagi!",
  },
  {
    name: "Pak Hadi Wijaya",
    rating: 5,
    date: "5 hari lalu",
    text: "Kualitas oke banget, harga juga terjangkau. Cocok buat kado keluarga di kampung.",
  },
  {
    name: "Rina Marlina",
    rating: 4,
    date: "1 minggu lalu",
    text: "Barang sampai dengan aman. Kemasan rapi. Cuma agak lama dikirimnya, tapi overall puas.",
  },
];

export function ReviewSection({ productName }: { productName: string }) {
  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <section className="rounded-2xl border bg-card p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Ulasan Pelanggan</h3>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(avgRating)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} dari 5 ({reviews.length} ulasan)
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-3 w-3 ${
                          j < r.rating
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{r.date}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {r.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
