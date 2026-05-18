"use client"

import { CheckCircle2, Circle, Package, Bike, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

type OrderStatusType = "pending" | "confirmed" | "preparing" | "picked_up" | "delivered"

interface OrderStatusProps {
  status: OrderStatusType
  estimatedTime?: string
}

const statusSteps = [
  { key: "confirmed", label: "ยืนยันแล้ว", labelEn: "Confirmed", icon: CheckCircle2 },
  { key: "preparing", label: "กำลังเตรียม", labelEn: "Preparing", icon: Package },
  { key: "picked_up", label: "กำลังจัดส่ง", labelEn: "On the way", icon: Bike },
  { key: "delivered", label: "ส่งแล้ว", labelEn: "Delivered", icon: MapPin },
]

export function OrderStatus({ status, estimatedTime }: OrderStatusProps) {
  const currentIndex = statusSteps.findIndex((step) => step.key === status)

  return (
    <div className="rounded-xl bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">สถานะการจัดส่ง</h3>
        {estimatedTime && (
          <span className="text-sm text-muted-foreground">
            ประมาณ {estimatedTime}
          </span>
        )}
      </div>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
        <div
          className="absolute left-4 top-0 w-0.5 bg-primary transition-all duration-500"
          style={{
            height: `${Math.max(0, (currentIndex / (statusSteps.length - 1)) * 100)}%`,
          }}
        />

        {/* Steps */}
        <div className="space-y-6">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex
            const isCurrent = index === currentIndex
            const Icon = step.icon

            return (
              <div key={step.key} className="relative flex items-center gap-4">
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-medium",
                      isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.labelEn}</p>
                </div>
                {isCurrent && (
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
