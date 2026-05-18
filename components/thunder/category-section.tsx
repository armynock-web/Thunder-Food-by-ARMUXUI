"use client";

import Link from "next/link";
import {
  Utensils,
  Coffee,
  Pizza,
  Salad,
  IceCream,
  Soup,
  Sandwich,
  Fish,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "ทั้งหมด", icon: Utensils, color: "bg-primary" },
  { id: "drinks", name: "เครื่องดื่ม", icon: Coffee, color: "bg-amber-100" },
  { id: "pizza", name: "พิซซ่า", icon: Pizza, color: "bg-red-100" },
  { id: "healthy", name: "สุขภาพ", icon: Salad, color: "bg-green-100" },
  { id: "dessert", name: "ของหวาน", icon: IceCream, color: "bg-pink-100" },
  { id: "noodles", name: "ก๋วยเตี๋ยว", icon: Soup, color: "bg-orange-100" },
  { id: "fastfood", name: "ฟาสต์ฟู้ด", icon: Sandwich, color: "bg-yellow-100" },
  { id: "seafood", name: "อาหารทะเล", icon: Fish, color: "bg-blue-100" },
];

interface CategorySectionProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export function CategorySection({
  selectedCategory = "all",
  onSelectCategory,
}: CategorySectionProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-3 pb-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <Link
              key={category.id}
              href={`/search?category=${category.id}`}
              onClick={(e) => {
                if (onSelectCategory) {
                  e.preventDefault();
                  onSelectCategory(category.id);
                }
              }}
              className={cn(
                "flex flex-col items-center gap-2 min-w-[70px] transition-all duration-200"
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200",
                  isSelected
                    ? "bg-accent shadow-lg scale-105"
                    : category.color
                )}
              >
                <category.icon
                  className={cn(
                    "w-6 h-6",
                    isSelected ? "text-accent-foreground" : "text-foreground"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
