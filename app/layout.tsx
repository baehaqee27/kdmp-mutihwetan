import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/store/cart-context";
import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { WhatsAppFloat } from "@/components/store/wa-float";
import { BackToTop } from "@/components/store/back-to-top";
import { BottomNav } from "@/components/store/bottom-nav";
import { DevBanner } from "@/components/store/dev-banner";
import { STORE } from "@/lib/constants";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${STORE.name} - Desa ${STORE.village}`,
    template: `%s | ${STORE.name}`,
  },
  description:
    "Toko online Koperasi Desa Merah Putih, Desa Mutih Wetan. Belanja produk lokal berkualitas dengan transfer, QRIS, atau COD.",
  keywords: [
    "koperasi desa",
    "produk lokal",
    "UMKM",
    "belanja online desa",
    "Mutih Wetan",
    "KDKMP",
    "koperasi merah putih",
    "COD desa",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: STORE.name,
    title: `${STORE.name} - ${STORE.tagline}`,
    description:
      "Belanja produk lokal berkualitas dari Desa Mutih Wetan. Transfer, QRIS, atau COD.",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: STORE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE.name} - ${STORE.tagline}`,
    description:
      "Belanja produk lokal berkualitas dari Desa Mutih Wetan. Transfer, QRIS, atau COD.",
    images: ["/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <CartProvider>
          <DevBanner />
          <Header />
          <main className="flex-1 pb-14 md:pb-0">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <BackToTop />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
