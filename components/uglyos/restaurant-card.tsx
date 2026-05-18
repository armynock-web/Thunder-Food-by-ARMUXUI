"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RestaurantCardProps {
  id: string
  name: string
  nameTh: string
  image: string
  rating: number
  reviewCount: number
  deliveryTime: string
  distance: string
  tags: string[]
  isPromo?: boolean
  promoText?: string
}

export function RestaurantCard({
  id,
  name,
  nameTh,
  image,
  rating,
  reviewCount,
  deliveryTime,
  distance,
  tags,
  isPromo = false,
  promoText,
}: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
          {isPromo && promoText && (
            <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground">
              {promoText}
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <div className="mb-1 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground line-clamp-1">{nameTh}</h3>
              <p className="text-xs text-muted-foreground">{name}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
              <Star className="h-3 w-3 fill-secondary text-secondary" />
              <span className="text-xs font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{distance}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
