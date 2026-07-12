import { cn } from "@/lib/utils";

interface WaveDividerProps {
  color?: string;
  flip?: boolean;
  className?: string;
}

export function WaveDivider({
  color = "hsl(var(--primary))",
  flip = false,
  className,
}: WaveDividerProps) {
  return (
    <div
      className={cn(
        "pointer-events-none w-full leading-[0]",
        flip && "rotate-180",
        className
      )}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="block h-[60px] w-full sm:h-[80px] lg:h-[100px]"
      >
        <path
          fill={color}
          fillOpacity="1"
          d="M0,224L0,32L49.7,32L49.7,128L99.3,128L99.3,128L149,128L149,288L198.6,288L198.6,256L248.3,256L248.3,128L297.9,128L297.9,32L347.6,32L347.6,192L397.2,192L397.2,128L446.9,128L446.9,0L496.6,0L496.6,160L546.2,160L546.2,128L595.9,128L595.9,288L645.5,288L645.5,128L695.2,128L695.2,192L744.8,192L744.8,320L794.5,320L794.5,256L844.1,256L844.1,160L893.8,160L893.8,32L943.4,32L943.4,128L993.1,128L993.1,192L1042.8,192L1042.8,256L1092.4,256L1092.4,192L1142.1,192L1142.1,32L1191.7,32L1191.7,0L1241.4,0L1241.4,32L1291,32L1291,160L1340.7,160L1340.7,128L1390.3,128L1390.3,160L1440,160L1440,0L1390.3,0L1390.3,0L1340.7,0L1340.7,0L1291,0L1291,0L1241.4,0L1241.4,0L1191.7,0L1191.7,0L1142.1,0L1142.1,0L1092.4,0L1092.4,0L1042.8,0L1042.8,0L993.1,0L993.1,0L943.4,0L943.4,0L893.8,0L893.8,0L844.1,0L844.1,0L794.5,0L794.5,0L744.8,0L744.8,0L695.2,0L695.2,0L645.5,0L645.5,0L595.9,0L595.9,0L546.2,0L546.2,0L496.6,0L496.6,0L446.9,0L446.9,0L397.2,0L397.2,0L347.6,0L347.6,0L297.9,0L297.9,0L248.3,0L248.3,0L198.6,0L198.6,0L149,0L149,0L99.3,0L99.3,0L49.7,0L49.7,0L0,0L0,0Z"
        />
      </svg>
    </div>
  );
}
