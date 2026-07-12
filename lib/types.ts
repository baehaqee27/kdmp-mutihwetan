export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: string | null;
  image_url: string | null;
  active: boolean;
  created_at: string;
  category?: Category | null;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  desa: string;
  payment_method: string;
  ongkir: number;
  total: number;
  status: string;
  proof_url: string | null;
  note: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  qty: number;
  price: number;
};

export type Settings = {
  id: number;
  wa_admin: string;
  rekening: string | null;
  qris_url: string | null;
  free_desa: string;
  store_name: string;
};
