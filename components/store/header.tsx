"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  ShoppingCart,
  Search,
  X,
  User,
  LogOut,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "./cart-context";
import { useAuth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { STORE } from "@/lib/constants";

export function Header() {
  const { count } = useCart();
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/produk?search=${encodeURIComponent(q)}` : "/produk");
    setOpen(false);
  };

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/produk", label: "Produk" },
    { href: "/tentang", label: "Tentang" },
    { href: "/kontak", label: "Kontak" },
    { href: "/faq", label: "FAQ" },
    { href: "/pesanan", label: "Lacak Pesanan" },
  ];

  const logout = async () => {
    await signOut();
    setMenu(false);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Logo size={38} />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold text-primary">{STORE.short}</span>
            <span className="text-[11px] text-muted-foreground">Desa {STORE.village}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === l.href && "text-primary"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 justify-center px-4 md:flex">
          <form onSubmit={submitSearch} className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="h-9 w-full rounded-full border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </form>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/keranjang"
            aria-label="Keranjang"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          {!loading &&
            (user ? (
              <div className="relative">
                <button
                  onClick={() => setMenu((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform active:scale-95"
                  aria-label="Akun"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                </button>
                {menu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenu(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border bg-background shadow-lg animate-scale-in">
                      <div className="border-b px-4 py-3">
                        <p className="text-sm font-semibold">{user.name || "Anggota"}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/akun/pesanan"
                        onClick={() => setMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-accent"
                      >
                        <Package className="h-4 w-4" /> Pesanan Saya
                      </Link>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-accent"
                      >
                        <LogOut className="h-4 w-4" /> Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button asChild size="sm" className="hidden md:inline-flex">
                <Link href="/masuk">Masuk</Link>
              </Button>
            ))}

          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent active:scale-95 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            <form onSubmit={submitSearch} className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </form>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/masuk"
                onClick={() => setOpen(false)}
                className="rounded-md bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
              >
                Masuk / Daftar
              </Link>
            )}
            {user && (
              <>
                <Link
                  href="/akun/pesanan"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Pesanan Saya
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-accent"
                >
                  Keluar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
