import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { getProductBySlug } from "@/lib/api";
import { ProductDetail } from "@/components/store/product-detail";
import { STORE } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    return { title: "Produk Tidak Ditemukan" };
  }

  const desc = product.description?.slice(0, 160) || `${product.name} - ${formatRp(product.price)}`;

  return {
    title: product.name,
    description: desc,
    openGraph: {
      title: `${product.name} | ${STORE.name}`,
      description: desc,
      type: "website",
      images: product.image_url ? [{ url: product.image_url, width: 800, height: 600, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: desc,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

function formatRp(v: number) {
  return `Rp${v.toLocaleString("id-ID")}`;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    return (
      <div className="container-page flex flex-col items-center gap-3 py-20 text-center">
        <Package className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-lg font-bold">Produk tidak ditemukan</h1>
        <a href="/produk" className="text-sm text-primary underline">
          Kembali ke Produk
        </a>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
