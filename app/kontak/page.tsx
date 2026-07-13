"use client";

import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Phone,
  Send,
} from "lucide-react";
import { STORE } from "@/lib/constants";
import { waLink } from "@/lib/wa";
import { WaveDivider } from "@/components/store/wave-divider";

const contactInfo = [
  {
    icon: Phone,
    label: "WhatsApp Admin",
    value: STORE.waAdmin,
    href: waLink(
      STORE.waAdmin,
      `Halo ${STORE.name}, saya ingin menghubungi admin.`
    ),
    target: "_blank",
  },
  {
    icon: Mail,
    label: "Email",
    value: STORE.email,
    href: `mailto:${STORE.email}`,
  },
  {
    icon: MapPin,
    label: "Alamat",
    value: `Desa ${STORE.village}, Kec. Wedung, Kabupaten Demak, Jawa Tengah`,
    href: null,
  },
  {
    icon: Clock,
    label: "Jam Operasional",
    value: "Senin - Sabtu, 08.00 - 16.00 WIB",
    href: null,
  },
];

const faq = [
  {
    q: "Bagaimana cara memesan produk?",
    a: "Pilih produk yang diinginkan, tambahkan ke keranjang, lalu ikuti proses checkout. Anda akan mendapat nomor order untuk melacak pesanan.",
  },
  {
    q: "Metode pembayaran apa yang diterima?",
    a: "Kami menerima transfer bank, QRIS, dan COD (bayar di tempat saat barang sampai).",
  },
  {
    q: "Berapa lama pengiriman?",
    a: "Untuk wilayah Desa Mutih Wetan, pengiriman gratis dan biasanya sampai dalam 1-2 hari. Desa lain sekitar 2-3 hari.",
  },
  {
    q: "Apakah bisa return barang?",
    a: "Barang dapat dikembalikan jika rusak atau tidak sesuai pesanan. Silakan hubungi admin WhatsApp dalam 1×24 jam setelah barang diterima.",
  },
  {
    q: "Bagaimana cara menjadi anggota?",
    a: "Hubungi admin via WhatsApp untuk pendaftaran anggota. Keanggotaan gratis dan mendapat akses ke promo eksklusif.",
  },
];

export default function KontakPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container-page text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">Hubungi Kami</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-primary-foreground/85 md:text-base">
            Punya pertanyaan atau butuh bantuan? Jangan ragu untuk menghubungi
            kami.
          </p>
        </div>
      </section>

      <WaveDivider />

      {/* Contact Cards */}
      <section className="container-page py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border bg-card p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold">{c.label}</h3>
              {c.href ? (
                <a
                  href={c.href}
                  target={c.target}
                  rel={c.target ? "noreferrer" : undefined}
                  className="mt-1 block text-sm text-primary transition-colors hover:underline"
                >
                  {c.value}
                </a>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">{c.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form + Map placeholder */}
      <section className="bg-secondary/30 py-16">
        <div className="container-page">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Form */}
            <div>
              <h2 className="mb-1 text-xl font-bold">Kirim Pesan</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Isi form di bawah ini dan kami akan merespons secepatnya.
              </p>
              <form
                action={(formData) => {
                  const name = formData.get("name") as string;
                  const message = formData.get("message") as string;
                  const fullMessage = `Halo ${STORE.name}, saya ${name}.\n\n${message}`;
                  window.open(
                    waLink(STORE.waAdmin, fullMessage),
                    "_blank"
                  );
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="Masukkan nama Anda"
                    className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-sm font-medium"
                  >
                    Nomor WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-sm font-medium"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Send className="h-4 w-4" /> Kirim via WhatsApp
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="mb-1 text-xl font-bold">Pertanyaan Umum</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Jawaban atas pertanyaan yang sering ditanyakan.
              </p>
              <div className="space-y-4">
                {faq.map((f, i) => (
                  <div key={i} className="rounded-xl border bg-card p-4">
                    <h3 className="text-sm font-semibold">{f.q}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="container-page pb-16">
        <h2 className="mb-4 text-xl font-bold">Lokasi Kami</h2>
        <div className="overflow-hidden rounded-2xl border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1012.5696895461786!2d110.6626152877188!3d-6.745226114733972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1783939207221!5m2!1sid!2sid"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>

      {/* Wave: white -> red */}
      <WaveDivider flip />

      {/* WhatsApp CTA */}
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold">Butuh Respon Cepat?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/85">
            Hubungi langsung admin kami via WhatsApp untuk pertanyaan mendesak.
          </p>
          <a
            href={waLink(
              STORE.waAdmin,
              `Halo ${STORE.name}, saya butuh bantuan segera.`
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <MessageCircle className="h-4 w-4" /> Chat Langsung
          </a>
        </div>
      </section>
    </div>
  );
}
