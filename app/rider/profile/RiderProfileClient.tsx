'use client'

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import {
  User,
  Bike,
  CreditCard,
  Star,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit2,
  Shield,
  FileText,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BottomNav } from "@/components/uglyos/bottom-nav"

const menuItems = [
  { icon: <CreditCard className="h-5 w-5" />, label: "บัญชีธนาคาร", labelEn: "Bank Account", href: "/rider/bank" },
  { icon: <Bike className="h-5 w-5" />, label: "ข้อมูลยานพาหนะ", labelEn: "Vehicle Info", href: "/rider/vehicle" },
  { icon: <FileText className="h-5 w-5" />, label: "เอกสาร", labelEn: "Documents", href: "/rider/documents" },
  { icon: <Star className="h-5 w-5" />, label: "คะแนนและรีวิว", labelEn: "Ratings & Reviews", href: "/rider/ratings" },
  { icon: <Bell className="h-5 w-5" />, label: "การแจ้งเตือน", labelEn: "Notifications", href: "/rider/notifications" },
  { icon: <Shield className="h-5 w-5" />, label: "ความปลอดภัย", labelEn: "Safety", href: "/rider/safety" },
  { icon: <Settings className="h-5 w-5" />, label: "ตั้งค่า", labelEn: "Settings", href: "/rider/settings" },
  { icon: <HelpCircle className="h-5 w-5" />, label: "ช่วยเหลือ", labelEn: "Help & Support", href: "/rider/help" },
]

function MenuItem({ icon, label, labelEn, href }: any) {
  return (
    <Link href={href}>
      <div className="flex items-center justify-between py-3 transition-colors hover:bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">{icon}</div>
          <div>
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{labelEn}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Link>
  )
}

export default function RiderProfileClient({ profile }: { profile: any }) {
  const router = useRouter()
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const memberSince = new Date(profile.users?.created_at).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-background pb-24 font-thai">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-accent px-4 pb-6 pt-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-xl font-bold text-primary-foreground">โปรไฟล์ไรเดอร์</h1>
          
          {/* Profile Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                  {profile.users?.avatar_url ? (
                    <img src={profile.users.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-3xl">person</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground">{profile.users?.full_name || 'ไม่ระบุชื่อ'}</h2>
                    <Link href="/profile/settings">
                      <Button size="sm" variant="outline" className="active:scale-95 duration-200">
                        <Edit2 className="mr-1 h-4 w-4" />
                        แก้ไข
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-xs text-[#ffd709]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#ffd709] bg-[#ffd709]/10 px-2 py-0.5 rounded-full border border-[#ffd709]/20 inline-block">RIDER</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">phone</span>
                    {profile.users?.phone || 'ยังไม่ระบุเบอร์โทรศัพท์'}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      4.9
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      สมาชิกตั้งแต่ {memberSince}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {/* Stats */}
        <Card className="mb-4">
          <CardContent className="grid grid-cols-3 divide-x p-0">
            <div className="flex flex-col items-center py-4">
              <span className="text-2xl font-bold text-primary">856</span>
              <span className="text-xs text-muted-foreground">เที่ยวทั้งหมด</span>
            </div>
            <div className="flex flex-col items-center py-4">
              <span className="text-2xl font-bold text-primary">4.9</span>
              <span className="text-xs text-muted-foreground">คะแนน</span>
            </div>
            <div className="flex flex-col items-center py-4">
              <span className="text-2xl font-bold text-primary">99%</span>
              <span className="text-xs text-muted-foreground">อัตราสำเร็จ</span>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        <Link href="/rider/vehicle">
          <Card className="mb-4 hover:bg-muted/30 cursor-pointer transition-all active:scale-[0.99] duration-200 border border-transparent hover:border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bike className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{profile.vehicle_info || 'รถจักรยานยนต์'}</p>
                  <p className="text-sm text-muted-foreground">{profile.license_plate || 'ยังไม่ระบุป้ายทะเบียน'}</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  แก้ไขข้อมูล
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Bank Account */}
        <Link href="/rider/bank">
          <Card className="mb-4 hover:bg-muted/30 cursor-pointer transition-all active:scale-[0.99] duration-200 border border-transparent hover:border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">บัญชีสำหรับถอนเงิน</p>
                  <p className="text-sm text-muted-foreground">***5678 (กสิกรไทย)</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  ดูบัญชี
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Menu Items */}
        <Card className="mb-4">
          <CardContent className="p-4">
            {menuItems.map((item, index) => (
              <div key={item.href}>
                <MenuItem {...item} />
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button onClick={handleLogout} variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent rounded-xl py-6 font-bold">
          <LogOut className="mr-2 h-5 w-5" />
          ออกจากระบบ
        </Button>
      </main>

      <BottomNav role="rider" />
    </div>
  )
}
