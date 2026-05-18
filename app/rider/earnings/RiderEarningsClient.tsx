"use client"

import { useState } from "react"
import {
  Wallet,
  TrendingUp,
  Calendar,
  ChevronRight,
  Bike,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNav } from "@/components/uglyos/bottom-nav"

function EarningItem({ entry }: { entry: any }) {
  const formatPrice = (p: number) => {
    const sign = p >= 0 ? "+" : ""
    return sign + new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(Math.abs(p))
  }

  const isPositive = entry.amount >= 0

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className={`rounded-full p-2 ${
          entry.type === "delivery" ? "bg-primary/10 text-primary" :
          entry.type === "bonus" ? "bg-secondary/20 text-secondary-foreground" :
          "bg-muted text-muted-foreground"
        }`}>
          {entry.type === "delivery" && <Bike className="h-4 w-4" />}
          {entry.type === "bonus" && <TrendingUp className="h-4 w-4" />}
          {entry.type === "withdrawal" && <Wallet className="h-4 w-4" />}
        </div>
        <div>
          <p className="font-medium text-foreground">{entry.description}</p>
          <p className="text-xs text-muted-foreground">
            {entry.date} {entry.time}
            {entry.orderNumber && ` • ${entry.orderNumber}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className={`font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {formatPrice(entry.amount)}
        </span>
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-green-600" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-600" />
        )}
      </div>
    </div>
  )
}

export default function RiderEarningsClient({ earnings }: { earnings: any[] }) {
  const [activeTab, setActiveTab] = useState("today")

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(p)
  }

  // Process data from DB
  const mappedEarnings = earnings.map(order => ({
    id: order.id,
    type: "delivery",
    orderNumber: `ORD-${order.id.substring(0, 6).toUpperCase()}`,
    description: `${order.restaurants?.name} → ${order.users?.full_name}`,
    amount: order.delivery_fee,
    date: new Date(order.created_at).toLocaleDateString("th-TH"),
    time: new Date(order.created_at).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' }),
    rawDate: new Date(order.created_at)
  }))

  const todayStr = new Date().toLocaleDateString("th-TH")
  const todayEarnings = mappedEarnings
    .filter(e => e.date === todayStr)
    .reduce((sum, e) => sum + e.amount, 0)

  const totalEarnings = mappedEarnings.reduce((sum, e) => sum + e.amount, 0)
  const trips = mappedEarnings.length
  const avgPerTrip = trips > 0 ? totalEarnings / trips : 0

  const availableBalance = totalEarnings // Simplified

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-accent px-4 pb-6 pt-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-xl font-bold text-primary-foreground">รายได้ของฉัน</h1>
          
          {/* Balance Card */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ยอดเงินที่ถอนได้</p>
                  <p className="text-3xl font-bold text-foreground">{formatPrice(availableBalance)}</p>
                </div>
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                ถอนเงิน
              </Button>
            </CardContent>
          </Card>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {/* Weekly Stats */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                สรุปสถิติทั้งหมด
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-xl font-bold text-primary">{formatPrice(totalEarnings)}</p>
                <p className="text-xs text-muted-foreground">รายได้รวม</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{trips}</p>
                <p className="text-xs text-muted-foreground">เที่ยว</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{formatPrice(avgPerTrip)}</p>
                <p className="text-xs text-muted-foreground">เฉลี่ย/เที่ยว</p>
              </div>
              <div>
                <p className="text-xl font-bold text-secondary">{formatPrice(0)}</p>
                <p className="text-xs text-muted-foreground">โบนัส</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">ประวัติรายได้</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid w-full grid-cols-3">
                <TabsTrigger value="today">
                  วันนี้
                  <Badge className="ml-1 bg-primary text-primary-foreground">
                    {formatPrice(todayEarnings)}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="week">สัปดาห์นี้</TabsTrigger>
                <TabsTrigger value="month">เดือนนี้</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="divide-y">
                  {mappedEarnings.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground text-sm">ยังไม่มีประวัติรายได้</p>
                  ) : (
                    mappedEarnings
                      .filter(e => {
                        if (activeTab === "today") return e.date === todayStr
                        // Add proper week/month filters later
                        return true
                      })
                      .map((entry) => (
                        <EarningItem key={entry.id} entry={entry} />
                      ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <BottomNav role="rider" />
    </div>
  )
}
