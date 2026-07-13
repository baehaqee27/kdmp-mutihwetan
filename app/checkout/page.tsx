"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Banknote,
  QrCode,
  Truck,
  MessageCircle,
  CheckCircle2,
  Upload,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/components/store/cart-context";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrder, getSettings, getOrderTracking } from "@/lib/api";
import { waLink, orderWaMessage } from "@/lib/wa";
import { formatRupiah } from "@/lib/utils";
import { PAYMENT_METHODS, DESA_OPTIONS, STORE } from "@/lib/constants";
import type { Order, OrderItem, Settings } from "@/lib/types";

export default function CheckoutPage() {
  const { items, total, clear, count } = useCart();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [loadingSettings, setLoadingSettings] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    address: "",
    desa: DESA_OPTIONS[0],
    note: "",
    payment: "transfer" as string,
  });
  const [proof, setProof] = React.useState<File | null>(null);
  const [created, setCreated] = React.useState<{
    order: Order;
    items: OrderItem[];
    waUrl: string;
  } | null>(null);

  React.useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoadingSettings(false));
  }, []);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/masuk?redirect=/checkout");
    }
  }, [authLoading, user, router]);

  React.useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || "",
        phone: f.phone || user.phone || "",
      }));
    }
  }, [user]);

  const isFreeDesa = form.desa === (settings?.free_desa ?? STORE.freeDesa);
  const ongkir = 0;
  const grandTotal = total + ongkir;

  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const errors = { ...formErrors };
    switch (field) {
      case "name":
        if (value.trim() && value.trim().length < 2) errors.name = "Minimal 2 karakter";
        else delete errors.name;
        break;
      case "phone": {
        const clean = value.replace(/[\s\-()]/g, "");
        if (clean && !/^(08|\+62|62)\d{8,13}$/.test(clean)) errors.phone = "Contoh: 081234567890";
        else delete errors.phone;
        break;
      }
      case "address":
        if (value.trim() && value.trim().length < 10) errors.address = "Minimal 10 karakter, sertakan RT/RW";
        else delete errors.address;
        break;
    }
    setFormErrors(errors);
  };

  const needProof = form.payment === "transfer" || form.payment === "qris";

  if (count === 0 && !created) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-bold">Tidak ada item</h1>
        <Button asChild>
          <Link href="/produk">Mulai Belanja</Link>
        </Button>
      </div>
    );
  }

  if (created) {
    return (
      <div className="container-page max-w-xl py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-500" />
          <h1 className="text-2xl font-bold">Pesanan Terkirim</h1>
          <p className="text-sm text-muted-foreground">
            No. Order <strong>{created.order.order_number}</strong>. Silakan
            konfirmasi ke admin via WhatsApp agar pesanan diproses.
          </p>
          <Button asChild size="lg">
            <a href={created.waUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> Kirim ke WhatsApp Admin
            </a>
          </Button>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/pesanan?order=${created.order.order_number}&phone=${created.order.phone}`}>
                Lacak Pesanan
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/produk">Belanja Lagi</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("Nama lengkap wajib diisi (minimal 2 karakter).");
      return;
    }

    const phoneClean = form.phone.replace(/[\s\-()]/g, "");
    if (!phoneClean) {
      setError("Nomor WhatsApp wajib diisi.");
      return;
    }
    if (!/^(08|\+62|62)\d{8,13}$/.test(phoneClean)) {
      setError("Format nomor WhatsApp tidak valid. Contoh: 081234567890");
      return;
    }

    if (!form.address.trim() || form.address.trim().length < 10) {
      setError("Alamat lengkap wajib diisi (minimal 10 karakter, sertakan RT/RW).");
      return;
    }

    if (needProof && !proof) {
      setError("Silakan unggah bukti pembayaran.");
      return;
    }
    if (proof && proof.size > 5 * 1024 * 1024) {
      setError("Ukuran bukti pembayaran maksimal 5 MB.");
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        product_id: i.id,
        product_name: i.name,
        qty: i.qty,
        price: i.price,
      }));

      const order = await createOrder({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        desa: form.desa,
        payment_method: form.payment,
        ongkir,
        total: grandTotal,
        note: form.note || undefined,
        proofFile: proof,
        user_id: user?.id ?? null,
        user_email: user?.email ?? null,
        items: orderItems,
      });

      const waUrl = waLink(
        settings?.wa_admin ?? "085649894084",
        orderWaMessage({
          order_number: order.order_number,
          customer_name: form.name,
          phone: form.phone,
          desa: form.desa,
          payment_method: form.payment,
          total: grandTotal,
          ongkir,
          items: orderItems,
        })
      );

      const tracked = await getOrderTracking(order.order_number, form.phone);

      clear();
      setCreated({
        order,
        items: tracked?.items ?? [],
        waUrl,
      });
    } catch (err) {
      console.error(err);
      setError("Gagal membuat pesanan. Coba lagi atau hubungi admin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Data diri */}
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-base font-bold">Data Penerima</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onBlur={(e) => validateField("name", e.target.value)}
                  placeholder="Budi Santoso"
                  className={formErrors.name ? "border-destructive" : ""}
                />
                {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Nomor WhatsApp</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  onBlur={(e) => validateField("phone", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={formErrors.phone ? "border-destructive" : ""}
                />
                {formErrors.phone && <p className="text-xs text-destructive">{formErrors.phone}</p>}
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                onBlur={(e) => validateField("address", e.target.value)}
                placeholder="RT/RW, dusun, patokan"
                className={formErrors.address ? "border-destructive" : ""}
              />
              {formErrors.address && <p className="text-xs text-destructive">{formErrors.address}</p>}
            </div>
            <div className="mt-4 space-y-1.5">
              <Label>Desa / Wilayah</Label>
              <Select
                value={form.desa}
                onValueChange={(v) => setForm({ ...form, desa: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DESA_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {isFreeDesa
                  ? `Ongkir gratis untuk desa ${settings?.free_desa ?? "Mutih Wetan"}.`
                  : "Luar desa: crew akan menginformasikan ongkir."}
              </p>
            </div>
          </section>

          {/* Pembayaran */}
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-base font-bold">Metode Pembayaran</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => {
                const Icon =
                  m.id === "transfer"
                    ? Banknote
                    : m.id === "qris"
                      ? QrCode
                      : Truck;
                const active = form.payment === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setForm({ ...form, payment: m.id })}
                    className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition-all active:scale-[0.98] ${
                      active
                        ? "border-primary bg-accent ring-1 ring-primary"
                        : "hover:border-primary/40"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold">{m.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {m.description}
                    </span>
                  </button>
                );
              })}
            </div>

            {form.payment === "transfer" && settings && (
              <div className="mt-4 rounded-lg bg-secondary/50 p-4 text-sm">
                <p className="font-semibold">Transfer Bank</p>
                <p className="mt-1 text-muted-foreground">
                  {settings.rekening ?? "Rekening belum diatur admin."}
                </p>
              </div>
            )}

            {form.payment === "qris" && settings?.qris_url && (
              <div className="mt-4 flex flex-col items-center gap-2 rounded-lg bg-secondary/50 p-4">
                <p className="text-sm font-semibold">Scan QRIS Koperasi</p>
                <div className="relative h-48 w-48 overflow-hidden rounded-lg border bg-white">
                  <Image
                    src={settings.qris_url}
                    alt="QRIS"
                    fill
                    sizes="192px"
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {needProof && (
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="proof">Unggah Bukti Pembayaran</Label>
                <label
                  htmlFor="proof"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Upload className="h-4 w-4" />
                  {proof ? proof.name : "Pilih file foto bukti transfer"}
                </label>
                <input
                  id="proof"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProof(e.target.files?.[0] ?? null)}
                />
              </div>
            )}
          </section>

          <section className="rounded-xl border bg-card p-5">
            <Label htmlFor="note">Catatan (opsional)</Label>
            <Textarea
              id="note"
              className="mt-2"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Misal: titip ke tetangga"
            />
          </section>
        </div>

        {/* Ringkasan */}
        <aside className="h-fit rounded-xl border bg-card p-5 lg:sticky lg:top-20">
          <h2 className="mb-4 text-base font-bold">Pesanan Anda</h2>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between gap-2 text-sm">
                <span className="line-clamp-1 text-muted-foreground">
                  {i.qty}x {i.name}
                </span>
                <span className="font-medium">{formatRupiah(i.qty * i.price)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatRupiah(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ongkir</span>
              <span>{isFreeDesa ? "Gratis" : "Menyusul"}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-primary">{formatRupiah(grandTotal)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-4 w-full" disabled={submitting}>
            {submitting ? "Memproses..." : "Buat Pesanan"}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Dengan memesan, Anda akan diarahkan ke WhatsApp Admin.
          </p>
        </aside>
      </form>
    </div>
  );
}
