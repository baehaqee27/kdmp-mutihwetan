# RESYSTEM.md — Dokumentasi Sistem KDKMP Mutih Wetan

> Panduan lengkap untuk developer yang mengerjakan proyek ini.
> Terakhir diperbarui: Juli 2026

---

## Ringkasan

Toko online untuk **Koperasi Desa Merah Putih (KDKMP)** di Desa Mutih Wetan, Kec. Wedung, Kab. Demak, Jawa Tengah. Gratis ongkir untuk desa tertentu, pembayaran via transfer/QRIS/COD, konfirmasi pesanan via WhatsApp.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15.5 (App Router, TypeScript) |
| UI | Tailwind CSS 3.4 + shadcn/ui + Lucide icons |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (email + password) |
| Search | Fuse.js (client-side fuzzy search) |
| Charts | Recharts 3.9 |
| Image Hosting | Cloudinary (produk) + Supabase Storage (bukti, settings) |
| Font | Plus Jakarta Sans |
| Deployment | Vercel |
| Comms | WhatsApp (wa.me) untuk konfirmasi & CS |

---

## Struktur Folder

```
kdmp-mutihwetan/
├── app/                        # Next.js App Router (pages & layouts)
│   ├── globals.css             # Theme variables (HSL) + custom utilities
│   ├── layout.tsx              # Root layout (font, SEO, providers, shell)
│   ├── page.tsx                # Homepage
│   ├── produk/
│   │   ├── page.tsx            # Katalog produk (filter + search)
│   │   └── [slug]/page.tsx     # Detail produk
│   ├── keranjang/page.tsx      # Keranjang belanja
│   ├── checkout/page.tsx       # Checkout + buat pesanan
│   ├── pesanan/page.tsx        # Lacak pesanan publik
│   ├── masuk/page.tsx          # Login / Daftar
│   ├── akun/pesanan/page.tsx   # Pesanan saya (login required)
│   ├── tentang/page.tsx        # Tentang koperasi
│   ├── kontak/page.tsx         # Kontak + form WhatsApp
│   ├── faq/page.tsx            # FAQ (5 kategori)
│   ├── not-found.tsx           # 404 page
│   ├── error.tsx               # Error boundary
│   └── admin/
│       ├── layout.tsx          # Admin shell (sidebar + auth guard)
│       ├── page.tsx            # Dashboard (charts, stats)
│       ├── login/page.tsx      # Admin login
│       ├── produk/page.tsx     # CRUD produk
│       ├── pesanan/page.tsx    # Kelola pesanan
│       └── pengaturan/page.tsx # Pengaturan toko
│
├── components/
│   ├── store/                  # 19 komponen toko
│   │   ├── header.tsx          # Navbar (logo, nav, search dropdown, cart, auth)
│   │   ├── footer.tsx          # Footer (social, nav, kontak)
│   │   ├── cart-context.tsx    # Cart state (Context + localStorage)
│   │   ├── product-card.tsx    # Kartu produk (badges, hover zoom)
│   │   ├── search-dropdown.tsx # Live fuzzy search (Fuse.js + preview)
│   │   ├── bottom-nav.tsx      # Bottom nav mobile
│   │   ├── logo.tsx            # Logo image
│   │   ├── wa-float.tsx        # WhatsApp floating button
│   │   ├── back-to-top.tsx     # Scroll-to-top button
│   │   ├── wave-divider.tsx    # SVG zigzag section divider
│   │   ├── flash-sale.tsx      # Flash sale countdown + horizontal scroll
│   │   ├── horizontal-products.tsx # Scrollable product row
│   │   ├── category-grid.tsx   # Icon grid kategori dari DB
│   │   ├── promo-banner.tsx    # Banner gratis ongkir + countdown
│   │   ├── keunggulan.tsx      # 6 keunggulan/USP
│   │   ├── stats.tsx           # Animated counters
│   │   ├── testimoni.tsx       # Testimoni pelanggan
│   │   ├── tentang-section.tsx # About section homepage
│   │   ├── cta-section.tsx     # WhatsApp CTA
│   │   └── review-section.tsx  # Review produk (static)
│   ├── admin/
│   │   ├── shell.tsx           # Sidebar layout + auth guard
│   │   └── product-dialog.tsx  # Modal tambah/edit produk
│   └── ui/                     # 12 shadcn/ui primitives
│       ├── badge.tsx, breadcrumb.tsx, button.tsx, card.tsx,
│       ├── dialog.tsx, input.tsx, label.tsx, select.tsx,
│       ├── separator.tsx, table.tsx, tabs.tsx, textarea.tsx
│
├── lib/                        # Business logic & utilities
│   ├── constants.ts            # STORE, PAYMENT_METHODS, ORDER_STATUS, DESA_OPTIONS
│   ├── types.ts                # TypeScript types (Category, Product, Order, dll)
│   ├── api.ts                  # Semua CRUD + fetch functions
│   ├── auth.ts                 # useAuth hook, signUp, signIn, signOut
│   ├── admin.ts                # Admin auth helpers
│   ├── supabase.ts             # Supabase client init + bucket names
│   ├── cloudinary.ts           # Cloudinary upload + URL builder
│   ├── wa.ts                   # WhatsApp link + message builder
│   └── utils.ts                # cn(), formatRupiah(), formatDate()
│
├── supabase/
│   └── schema.sql              # Full DB schema + RLS + seed data
│
├── public/
│   ├── logo.webp               # Logo koperasi
│   └── hero.png                # Hero background
│
├── tailwind.config.ts          # Theme config
├── next.config.mjs             # Next.js config
├── tsconfig.json               # TypeScript config
└── .env.local                  # Environment variables (tidak di-commit)
```

---

## Routes

### Toko (Publik)

| Route | Deskripsi |
|---|---|
| `/` | Homepage: hero, promo banner, kategori, flash sale, produk terbaru, statistik, keunggulan, metode bayar, tentang, testimoni, CTA |
| `/produk` | Katalog produk. Filter: `?cat=<slug>`, Search: `?search=<query>` |
| `/produk/[slug]` | Detail produk: gambar, harga, stok, qty picker, tambah ke keranjang, beli langsung, produk terkait |
| `/keranjang` | Keranjang belanja (localStorage) |
| `/checkout` | Checkout form → buat pesanan di Supabase → link WhatsApp |
| `/pesanan` | Lacak pesanan publik (nomor pesanan + no. HP) |
| `/tentang` | Visi, misi, nilai, timeline koperasi |
| `/kontak` | Info kontak, form → WhatsApp, FAQ |
| `/faq` | FAQ per kategori |

### Akun (Login Required)

| Route | Deskripsi |
|---|---|
| `/masuk` | Login / Daftar (tabs) |
| `/akun/pesanan` | Riwayat pesanan user |

### Admin (Hidden)

| Route | Deskripsi |
|---|---|
| `/admin/login` | Login admin |
| `/admin` | Dashboard: stat cards, grafik omzet & pesanan bulanan (Recharts), recent orders |
| `/admin/produk` | CRUD produk (tabel + modal + Cloudinary upload) |
| `/admin/pesanan` | Kelola pesanan + ubah status |
| `/admin/pengaturan` | Pengaturan toko (nama, WA, rekening, QRIS, desa gratis ongkir) |

---

## Database Schema (Supabase)

### Tabel

```
categories
├── id (uuid, PK)
├── name (text)
└── slug (text, unique)

products
├── id (uuid, PK)
├── name (text)
├── slug (text, unique)
├── description (text)
├── price (integer, dalam Rupiah)
├── stock (integer)
├── category_id (uuid, FK → categories)
├── image_url (text, URL Cloudinary)
├── active (boolean, default true)
└── created_at (timestamptz)

settings (singleton, id=1)
├── store_name (text)
├── wa_admin (text)
├── rekening (text)
├── qris_url (text)
└── free_desa (text)

orders
├── id (uuid, PK)
├── order_number (text, unique, format: KMP{YYYYMMDD}{4-digit})
├── user_id (uuid, FK → auth.users)
├── user_email (text)
├── customer_name (text)
├── phone (text)
├── address (text)
├── desa (text)
├── payment_method (text: transfer | qris | cod)
├── ongkir (integer)
├── total (integer)
├── status (text, default: menunggu_konfirmasi)
├── proof_url (text)
├── note (text)
└── created_at (timestamptz)

order_items
├── id (uuid, PK)
├── order_id (uuid, FK → orders, CASCADE DELETE)
├── product_id (uuid, FK → products)
├── product_name (text)
├── qty (integer)
└── price (integer)
```

### Storage Buckets

| Bucket | Public | Isi |
|---|---|---|
| `products` | Ya | Gambar produk (lama, sekarang pakai Cloudinary) |
| `proofs` | Ya | Bukti transfer/QRIS dari customer |
| `settings` | Ya | Logo, QRIS image |

### RLS Policies

- **categories**: Publik bisa baca, authenticated bisa CRUD
- **products**: Publik baca (active=true), authenticated CRUD
- **settings**: Publik baca, authenticated update
- **orders**: Authenticated insert, publik baca (untuk tracking), authenticated CRUD
- **order_items**: Authenticated insert, publik baca, authenticated CRUD

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxx
CLOUDINARY_API_SECRET=xxx  # server-side only, tidak di-commit
```

**Penting**: `.env.local` sudah ada di `.gitignore`. Jangan pernah commit API secret.

---

## Constants (`lib/constants.ts`)

```ts
STORE = {
  name: "Koperasi Desa Kelurahan Merah Putih",
  short: "KDKMP",
  village: "Mutih Wetan",
  tagline: "Belanja Berkualitas dari Desa",
  waAdmin: "085649894084",
  freeDesa: "Mutih Wetan",
  email: "kopmerahputih@gmail.com",
};

PAYMENT_METHODS = ["transfer", "qris", "cod"];

ORDER_STATUS = [
  "menunggu_konfirmasi",  // amber
  "diproses",             // blue
  "dikirim",              // indigo
  "selesai",              // emerald
  "dibatalkan",           // rose
];

DESA_OPTIONS = [
  "Mutih Wetan", "Mutih Kulon", "Jungpasir",
  "Bungo", "Jetak", "Kendalasem", "Tedunan", "Lainnya"
];
```

---

## Flow Aplikasi

### 1. Belanja (Guest → Member)

```
Homepage → Lihat Produk → Detail Produk → Tambah ke Keranjang
   ↓
Keranjang → Checkout (login required)
   ↓
Form: nama, HP, alamat, desa, metode bayar, upload bukti
   ↓
Order dibuat di Supabase → Redirect ke WhatsApp (pesan otomatis)
   ↓
Keranjang dikosongkan
```

### 2. Lacak Pesanan

```
/pesanan → Input nomor pesanan + no. HP
   ↓
Cari order di Supabase → Tampilkan status, item, total
```

### 3. Admin

```
/admin/login → Dashboard (stats + charts)
   ↓
Kelola Produk (CRUD + image upload ke Cloudinary)
   ↓
Kelola Pesanan (lihat detail, ubah status, lihat bukti bayar)
   ↓
Pengaturan (nama toko, WA, rekening, QRIS)
```

---

## Alur Data

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend   │────▶│   Supabase   │────▶│  PostgreSQL  │
│  (Next.js)   │◀────│   (API +     │◀────│   (DB + RLS) │
│              │     │    Auth)     │     │              │
└──────┬──────┘     └──────────────┘     └──────────────┘
       │
       │  Upload produk
       ▼
┌──────────────┐
│  Cloudinary  │  (gambar produk, auto-optimize, CDN)
└──────────────┘

┌──────────────┐
│  Supabase    │  (bukti bayar, settings - via Storage)
│  Storage     │
└──────────────┘
```

---

## Key Design Decisions

1. **Cart di localStorage** — Tidak perlu auth untuk lihat keranjang. Cart context di `cart-context.tsx` handle sync.
2. **Search client-side** — Fuse.js index semua produk di browser. Cukup untuk katalog < 500 produk. Kalau scale up, pertimbangkan Algolia/Meilisearch.
3. **Cloudinary untuk produk** — Auto-optimize (webp, resize), CDN global, 25GB gratis. Bukti bayar tetap di Supabase Storage.
4. **WhatsApp sebagai komunikasi utama** — Konfirmasi pesanan, CS, form kontak semuanya redirect ke wa.me. Cocok untuk skala desa.
5. **No payment gateway** — Manual transfer/QRIS/COD. Admin update status manual. Cocok untuk koperasi kecil.
6. **Admin hidden** — Rute `/admin/*` tidak ada di navigasi. Hanya bisa diakses langsung.
7. **RLS di Supabase** — Semua data terproteksi di database level. Publik hanya bisa baca data active.

---

## Cara Development

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev        # http://localhost:3000

# Build untuk production
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

---

## Cara Deploy ke Vercel

1. Push ke GitHub
2. Import repo di vercel.com
3. Tambahkan environment variables (sama seperti `.env.local`)
4. Deploy — otomatis detect Next.js

---

## Catatan Developer

- **Font**: Plus Jakarta Sans, load dari `next/font/google` di `layout.tsx`
- **Theme**: HSL values di `globals.css`, Tailwind access via `bg-primary`, `text-muted-foreground`, dll
- **Warna brand**: Merah `hsl(4, 78%, 50%)` — jangan ganti
- **Component library**: shadcn/ui — kalau perlu component baru, jalankan `npx shadcn@latest add <component>`
- **Format harga**: Selalu pakai `formatRupiah()` dari `lib/utils.ts`
- **Order number**: Auto-generate `KMP{YYYYMMDD}{random}` — jangan hardcode
- **Admin auth**: Supabase Auth biasa (email+password). Tidak ada role system — cukup auth check.
- **Image upload**: Produk → Cloudinary. Bukti bayar → Supabase Storage.
- **WhatsApp link**: Selalu pakai `waLink()` dari `lib/wa.ts` (konformat nomor ke format internasional)

---

## Database Seed Data

4 kategori: Sabun & Perawatan, Minuman, Makanan, Kebutuhan Rumah
6 produk contoh dengan harga Rp12.000 — Rp65.000

---

## Tech Decisions

| Keputusan | Alasan |
|---|---|
| Next.js App Router | Latest pattern, React Server Components, better SEO |
| Supabase > Firebase | Open source, PostgreSQL, RLS, gratis untuk skala kecil |
| Cloudinary > local storage | CDN global, auto optimize, tidak bikin repo besar |
| Fuse.js > Algolia | Gratis, client-side, cukup untuk < 500 produk |
| shadcn/ui > Mantine/Chakra | Lightweight, customizable, copy-paste (bukan dependency) |
| WhatsApp > email/SMS | Lebih familiar untuk user desa, gratis |
| Tailwind > CSS modules | Rapid prototyping, consistent design system |
