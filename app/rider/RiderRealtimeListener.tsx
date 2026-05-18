'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export default function RiderRealtimeListener() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('rider-orders')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `status=eq.ready`,
        },
        (payload) => {
          toast({
            title: "ออเดอร์ใหม่พร้อมส่ง!",
            description: "มีออเดอร์ใหม่พร้อมให้รับงานแล้ว",
          })
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router, toast])

  return null
}
