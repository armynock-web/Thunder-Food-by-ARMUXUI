'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export default function OrderRealtimeListener({ orderId }: { orderId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!orderId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newStatus = payload.new.status
          toast({
            title: "อัปเดตสถานะ!",
            description: `สถานะออเดอร์ของคุณเปลี่ยนเป็น: ${newStatus}`,
          })
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, router, toast])

  return null
}
