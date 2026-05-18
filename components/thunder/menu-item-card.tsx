"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
  isPromo?: boolean;
}

export function MenuItemCard({
  name,
  description,
  price,
  originalPrice,
  image,
  quantity = 0,
  onAdd,
  onRemove,
  isPromo,
}: MenuItemCardProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex gap-3 p-3 bg-card rounded-2xl border border-border hover:shadow-md transition-all duration-200">
      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
        />
        {isPromo && (
          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            PROMO
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            -{discountPercent}%
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-foreground truncate">{name}</h4>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-end justify-between mt-2">
          <div>
            <span className="text-lg font-bold text-foreground">
              ฿{price.toFixed(0)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through ml-1.5">
                ฿{originalPrice.toFixed(0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {quantity > 0 ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-transparent"
                  onClick={onRemove}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={onAdd}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="h-8 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                onClick={onAdd}
              >
                <Plus className="w-4 h-4 mr-1" />
                เพิ่ม
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
