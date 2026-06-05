import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "avatar" | "card" | "input" | "custom";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

const variantDefaults: Record<SkeletonVariant, string> = {
  text: "h-4 w-full",
  avatar: "w-10 h-10 rounded-full",
  card: "h-32 w-full rounded-2xl",
  input: "h-10 w-full rounded-[10px]",
  custom: "",
};

export function Skeleton({
  variant = "text",
  className,
  width,
  height,
  rounded,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton",
        variantDefaults[variant],
        rounded && "rounded-full",
        className,
      )}
      style={{
        ...(width
          ? { width: typeof width === "number" ? `${width}px` : width }
          : {}),
        ...(height
          ? { height: typeof height === "number" ? `${height}px` : height }
          : {}),
      }}
      aria-hidden="true"
    />
  );
}
