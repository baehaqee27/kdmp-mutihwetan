"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { observeSession, adminSignOut } from "@/lib/admin";
import { STORE } from "@/lib/constants";
import { Logo } from "@/components/store/logo";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/pesanan", label: "Pesanan", icon: ClipboardList },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = React.useState<unknown>(undefined);
  const [sidebar, setSidebar] = React.useState(false);

  React.useEffect(() => observeSession(setSession), []);

  React.useEffect(() => {
    if (session === null) router.replace("/admin/login");
  }, [session, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Memuat...
      </div>
    );
  }

  if (session === null) {
    return null;
  }

  const logout = async () => {
    await adminSignOut();
    router.replace("/admin/login");
  };

  const SidebarContent = (
    <div className="flex h-full flex-col gap-1 p-4">
      <Link href="/" className="mb-4 flex items-center gap-2 px-2 font-bold">
        <Logo size={36} />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold text-primary">Admin</span>
            <span className="text-[11px] text-muted-foreground">{STORE.short}</span>
          </span>
      </Link>
      {nav.map((n) => {
        const active =
          n.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setSidebar(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        );
      })}
      <div className="mt-auto space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Store className="h-4 w-4" /> Lihat Toko
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
        {SidebarContent}
      </aside>

      {sidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebar(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r bg-background shadow-xl animate-fade-in">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1">
        <header className="flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
          <button
            onClick={() => setSidebar(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold">Admin {STORE.name}</span>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
