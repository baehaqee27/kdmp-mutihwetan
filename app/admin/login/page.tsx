"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { adminSignIn } from "@/lib/admin";
import { STORE } from "@/lib/constants";
import { Logo } from "@/components/store/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await adminSignIn(email, password);
      if (error) {
        setError("Email atau password salah.");
      } else {
        router.replace("/admin");
      }
    } catch {
      setError("Gagal masuk. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-background p-7 shadow-xl">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Logo size={40} />
          <span className="text-base font-bold text-primary">{STORE.short}</span>
        </Link>
        <h1 className="mb-1 text-center text-lg font-bold">Login Admin</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Masuk untuk kelola toko
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kopmerahputih.id"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Buat akun di Supabase Auth (Email / Password).
        </p>
      </div>
    </div>
  );
}
