import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/api";

const BASE_URL = "https://kdmp-mutihwetan.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/produk`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/tentang`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/kontak`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/pesanan`, lastModified: now, changeFrequency: "never", priority: 0.3 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productPages = products.map((p) => ({
      url: `${BASE_URL}/produk/${p.slug}`,
      lastModified: p.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // skip
  }

  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategories();
    categoryPages = categories.map((c) => ({
      url: `${BASE_URL}/produk?cat=${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // skip
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
