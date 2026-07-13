"use client";

import * as React from "react";
import { Star, Send } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getReviewsByProduct, createReview } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/lib/types";

export function ReviewSection({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const { user } = useAuth();
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [hoverRating, setHoverRating] = React.useState(0);

  React.useEffect(() => {
    getReviewsByProduct(productId)
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    setSubmitting(true);
    try {
      const review = await createReview({
        product_id: productId,
        user_id: user.id,
        user_name: user.name || user.email || "Anonim",
        rating,
        comment: comment.trim(),
      });
      setReviews((prev) => [review, ...prev]);
      setComment("");
      setRating(5);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border bg-card p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Ulasan Pelanggan</h3>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(avgRating)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {avgRating > 0 ? avgRating.toFixed(1) : "-"} dari 5 ({reviews.length} ulasan)
            </span>
          </div>
        </div>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border bg-background p-4">
          <p className="mb-3 text-sm font-medium">Tulis Ulasan</p>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRating(v)}
                onMouseEnter={() => setHoverRating(v)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5"
              >
                <Star
                  className={`h-5 w-5 transition-colors ${
                    v <= (hoverRating || rating)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Bagaimana menurut Anda tentang ${productName}?`}
            className="mb-3 text-sm"
            rows={3}
          />
          <Button type="submit" size="sm" disabled={submitting || !comment.trim()}>
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Mengirim..." : "Kirim"}
          </Button>
        </form>
      )}

      {!user && reviews.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Masuk untuk menulis ulasan.
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Belum ada ulasan untuk produk ini.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {r.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.user_name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`h-3 w-3 ${
                            j < r.rating
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {r.comment && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
