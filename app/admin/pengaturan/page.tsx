"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, Save } from "lucide-react";
import { getSettings, adminUpdateSettings, adminUploadSettingImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DESA_OPTIONS } from "@/lib/constants";
import type { Settings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [form, setForm] = React.useState({
    store_name: "",
    wa_admin: "",
    rekening: "",
    free_desa: "Mutih Wetan",
  });
  const [qrisUrl, setQrisUrl] = React.useState<string | null>(null);
  const [qrisFile, setQrisFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    getSettings()
      .then((s) => {
        if (s) {
          setSettings(s);
          setForm({
            store_name: s.store_name,
            wa_admin: s.wa_admin,
            rekening: s.rekening ?? "",
            free_desa: s.free_desa,
          });
          setQrisUrl(s.qris_url);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      let finalQris = qrisUrl;
      if (qrisFile) {
        finalQris = await adminUploadSettingImage(qrisFile, "qris");
        setQrisUrl(finalQris);
      }
      await adminUpdateSettings({
        store_name: form.store_name,
        wa_admin: form.wa_admin,
        rekening: form.rekening || null,
        free_desa: form.free_desa,
        qris_url: finalQris,
      });
      setMsg("Pengaturan tersimpan.");
    } catch (e) {
      console.error(e);
      setMsg("Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Memuat...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold">Pengaturan Toko</h1>
        <p className="text-sm text-muted-foreground">
          Atur informasi toko, kontak, dan pembayaran.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-5">
        <div className="space-y-1.5">
          <Label htmlFor="sname">Nama Toko</Label>
          <Input
            id="sname"
            value={form.store_name}
            onChange={(e) => setForm({ ...form, store_name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="swa">Nomor WhatsApp Admin</Label>
          <Input
            id="swa"
            value={form.wa_admin}
            onChange={(e) => setForm({ ...form, wa_admin: e.target.value })}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="srek">Rekening Bank (transfer manual)</Label>
          <Input
            id="srek"
            value={form.rekening}
            onChange={(e) => setForm({ ...form, rekening: e.target.value })}
            placeholder="BCA 1234567890 a.n Koperasi"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Desa Gratis Ongkir</Label>
          <div className="flex flex-wrap gap-2">
            {DESA_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setForm({ ...form, free_desa: d })}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  form.free_desa === d
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Gambar QRIS</Label>
          <div className="flex items-center gap-4">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border bg-white">
              {qrisUrl ? (
                <Image src={qrisUrl} alt="QRIS" fill sizes="128px" className="object-contain" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  Belum ada
                </div>
              )}
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:border-primary">
              <Upload className="h-4 w-4" /> Pilih Gambar QRIS
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setQrisFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>
      </div>

      {msg && (
        <p className="rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-700">
          {msg}
        </p>
      )}

      <Button onClick={save} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan"}
      </Button>
    </div>
  );
}
