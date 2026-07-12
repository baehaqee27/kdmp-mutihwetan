"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { adminGetAllProducts, adminDeleteProduct, getCategories } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProductDialog } from "@/components/admin/product-dialog";
import type { Category, Product } from "@/lib/types";

export default function AdminProdukPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);

  const load = React.useCallback(() => {
    Promise.all([adminGetAllProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => load(), [load]);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminDeleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Produk</h1>
          <p className="text-sm text-muted-foreground">
            Kelola katalog toko ({products.length})
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Tambah
        </Button>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Package className="h-8 w-8" />
          <p className="text-sm">Belum ada produk. Tambah sekarang.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead className="hidden sm:table-cell">Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead className="hidden md:table-cell">Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-muted">
                      {p.image_url ? (
                        <Image src={p.image_url} alt="" fill sizes="44px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Package className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <span className="line-clamp-1 text-sm font-medium">
                      {p.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {p.category?.name ?? "-"}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {formatRupiah(p.price)}
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  {p.stock}
                </TableCell>
                <TableCell>
                  {p.active ? (
                    <Badge variant="success">Aktif</Badge>
                  ) : (
                    <Badge variant="muted">Nonaktif</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(p)}
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(p)}
                      aria-label="Hapus"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editing}
        categories={categories}
        onSaved={load}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Produk</DialogTitle>
            <DialogDescription>
              Yakin hapus &quot;{deleteTarget?.name}&quot;? Tindakan tidak bisa dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
