"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Store, LogIn, UserPlus } from "lucide-react";
import { signIn, signUp } from "@/lib/auth";
import { STORE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function MasukContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/produk";

  const [tab, setTab] = React.useState("masuk");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        setError("Email atau password salah.");
      } else {
        router.push(redirect);
        router.refresh();
      }
    } catch {
      setError("Gagal masuk. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await signUp({
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      if (data.session) {
        router.push(redirect);
        router.refresh();
      } else {
        setInfo("Pendaftaran berhasil. Cek email untuk verifikasi, lalu masuk.");
        setTab("masuk");
      }
    } catch {
      setError("Gagal mendaftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-7 shadow-xl">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </span>
          <span className="text-base font-bold text-primary">{STORE.name}</span>
        </Link>
        <p className="mb-5 text-center text-sm text-muted-foreground">
          Masuk atau daftar untuk bertransaksi
        </p>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="masuk">Masuk</TabsTrigger>
            <TabsTrigger value="daftar">Daftar</TabsTrigger>
          </TabsList>

          <TabsContent value="masuk">
            <form onSubmit={doLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="lemail">Email</Label>
                <Input
                  id="lemail"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="email@contoh.id"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lpass">Password</Label>
                <Input
                  id="lpass"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="********"
                />
              </div>
              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4" /> {loading ? "Masuk..." : "Masuk"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="daftar">
            <form onSubmit={doRegister} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="rname">Nama Lengkap</Label>
                <Input
                  id="rname"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Budi Santoso"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rphone">Nomor WhatsApp</Label>
                <Input
                  id="rphone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="remail">Email</Label>
                <Input
                  id="remail"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="email@contoh.id"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="rpass">Password</Label>
                  <Input
                    id="rpass"
                    type="password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="123456"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rconf">Konfirmasi</Label>
                  <Input
                    id="rconf"
                    type="password"
                    value={form.confirm}
                    onChange={(e) => set("confirm", e.target.value)}
                    placeholder="123456"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}
              {info && (
                <p className="rounded-md bg-emerald-100 px-3 py-2 text-xs text-emerald-700">
                  {info}
                </p>
              )}
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                <UserPlus className="h-4 w-4" /> {loading ? "Mendaftar..." : "Daftar"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Dengan mendaftar, Anda menyetujui kebijakan koperasi.
        </p>
      </div>
    </div>
  );
}

export default function MasukPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Memuat...</div>}>
      <MasukContent />
    </React.Suspense>
  );
}
