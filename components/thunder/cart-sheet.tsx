"use client";

import { ShoppingBag, Plus, Minus, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "./cart-context";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    restaurantName,
  } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-border bg-transparent"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            ตะกร้าสินค้า
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">ตะกร้าว่างเปล่า</h3>
            <p className="text-sm text-muted-foreground">
              เพิ่มรายการอาหารเพื่อเริ่มสั่งซื้อ
            </p>
          </div>
        ) : (
          <>
            {restaurantName && (
              <div className="py-3 border-b border-border">
                <p className="text-sm text-muted-foreground">สั่งจาก</p>
                <p className="font-semibold">{restaurantName}</p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-muted rounded-xl"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-sm font-semibold mt-1">
                      ฿{(item.price * item.quantity).toFixed(0)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto w-6 h-6 rounded-full hover:bg-destructive/10 flex items-center justify-center text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ราคารวม</span>
                <span className="text-lg font-bold">
                  ฿{totalPrice.toFixed(0)}
                </span>
              </div>
              <Button
                asChild
                className="w-full h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
              >
                <Link href="/checkout">ดำเนินการสั่งซื้อ</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function FloatingCartButton() {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <Link
      href="/checkout"
      className={cn(
        "fixed bottom-24 left-4 right-4 max-w-md mx-auto z-40",
        "bg-accent text-accent-foreground rounded-2xl p-4 shadow-2xl",
        "flex items-center justify-between",
        "transform transition-all duration-300",
        "hover:scale-[1.02] active:scale-[0.98]"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold">{totalItems} รายการ</p>
          <p className="text-sm opacity-80">ดูตะกร้า</p>
        </div>
      </div>
      <span className="text-lg font-bold">฿{totalPrice.toFixed(0)}</span>
    </Link>
  );
}
