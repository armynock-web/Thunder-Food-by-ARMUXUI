"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const orderTabs = [
  { id: "active", label: "กำลังดำเนินการ" },
  { id: "completed", label: "สำเร็จ" },
];

const statusConfig = {
  pending: {
    text: "รอร้านยืนยัน",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  preparing: {
    text: "กำลังเตรียมอาหาร",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  ready: {
    text: "รอไรเดอร์มารับ",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  picking_up: {
    text: "ไรเดอร์กำลังรับอาหาร",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  delivering: {
    text: "กำลังจัดส่ง",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  completed: {
    text: "สำเร็จ",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  cancelled: {
    text: "ยกเลิกแล้ว",
    icon: CheckCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
};

export default function OrderList({ initialOrders }: { initialOrders: any[] }) {
  const [activeTab, setActiveTab] = useState("active");

  const filteredOrders = initialOrders.filter((order) =>
    activeTab === "active"
      ? order.status !== "completed" && order.status !== "cancelled"
      : order.status === "completed" || order.status === "cancelled"
  );

  return (
    <>
      {/* Tabs */}
      <div className="sticky top-[60px] z-30 bg-background border-b border-border">
        <div className="max-w-md mx-auto px-4">
          <div className="flex gap-1 py-2">
            {orderTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-[#ffd709] text-[#1c1c1e]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = statusInfo.icon;
            
            // Format date
            const dateObj = new Date(order.created_at);
            const dateStr = dateObj.toLocaleDateString('th-TH', { 
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            });

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-card rounded-2xl border border-border p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    {order.restaurants?.image_url ? (
                      <Image
                        src={order.restaurants.image_url}
                        alt={order.restaurants.name || "Restaurant"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold truncate">{order.restaurants?.name || "ไม่ทราบชื่อร้าน"}</h3>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0",
                          statusInfo.bgColor,
                          statusInfo.color
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.text}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {order.order_items?.map((item: any) => `${item.menu_items?.name} x${item.quantity}`).join(", ")}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{dateStr}</span>
                      <span className="font-semibold">฿{Number(order.total_amount).toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {order.users && order.status !== "pending" && order.status !== "preparing" && order.status !== "ready" && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm line-clamp-1">ไรเดอร์: {order.users.full_name}</span>
                    </div>
                  </div>
                )}

                {order.status === "completed" && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 bg-transparent"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      สั่งอีกครั้ง
                    </Button>
                  </div>
                )}
              </Link>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">ไม่มีคำสั่งซื้อ</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {activeTab === "active"
                ? "คุณยังไม่มีคำสั่งซื้อที่กำลังดำเนินการ"
                : "คุณยังไม่มีประวัติการสั่งซื้อ"}
            </p>
            <Button asChild className="bg-[#ffd709] text-[#1c1c1e] hover:bg-[#e5c108]">
              <Link href="/customer">เริ่มสั่งอาหาร</Link>
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
