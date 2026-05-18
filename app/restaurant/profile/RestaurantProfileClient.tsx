'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Store, MapPin, Phone, Settings, BarChart3, Star, Bell, HelpCircle, ChevronRight, Edit2, LogOut, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { logout } from '@/app/actions/auth'
import { saveRestaurantProfile } from '@/app/actions/restaurant'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

const menuItems = [
  { icon: BarChart3, label: 'ประวัติ & รายได้', labelEn: 'History & Revenue', href: '/restaurant/history' },
  { icon: Star,      label: 'รีวิวจากลูกค้า',  labelEn: 'Customer Reviews',  href: '/restaurant/reviews' },
  { icon: Bell,      label: 'การแจ้งเตือน',    labelEn: 'Notifications',       href: '/restaurant/notifications' },
  { icon: Settings,  label: 'ตั้งค่าร้าน',      labelEn: 'Store Settings',      href: '/restaurant/settings' },
  { icon: HelpCircle,label: 'ช่วยเหลือ',        labelEn: 'Help & Support',      href: '/restaurant/help' },
]

export default function RestaurantProfileClient({ restaurant, totalOrders }: { restaurant: any; totalOrders: number }) {
  const [isOpen, setIsOpen] = useState(restaurant?.is_open ?? true)
  const { toast } = useToast()

  const handleToggleOpen = async (checked: boolean) => {
    setIsOpen(checked)
    const formData = new FormData()
    formData.set('name', restaurant?.name || 'My Restaurant')
    formData.set('address', restaurant?.address || '')
    formData.set('description', restaurant?.description || '')
    formData.set('is_open', String(checked))
    const res = await saveRestaurantProfile(formData)
    if (res?.error) {
      toast({ title: 'เกิดข้อผิดพลาด', description: res.error, variant: 'destructive' })
      setIsOpen(!checked)
    } else {
      toast({ title: checked ? '🟢 เปิดรับออเดอร์แล้ว' : '🔴 ปิดรับออเดอร์แล้ว' })
    }
  }

  const hasRestaurant = !!restaurant

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#ffd709] to-[#e5c108] px-4 pb-8 pt-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-xl font-bold text-[#0e0e0e]">โปรไฟล์ร้าน</h1>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                  {restaurant?.image_url ? (
                    <Image src={restaurant.image_url} alt={restaurant.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground truncate">
                      {hasRestaurant ? restaurant.name : 'ยังไม่ได้ตั้งค่าร้าน'}
                    </h2>
                    <Link href="/restaurant/settings">
                      <Button size="sm" variant="outline">
                        <Edit2 className="mr-1 h-4 w-4" />แก้ไข
                      </Button>
                    </Link>
                  </div>
                  {hasRestaurant ? (
                    <>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className="flex items-center gap-1 bg-amber-100 text-amber-700 border-amber-200">
                          <Star className="h-3 w-3 fill-current" />
                          {restaurant.rating?.toFixed(1) || '0.0'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{restaurant.review_count || 0} รีวิว</span>
                      </div>
                      {restaurant.is_verified ? (
                        <Badge className="mt-1 bg-green-100 text-green-700 border-green-200 text-xs">✓ ผ่านการยืนยันแล้ว</Badge>
                      ) : (
                        <Badge variant="outline" className="mt-1 text-xs text-orange-600 border-orange-200">⏳ รอการยืนยันจาก Admin</Badge>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">ไปที่ตั้งค่าร้านเพื่อเพิ่มข้อมูล</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {/* Store Status Toggle */}
        <Card className="mb-4 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">สถานะร้าน</p>
                  <p className="text-sm text-muted-foreground">
                    {isOpen ? '🟢 เปิดรับออเดอร์อยู่' : '🔴 ปิดรับออเดอร์แล้ว'}
                  </p>
                </div>
              </div>
              <Switch checked={isOpen} onCheckedChange={handleToggleOpen} />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="mb-4 border-border">
          <CardContent className="grid grid-cols-3 divide-x p-0">
            <div className="flex flex-col items-center py-4">
              <span className="text-2xl font-bold text-[#ffd709]">{totalOrders}</span>
              <span className="text-xs text-muted-foreground mt-1">ออเดอร์ทั้งหมด</span>
            </div>
            <div className="flex flex-col items-center py-4">
              <span className="text-2xl font-bold text-[#ffd709]">{restaurant?.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-xs text-muted-foreground mt-1">คะแนนเฉลี่ย</span>
            </div>
            <div className="flex flex-col items-center py-4">
              <span className="text-2xl font-bold text-[#ffd709]">{restaurant?.review_count || 0}</span>
              <span className="text-xs text-muted-foreground mt-1">รีวิว</span>
            </div>
          </CardContent>
        </Card>

        {/* Store Info */}
        {hasRestaurant && (
          <Card className="mb-4 border-border">
            <CardContent className="space-y-4 p-4">
              {restaurant.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">ที่อยู่</p>
                    <p className="font-medium text-sm">{restaurant.address}</p>
                  </div>
                </div>
              )}
              {restaurant.phone_number && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">เบอร์โทร</p>
                    <p className="font-medium text-sm">{restaurant.phone_number}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        <Card className="mb-4 border-border">
          <CardContent className="p-4">
            {menuItems.map((item, index) => (
              <div key={item.href}>
                <Link href={item.href}>
                  <div className="flex items-center justify-between py-3 transition-colors hover:bg-muted/50 rounded-lg px-2">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground"><item.icon className="h-5 w-5" /></div>
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.labelEn}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <form action={logout}>
          <Button type="submit" variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent">
            <LogOut className="mr-2 h-4 w-4" />
            ออกจากระบบ
          </Button>
        </form>
      </main>
    </div>
  )
}
