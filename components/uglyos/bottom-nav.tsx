"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, User, Store, Bike } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
  labelTh: string
}

interface BottomNavProps {
  role?: "customer" | "restaurant" | "rider"
}

export function BottomNav({ role = "customer" }: BottomNavProps) {
  const pathname = usePathname()

  const customerNav: NavItem[] = [
    { href: "/", icon: <Home className="h-5 w-5" />, label: "Home", labelTh: "หน้าหลัก" },
    { href: "/search", icon: <Search className="h-5 w-5" />, label: "Search", labelTh: "ค้นหา" },
    { href: "/orders", icon: <ShoppingBag className="h-5 w-5" />, label: "Orders", labelTh: "คำสั่งซื้อ" },
    { href: "/profile", icon: <User className="h-5 w-5" />, label: "Profile", labelTh: "โปรไฟล์" },
  ]

  const restaurantNav: NavItem[] = [
    { href: "/restaurant", icon: <Home className="h-5 w-5" />, label: "Dashboard", labelTh: "แดชบอร์ด" },
    { href: "/restaurant/orders", icon: <ShoppingBag className="h-5 w-5" />, label: "Orders", labelTh: "ออเดอร์" },
    { href: "/restaurant/menu", icon: <Store className="h-5 w-5" />, label: "Menu", labelTh: "เมนู" },
    { href: "/restaurant/profile", icon: <User className="h-5 w-5" />, label: "Profile", labelTh: "โปรไฟล์" },
  ]

  const riderNav: NavItem[] = [
    { href: "/rider", icon: <Home className="h-5 w-5" />, label: "Jobs", labelTh: "งาน" },
    { href: "/rider/active", icon: <Bike className="h-5 w-5" />, label: "Active", labelTh: "กำลังส่ง" },
    { href: "/rider/earnings", icon: <ShoppingBag className="h-5 w-5" />, label: "Earnings", labelTh: "รายได้" },
    { href: "/rider/profile", icon: <User className="h-5 w-5" />, label: "Profile", labelTh: "โปรไฟล์" },
  ]

  const navItems = role === "restaurant" ? restaurantNav : role === "rider" ? riderNav : customerNav

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.labelTh}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
