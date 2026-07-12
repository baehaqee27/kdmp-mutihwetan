"use client";

import * as React from "react";
import Image from "next/image";
import { Eye, MessageCircle } from "lucide-react";
import {
  adminGetOrders,
  adminGetOrderItems,
  adminUpdateOrderStatus,
} from "@/lib/api";
import { waLink, orderWaMessage } from "@/lib/wa";
import { formatRupiah, formatDate } from "@/lib/utils";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS, STORE } from "@/lib/constants";
import type { Order, OrderItem } from "@/lib/types";

function statusMeta(status: string) {
  return (
    ORDER_STATUS.find((s) => s.id === status) ?? {
      id: status,
      label: status,
      color: "bg-muted text-muted-foreground",
    }
  );
}

export default function AdminPesananPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<Order | null>(null);
  const [items, setItems] = React.useState<OrderItem[]>([]);
  const [statusLocal, setStatusLocal] = React.useState("");

  const load = React.useCallback(() => {
    adminGetOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => load(), [load]);

  const openDetail = async (o: Order) => {
    setSelected(o);
    setStatusLocal(o.status);
    try {
      setItems(await adminGetOrderItems(o.id));
    } catch {
      setItems([]);
    }
  };

  const changeStatus = async (status: string) => {
    if (!selected) return;
    setStatusLocal(status);
    try {
      await adminUpdateOrderStatus(selected.id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === selected.id ? { ...o, status } : o))
      );
    } catch {
      /* ignore */
    }
  };

  const waUrl = selected
    ? waLink(
        STORE.waAdmin,
        orderWaMessage({
          order_number: selected.order_number,
          customer_name: selected.customer_name,
          phone: selected.phone,
          desa: selected.desa,
          payment_method: selected.payment_method,
          total: selected.total,
          ongkir: selected.ongkir,
          items: items.map((i) => ({
            product_name: i.product_name,
            qty: i.qty,
            price: i.price,
          })),
        })
      )
    : "#";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Pesanan</h1>
        <p className="text-sm text-muted-foreground">
          Kelola dan konfirmasi pesanan ({orders.length})
        </p>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          Belum ada pesanan.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Order</TableHead>
              <TableHead className="hidden sm:table-cell">Pelanggan</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.order_number}</TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {o.customer_name}
                  <br />
                  <span className="text-xs">{o.desa}</span>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {formatRupiah(o.total)}
                </TableCell>
                <TableCell>
                  <Badge className={statusMeta(o.status).color}>
                    {statusMeta(o.status).label}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                  {formatDate(o.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDetail(o)}
                    aria-label="Detail"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.order_number}</DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {formatDate(selected.created_at)}
                </p>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div className="grid gap-2 rounded-lg bg-muted/40 p-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama</span>
                    <span className="font-medium">{selected.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WhatsApp</span>
                    <span className="font-medium">{selected.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desa</span>
                    <span className="font-medium">{selected.desa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alamat</span>
                    <span className="max-w-[60%] text-right font-medium">
                      {selected.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pembayaran</span>
                    <span className="font-medium uppercase">
                      {selected.payment_method}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-semibold">Item</p>
                  <div className="space-y-1">
                    {items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {it.qty}x {it.product_name}
                        </span>
                        <span>{formatRupiah(it.qty * it.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between border-t pt-2 font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatRupiah(selected.total)}
                    </span>
                  </div>
                </div>

                {selected.proof_url && (
                  <div>
                    <p className="mb-2 font-semibold">Bukti Pembayaran</p>
                    <div className="relative h-56 w-full overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={selected.proof_url}
                        alt="Bukti"
                        fill
                        sizes="100%"
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <p className="mb-2 font-semibold">Ubah Status</p>
                  <Select value={statusLocal} onValueChange={changeStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUS.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a href={waUrl} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" /> Hubungi WhatsApp
                  </a>
                </Button>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Tutup
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
