"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search, ArrowRight, Package } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

const DEBOUNCE_MS = 200;
const MAX_RESULTS = 6;

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/15 text-primary font-semibold">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface SearchDropdownProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  mobile?: boolean;
  onResultClick?: () => void;
}

export function SearchDropdown({
  className,
  inputClassName,
  placeholder = "Cari produk...",
  mobile = false,
  onResultClick,
}: SearchDropdownProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Product[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const [products, setProducts] = React.useState<Product[]>([]);
  const fuseRef = React.useRef<Fuse<Product> | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // fetch products once
  React.useEffect(() => {
    getProducts()
      .then((p) => {
        setProducts(p);
        fuseRef.current = new Fuse(p, {
          keys: [
            { name: "name", weight: 0.5 },
            { name: "description", weight: 0.2 },
            { name: "category.name", weight: 0.3 },
          ],
          threshold: 0.4,
          ignoreLocation: true,
          minMatchCharLength: 2,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // debounce search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      setActiveIdx(-1);
      return;
    }
    const t = setTimeout(() => {
      if (!fuseRef.current) {
        // fallback: basic filter
        const q = query.toLowerCase();
        setResults(
          products
            .filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.category?.name?.toLowerCase().includes(q)
            )
            .slice(0, MAX_RESULTS)
        );
      } else {
        setResults(fuseRef.current.search(query).slice(0, MAX_RESULTS).map((r) => r.item));
      }
      setOpen(true);
      setActiveIdx(-1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query, products]);

  // close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToSearch = () => {
    const q = query.trim();
    if (q) {
      router.push(`/produk?search=${encodeURIComponent(q)}`);
      setOpen(false);
      setQuery("");
      onResultClick?.();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) {
      if (e.key === "Enter") goToSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < results.length) {
        router.push(`/produk/${results[activeIdx].slug}`);
        setOpen(false);
        setQuery("");
        onResultClick?.();
      } else {
        goToSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToSearch();
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setOpen(true);
          }}
          onFocus={() => {
            if (query.trim() && results.length > 0) setOpen(true);
          }}
          placeholder={placeholder}
          className={cn(
            "h-9 w-full rounded-full border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            mobile && "h-10 rounded-md",
            inputClassName
          )}
        />
      </form>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border bg-background shadow-lg animate-in fade-in slide-in-from-top-2">
          {results.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto p-1">
                {results.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/produk/${p.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                      onResultClick?.();
                    }}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      activeIdx === i ? "bg-accent" : "hover:bg-accent/50"
                    )}
                  >
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-11 w-11 flex-shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        <Highlight text={p.name} query={query} />
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.category?.name ?? "Umum"}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-sm font-bold text-primary">
                      {formatRupiah(p.price)}
                    </span>
                  </Link>
                ))}
              </div>
              <button
                onClick={goToSearch}
                className="flex w-full items-center justify-center gap-1 border-t px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
              >
                Lihat semua hasil
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
              Produk tidak ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
}
