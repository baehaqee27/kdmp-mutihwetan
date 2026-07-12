import { STORE } from "./constants";

export function waLink(phone: string, message: string) {
  const cleaned = phone.replace(/\D/g, "");
  const formatted = cleaned.startsWith("0")
    ? "62" + cleaned.slice(1)
    : cleaned.startsWith("62")
      ? cleaned
      : "62" + cleaned;
  const url = `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
  return url;
}

export function orderWaMessage(order: {
  order_number: string;
  customer_name: string;
  phone: string;
  desa: string;
  payment_method: string;
  total: number;
  ongkir: number;
  items: { product_name: string; qty: number; price: number }[];
}) {
  const lines: string[] = [];
  lines.push(`*PESANAN BARU - ${STORE.name}*`);
  lines.push(`No. Order: ${order.order_number}`);
  lines.push(`Nama: ${order.customer_name}`);
  lines.push(`Wa: ${order.phone}`);
  lines.push(`Desa: ${order.desa}`);
  lines.push(`Pembayaran: ${order.payment_method.toUpperCase()}`);
  lines.push("");
  lines.push("Detail:");
  for (const it of order.items) {
    lines.push(
      `- ${it.product_name} x${it.qty} = Rp${(it.qty * it.price).toLocaleString("id-ID")}`
    );
  }
  lines.push("");
  lines.push(`Ongkir: Rp${order.ongkir.toLocaleString("id-ID")}`);
  lines.push(`Total: Rp${order.total.toLocaleString("id-ID")}`);
  return lines.join("\n");
}
