-- =====================================================================
-- Koperasi Desa Merah Putih - Mutih Wetan
-- Schema Supabase (jalankan di SQL Editor Supabase)
-- =====================================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "pgcrypto";

-- ---------- CATEGORIES ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price integer not null default 0,
  stock integer not null default 0,
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(active);

-- ---------- SETTINGS (single row) ----------
create table if not exists public.settings (
  id integer primary key default 1,
  store_name text not null default 'Koperasi Desa Merah Putih',
  wa_admin text not null default '085649894084',
  rekening text,
  qris_url text,
  free_desa text not null default 'Mutih Wetan'
);

insert into public.settings (id, store_name, wa_admin, free_desa)
values (1, 'Koperasi Desa Merah Putih', '085649894084', 'Mutih Wetan')
on conflict (id) do nothing;

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  customer_name text not null,
  phone text not null,
  address text not null,
  desa text not null,
  payment_method text not null,
  ongkir integer not null default 0,
  total integer not null default 0,
  status text not null default 'menunggu_konfirmasi',
  proof_url text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists orders_number_idx on public.orders(order_number);
create index if not exists orders_phone_idx on public.orders(phone);

-- ---------- ORDER ITEMS ----------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  qty integer not null default 1,
  price integer not null default 0
);

create index if not exists order_items_order_idx on public.order_items(order_id);

-- ---------- REVIEWS ----------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_idx on public.reviews(product_id);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;

-- Categories: public read
create policy "categories_read" on public.categories for select using (true);
create policy "categories_write" on public.categories for all to authenticated using (true) with check (true);

-- Products: public read active only
create policy "products_read" on public.products for select using (active = true);
create policy "products_write" on public.products for all to authenticated using (true) with check (true);

-- Settings: public read, authenticated write
create policy "settings_read" on public.settings for select using (true);
create policy "settings_write" on public.settings for update to authenticated using (true) with check (true);

-- Orders: only logged-in members can create. Admin full. Public read (tracking).
create policy "orders_insert" on public.orders for insert to authenticated with check (true);
create policy "orders_read" on public.orders for select using (true);
create policy "orders_write" on public.orders for all to authenticated using (true) with check (true);

-- Order items: only logged-in members can create. Admin full. Public read.
create policy "order_items_insert" on public.order_items for insert to authenticated with check (true);
create policy "order_items_read" on public.order_items for select using (true);
create policy "order_items_write" on public.order_items for all to authenticated using (true) with check (true);

-- Reviews: public read, authenticated insert, own reviews delete
create policy "reviews_read" on public.reviews for select using (true);
create policy "reviews_insert" on public.reviews for insert to authenticated with check (true);
create policy "reviews_delete" on public.reviews for delete to authenticated using (user_id = auth.uid());

-- =====================================================================
-- STORAGE BUCKETS + POLICIES
-- =====================================================================
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('proofs', 'proofs', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('settings', 'settings', true) on conflict (id) do nothing;

-- products bucket
create policy "products_public_read" on storage.objects for select using (bucket_id = 'products');
create policy "products_auth_write" on storage.objects for insert to authenticated with check (bucket_id = 'products');
create policy "products_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'products');

-- proofs bucket
create policy "proofs_public_read" on storage.objects for select using (bucket_id = 'proofs');
create policy "proofs_insert" on storage.objects for insert with check (bucket_id = 'proofs');
create policy "proofs_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'proofs');

-- settings bucket
create policy "settings_public_read" on storage.objects for select using (bucket_id = 'settings');
create policy "settings_auth_write" on storage.objects for insert to authenticated with check (bucket_id = 'settings');
create policy "settings_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'settings');

-- =====================================================================
-- SEED DATA (contoh produk khas koperasi desa)
-- =====================================================================
insert into public.categories (name, slug) values
  ('Sabun & Perawatan', 'sabun-perawatan'),
  ('Minuman', 'minuman'),
  ('Makanan', 'makanan'),
  ('Kebutuhan Rumah', 'kebutuhan-rumah')
on conflict (slug) do nothing;

insert into public.products (name, slug, description, price, stock, category_id, active) values
  ('Sabun Herbal Alami', 'sabun-herbal-alami', 'Sabun batang dari ekstrak daun sirih dan kunyit, lembut di kulit.', 12000, 50,
    (select id from public.categories where slug = 'sabun-perawatan'), true),
  ('Sampo Beras', 'sampo-beras', 'Sampo tradisional berbahan dasar ekstrak beras, suburkan rambut.', 18000, 40,
    (select id from public.categories where slug = 'sabun-perawatan'), true),
  ('Kopi Bubuk Premium', 'kopi-bubuk-premium', 'Kopi bubuk arabika & robusta pilihan dari kebun lokal.', 35000, 30,
    (select id from public.categories where slug = 'minuman'), true),
  ('Minyak Kelapa Murni', 'minyak-kelapa-murni', 'VCO murni dari kelapa pilihan, multifungsi untuk masak & perawatan.', 28000, 25,
    (select id from public.categories where slug = 'makanan'), true),
  ('Gula Aren Cair', 'gula-aren-cair', 'Gula aren cair alami, manis sehat pengganti gula pasir.', 22000, 35,
    (select id from public.categories where slug = 'makanan'), true),
  ('Beras Organik', 'beras-organik', 'Beras organik tanpa pestisida, pulen dan sehat.', 65000, 60,
    (select id from public.categories where slug = 'makanan'), true)
on conflict (slug) do nothing;
