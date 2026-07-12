import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/store/cart-context";
import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { WhatsAppFloat } from "@/components/store/wa-float";
import { BackToTop } from "@/components/store/back-to-top";
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
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <BackToTop />
        </CartProvider>
      </body>
    </html>
  );
}
