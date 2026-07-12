import { supabase, BUCKET_PRODUCTS, BUCKET_PROOFS, BUCKET_SETTINGS } from "./supabase";
import { uploadToCloudinary } from "./cloudinary";
import type { Category, Product, Order, OrderItem, Settings } from "./types";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getProducts(opts?: {
  categorySlug?: string;
  search?: string;
}): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("active", true)
    .order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  let products = (data ?? []) as Product[];

  if (opts?.categorySlug && opts.categorySlug !== "semua") {
    products = products.filter((p) => p.category?.slug === opts.categorySlug);
  }
  if (opts?.search) {
    const s = opts.search.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(s));
  }
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as Product;
}

export async function getSettings(): Promise<Settings | null> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) return null;
  return data as Settings;
}

export function generateOrderNumber(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `KMP${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${rand}`;
}

export async function createOrder(input: {
  customer_name: string;
  phone: string;
  address: string;
  desa: string;
  payment_method: string;
  ongkir: number;
  total: number;
  note?: string;
  proofFile?: File | null;
  user_id?: string | null;
  user_email?: string | null;
  items: { product_id: string | null; product_name: string; qty: number; price: number }[];
}): Promise<Order> {
  let proof_url: string | null = null;

  if (input.proofFile) {
    const ext = input.proofFile.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET_PROOFS)
      .upload(path, input.proofFile, { upsert: false });
    if (upErr) throw upErr;
    proof_url = supabase.storage.from(BUCKET_PROOFS).getPublicUrl(path).data.publicUrl;
  }

  const order_number = generateOrderNumber();
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_number,
      user_id: input.user_id ?? null,
      user_email: input.user_email ?? null,
      customer_name: input.customer_name,
      phone: input.phone,
      address: input.address,
      desa: input.desa,
      payment_method: input.payment_method,
      ongkir: input.ongkir,
      total: input.total,
      note: input.note ?? null,
      proof_url,
    })
    .select()
    .single();
  if (error) throw error;

  const items = input.items.map((it) => ({
    order_id: order.id,
    product_id: it.product_id,
    product_name: it.product_name,
    qty: it.qty,
    price: it.price,
  }));
  const { error: itemErr } = await supabase.from("order_items").insert(items);
  if (itemErr) throw itemErr;

  return order as Order;
}

export async function getOrderTracking(
  order_number: string,
  phone: string
): Promise<{ order: Order; items: OrderItem[] } | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", order_number)
    .eq("phone", phone)
    .single();
  if (error || !order) return null;
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);
  return { order: order as Order, items: (items ?? []) as OrderItem[] };
}

export async function getMyOrders(userEmail: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/* ----------------- ADMIN ----------------- */

export async function adminGetOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminGetOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

export async function adminGetAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminUpsertProduct(p: Partial<Product> & { id?: string }) {
  if (p.id) {
    const { error } = await supabase
      .from("products")
      .update({
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        category_id: p.category_id,
        image_url: p.image_url,
        active: p.active,
      })
      .eq("id", p.id);
    if (error) throw error;
    return p.id;
  }
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category_id: p.category_id,
      image_url: p.image_url,
      active: p.active ?? true,
    })
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function adminDeleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function adminUploadProductImage(file: File): Promise<string> {
  const result = await uploadToCloudinary(file, "kdkmp-mutihwetan/products");
  return result.secure_url;
}

export async function adminUploadSettingImage(file: File, prefix: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${prefix}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET_SETTINGS)
    .upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET_SETTINGS).getPublicUrl(path).data.publicUrl;
}

export async function adminUpdateSettings(s: Partial<Settings>) {
  const { error } = await supabase.from("settings").update(s).eq("id", 1);
  if (error) throw error;
}
