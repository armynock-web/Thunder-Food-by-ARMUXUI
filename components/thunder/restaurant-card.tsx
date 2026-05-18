"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  distance: string;
  promo?: string;
  tags?: string[];
  variant?: "horizontal" | "vertical";
}

export function RestaurantCard({
  id,
  name,
  image,
  rating,
  reviewCount,
  deliveryTime,
  distance,
  promo,
  tags = [],
  variant = "vertical",
}: RestaurantCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (variant === "horizontal") {
    return (
      <Link
        href={`/customer/restaurant/${id}`}
        className="flex gap-3 p-3 bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-200"
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
          {promo && (
            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              {promo}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className="flex-shrink-0"
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                )}
              />
            </button>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">
              ({reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {distance}
            </span>
          </div>
          {tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/customer/restaurant/${id}`}
      className="block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
        />
        {promo && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-lg">
            {promo}
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
            )}
          />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-foreground truncate">{name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-4 h-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {deliveryTime}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {distance}
          </span>
        </div>
      </div>
    </Link>
  );
}
