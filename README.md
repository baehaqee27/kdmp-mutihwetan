# Koperasi Desa Merah Putih - Mutih Wetan

Toko online sederhana hingga menengah untuk Koperasi Desa Merah Putih, Desa Mutih Wetan.
Gratis: hosting Vercel, database Supabase, konfirmasi WhatsApp.

## Tech Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui + lucide-react
- Supabase (Postgres + Auth + Storage)
- Vercel (hosting)
- WhatsApp (wa.me) untuk konfirmasi

## Fitur
- Landing page profil koperasi (hero, stats, unit usaha, berita, galeri, produk unggulan)
- Registrasi & login anggota (Supabase Auth); wajib login untuk checkout
- Katalog produk, detail, keranjang, checkout
- Pembayaran: Transfer manual, QRIS statis, COD
- Ongkir gratis untuk 1 desa, COD tersedia
- Konfirmasi otomatis ke WhatsApp admin
- Pelacakan pesanan & riwayat "Pesanan Saya"
- Dashboard admin: kelola produk, pesanan, pengaturan
- Tombol admin disembunyikan dari publik (akses langsung /admin/login)

## Setup Lokal
1. Install dependency
   npm install
2. Buat project Supabase di supabase.com
3. Buka SQL Editor, jalankan isi file supabase/schema.sql
4. Buat user admin: Supabase > Authentication > Users > Add user (Email/Password)
5. Copy file .env.example menjadi .env.local, isi:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   (ambil dari Supabase > Project Settings > API)
6. Jalankan
   npm run dev
   buka http://localhost:3000

## Struktur Database
- categories: kategori produk
- products: produk (nama, harga, stok, foto, kategori, aktif)
- settings: 1 baris (wa_admin, rekening, qris_url, free_desa)
- orders: pesanan pelanggan
- order_items: detail item per pesanan

Storage bucket: products, proofs, settings (semua public read).

## Deploy ke Vercel (gratis)
1. Push project ini ke GitHub
2. Login vercel.com, New Project, import repo
3. Isi Environment Variables sama seperti .env.local
4. Deploy
5. Domain default *.vercel.app gratis, atau beli domain .my.id murah

## Catatan
- Nomor WA admin saat ini: 085649894084 (ubah di menu Pengaturan admin)
- QRIS: upload gambar QRIS statis koperasi di Pengaturan
- Rekening: isi di Pengaturan untuk tampil saat transfer
