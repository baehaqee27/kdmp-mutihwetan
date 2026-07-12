import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("relative block shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.webp"
        alt="Logo Koperasi Desa Merah Putih"
        fill
        sizes={`${size}px`}
        className="object-contain"
      />
    </span>
  );
}
