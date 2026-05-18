"use client"

import React from "react"

import { cn } from "@/lib/utils"

interface CategoryPillProps {
  icon: React.ReactNode
  label: string
  labelTh: string
  isActive?: boolean
  onClick?: () => void
}

export function CategoryPill({
  icon,
  label,
  labelTh,
  isActive = false,
  onClick,
}: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl px-4 py-3 transition-all",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg"
          : "bg-card text-muted-foreground hover:bg-muted"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          isActive ? "bg-primary-foreground/20" : "bg-muted"
        )}
      >
        {icon}
      </div>
      <span className="text-xs font-medium">{labelTh}</span>
    </button>
  )
}
