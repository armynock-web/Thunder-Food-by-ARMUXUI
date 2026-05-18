"use client"

import Image from "next/image"
import { Plus, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MenuItemProps {
  id: string
  name: string
  nameTh: string
  description: string
  price: number
  originalPrice?: number
  image: string
  isPopular?: boolean
  quantity?: number
  onAdd?: () => void
  onRemove?: () => void
}

export function MenuItem({
  name,
  nameTh,
  description,
  price,
  originalPrice,
  image,
  isPopular = false,
  quantity = 0,
  onAdd,
  onRemove,
}: MenuItemProps) {
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(p)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex gap-3 p-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
          {isPopular && (
            <Badge className="absolute -right-1 -top-1 bg-primary px-1 py-0 text-[10px]">
              ยอดนิยม
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h4 className="font-semibold text-foreground line-clamp-1">{nameTh}</h4>
            <p className="text-xs text-muted-foreground">{name}</p>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">{formatPrice(price)}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {quantity > 0 ? (
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 bg-transparent"
                    onClick={onRemove}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center font-medium">{quantity}</span>
                  <Button
                    size="icon"
                    className="h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={onAdd}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="icon"
                  className="h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={onAdd}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
