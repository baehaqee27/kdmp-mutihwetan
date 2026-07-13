import {
  HelpCircle,
  ShoppingBag,
  CreditCard,
  Truck,
  User,
  RotateCcw,
  MessageCircle,
} from "lucide-react";
import { STORE } from "@/lib/constants";
import { waLink } from "@/lib/wa";
import { WaveDivider } from "@/components/store/wave-divider";

const faqCategories = [
  {
    icon: ShoppingBag,
    title: "Pemesanan",
    items: [
      {
        q: "Bagaimana cara memesan produk?",
        a: "Pilih produk yang diinginkan dari katalog, tambahkan ke keranjang, lalu ikuti proses checkout. Anda akan menerima nomor order untuk melacak status pesanan.",
      },
      {
        q: "Apakah saya harus daftar dulu untuk belanja?",
        a: "Ya, Anda perlu mendaftar dan login terlebih dahulu sebelum melakukan pemesanan. Pendaftaran gratis dan hanya membutuhkan nama, email, dan password.",
      },
      {
        q: "Bisakah saya memesan produk yang tidak ada di katalog?",
        a: "Bisa. Hubungi admin via WhatsApp dan sampaikan produk yang Anda butuhkan. Kami akan berusaha memenuhi permintaan Anda.",
      },
      {
        q: "Apakah ada minimal pembelian?",
        a: "Tidak ada minimal pembelian. Anda bisa beli satu item atau lebih. Namun, untuk efisiensi pengiriman, kami sarankan minimal 1 item.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Pembayaran",
    items: [
      {
        q: "Metode pembayaran apa yang diterima?",
        a: "Kami menerima tiga metode: Transfer Bank (BCA, BRI, Mandiri), QRIS (scan dari semua e-wallet), dan COD (bayar di tempat saat barang sampai).",
      },
      {
        q: "Bagaimana cara membayar via transfer?",
        a: "Setelah checkout, Anda akan mendapat info rekening tujuan. Lakukan transfer sesuai nominal yang tertera, lalu kirim bukti transfer ke admin WhatsApp.",
      },
      {
        q: "Apakah pembayaran COD aman?",
        a: "Ya, COD sangat aman. Anda hanya membayar setelah menerima dan memeriksa barang. Cocok untuk yang baru pertama kali belanja online.",
      },
      {
        q: "Bagaimana jika sudah bayar tapi pesanan belum diproses?",
        a: "Kami biasanya memproses pesanan dalam 1×24 jam setelah pembayaran dikonfirmasi. Jika lebih dari itu, silakan hubungi admin dengan bukti transfer.",
      },
    ],
  },
  {
    icon: Truck,
    title: "Pengiriman",
    items: [
      {
        q: "Berapa lama waktu pengiriman?",
        a: "Untuk Desa Mutih Wetan: 1-2 hari. Desa sekitar (Mutih Kulon, Jungpasir, Bungo, Jetak, dll): 2-3 hari. COD bisa lebih cepat karena langsung diantar.",
      },
      {
        q: "Apakah ada biaya pengiriman?",
        a: "Untuk wilayah Desa Mutih Wetan, pengiriman GRATIS. Untuk desa lain, biaya pengiriman bervariasi tergantung jarak dan berat barang.",
      },
      {
        q: "Bagaimana cara melacak pesanan?",
        a: "Masuk ke akun Anda, lalu kunjungi halaman 'Pesanan Saya' di /akun/pesanan. Status pesanan akan diperbarui secara berkdi.",
      },
      {
        q: "Bisa kirim ke luar daerah?",
        a: "Saat ini kami melayani pengiriman ke area sekitar Desa Mutih Wetan dan beberapa desa tetangga. Hubungi admin untuk cek area layanan.",
      },
    ],
  },
  {
    icon: RotateCcw,
    title: "Pengembalian",
    items: [
      {
        q: "Bisa return atau tukar barang?",
        a: "Ya, barang bisa dikembalikan jika rusak, cacat, atau tidak sesuai pesanan. Ajukan pengembalian dalam 1×24 jam setelah barang diterima.",
      },
      {
        q: "Bagaimana proses pengembalian?",
        a: "Hubungi admin via WhatsApp, lampirkan foto barang dan nomor order. Setelah diverifikasi, kami akan mengganti barang atau mengembalikan dana.",
      },
      {
        q: "Berapa lama proses refund?",
        a: "Refund diproses dalam 1-3 hari kerja setelah pengembalian disetujui. Dana akan ditransfer ke rekening yang Anda tunjuk.",
      },
    ],
  },
  {
    icon: User,
    title: "Akun & Keanggotaan",
    items: [
      {
        q: "Bagaimana cara mendaftar?",
        a: "Klik tombol 'Masuk' di header, lalu pilih 'Daftar'. Isi nama, email, dan password. Setelah itu Anda bisa langsung berbelanja.",
      },
      {
        q: "Lupa password, bagaimana?",
        a: "Gunakan fitur 'Lupa Password' di halaman masuk. Link reset password akan dikirim ke email Anda.",
      },
      {
        q: "Apa keuntungan menjadi anggota?",
        a: "Anggota mendapat akses ke promo eksklusif, diskon khusus, prioritas pengiriman, dan berita terbaru dari koperasi.",
      },
      {
        q: "Bisakah saya menghapus akun?",
        a: "Hubungi admin via WhatsApp untuk permintaan penghapusan akun. Data Anda akan dihapus sesuai kebijakan privasi kami.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container-page text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-primary-foreground/85 md:text-base">
            Temukan jawaban atas pertanyaan umum seputar {STORE.short}.
          </p>
        </div>
      </section>

      <WaveDivider />

      {/* FAQ */}
      <section className="container-page py-16">
        <div className="space-y-12">
          {faqCategories.map((cat) => (
            <div key={cat.title}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <cat.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">{cat.title}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {cat.items.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <h3 className="text-sm font-semibold">{item.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                ))}
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
          <h2 className="text-2xl font-bold">Masih Ada Pertanyaan?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/85">
            Jangan ragu untuk bertanya langsung kepada admin kami.
          </p>
          <a
            href={waLink(
              STORE.waAdmin,
              `Halo ${STORE.name}, saya punya pertanyaan.`
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <MessageCircle className="h-4 w-4" /> Tanya via WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
