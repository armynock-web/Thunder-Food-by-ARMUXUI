"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Utensils,
  Coffee,
  Pizza,
  Salad,
  IceCream,
  Soup,
  Sandwich,
  Fish,
  ShoppingBag,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// Icon mapper for dynamic icons from DB
const iconMap: Record<string, LucideIcon> = {
  Utensils,
  Coffee,
  Pizza,
  Salad,
  IceCream,
  Soup,
  Sandwich,
  Fish,
  ShoppingBag
};

interface Category {
  slug: string;
  name: string;
  icon: string;
  color: string;
}

// Fallback just in case DB is slow or empty
const defaultCategories: Category[] = [
  { slug: "all", name: "ทั้งหมด", icon: "Utensils", color: "bg-primary" },
  { slug: "drinks", name: "เครื่องดื่ม", icon: "Coffee", color: "bg-amber-100" },
  { slug: "pizza", name: "พิซซ่า", icon: "Pizza", color: "bg-red-100" },
  { slug: "healthy", name: "สุขภาพ", icon: "Salad", color: "bg-green-100" },
];

interface CategorySectionProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export function CategorySection({
  selectedCategory = "all",
  onSelectCategory,
}: CategorySectionProps) {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        setCategories(data);
      }
    }
    fetchCategories();
  }, [supabase]);

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-3 pb-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.slug;
          const IconComponent = iconMap[category.icon] || Utensils;
          
          return (
            <Link
              key={category.slug}
              href={`/search?category=${category.slug}`}
              onClick={(e) => {
                if (onSelectCategory) {
                  e.preventDefault();
                  onSelectCategory(category.slug);
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
                <IconComponent
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
