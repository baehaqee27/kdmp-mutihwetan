export const STORE = {
  name: "Koperasi Desa Kelurahan Merah Putih",
  short: "KDKMP",
  village: "Mutih Wetan",
  tagline: "Belanja Berkualitas dari Desa",
  waAdmin: "085649894084",
  freeDesa: "Mutih Wetan",
  email: "kopmerahputih@gmail.com",
};

export const PAYMENT_METHODS = [
  {
    id: "transfer",
    label: "Transfer Bank",
    description: "Bayar via transfer manual, kirim bukti.",
  },
  {
    id: "qris",
    label: "QRIS",
    description: "Scan QRIS statis koperasi, kirim bukti.",
  },
  {
    id: "cod",
    label: "COD",
    description: "Bayar saat barang sampai di tempat.",
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export const ORDER_STATUS = [
  {
    id: "menunggu_konfirmasi",
    label: "Menunggu Konfirmasi",
    color: "bg-amber-100 text-amber-700",
  },
  { id: "diproses", label: "Diproses", color: "bg-blue-100 text-blue-700" },
  { id: "dikirim", label: "Dikirim", color: "bg-indigo-100 text-indigo-700" },
  { id: "selesai", label: "Selesai", color: "bg-emerald-100 text-emerald-700" },
  { id: "dibatalkan", label: "Dibatalkan", color: "bg-rose-100 text-rose-700" },
] as const;

export const DESA_OPTIONS = [
  "Mutih Wetan",
  "Mutih Kulon",
  "Kalongan",
  "Sambong",
  "Tlogojati",
  "Lainnya",
];
