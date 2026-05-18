"use client";

import { cn } from "@/lib/utils";

interface ThunderLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon";
}

export function ThunderLogo({
  className,
  size = "md",
  variant = "full",
}: ThunderLogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-xl" },
    lg: { icon: 48, text: "text-3xl" },
    xl: { icon: 64, text: "text-4xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="24" r="24" fill="#FFD700" />
          <path
            d="M28 12L16 26H23L20 36L32 22H25L28 12Z"
            fill="#0A0A0A"
            stroke="#0A0A0A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {variant === "full" && (
        <div className={cn("font-bold tracking-tight", text)}>
          <span className="text-foreground">Thunder</span>
          <span className="text-primary"> Delivery</span>
        </div>
      )}
    </div>
  );
}
