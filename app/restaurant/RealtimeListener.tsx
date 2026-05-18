'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export default function RealtimeListener({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!restaurantId) return

    const supabase = createClient()

    const channel = supabase
      .channel('restaurant-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            toast({
              title: "📣 ออเดอร์ใหม่เข้า!",
              description: "มีลูกค้าระบุคำสั่งซื้อใหม่ กรุณาตรวจสอบ",
            })
          }
          
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [restaurantId, router, toast])

  return null
}
