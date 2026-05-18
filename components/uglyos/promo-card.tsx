"use client"

import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PromoCardProps {
  title: string
  titleTh: string
  description: string
  code?: string
  backgroundColor?: string
  textColor?: string
  onClick?: () => void
}

export function PromoCard({
  title,
  titleTh,
  description,
  code,
  backgroundColor = "bg-gradient-to-r from-primary to-accent",
  textColor = "text-primary-foreground",
  onClick,
}: PromoCardProps) {
  return (
    <Card className={`overflow-hidden ${backgroundColor}`}>
      <CardContent className={`p-4 ${textColor}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">{titleTh}</h3>
            <p className="text-sm opacity-90">{title}</p>
            <p className="text-sm opacity-80">{description}</p>
            {code && (
              <div className="mt-2 inline-block rounded-full bg-background/20 px-3 py-1">
                <span className="font-mono font-semibold">Code: {code}</span>
              </div>
            )}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 shrink-0 rounded-full"
            onClick={onClick}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
