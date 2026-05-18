'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { updateRiderStatus } from '@/app/actions/rider'
import { useToast } from '@/components/ui/use-toast'

export default function RiderStatusToggle({ initialStatus }: { initialStatus: boolean }) {
  const [isOnline, setIsOnline] = useState(initialStatus)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleToggle(checked: boolean) {
    setIsLoading(true)
    setIsOnline(checked)
    const res = await updateRiderStatus(checked)
    if (res.error) {
      setIsOnline(!checked) // revert
      toast({ title: 'เกิดข้อผิดพลาด', description: res.error, variant: 'destructive' })
    } else {
      toast({ title: checked ? 'คุณออนไลน์แล้ว พร้อมรับงาน!' : 'คุณออฟไลน์แล้ว', duration: 2000 })
    }
    setIsLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-bold ${isOnline ? 'text-white' : 'text-gray-400'}`}>
        {isOnline ? 'พร้อมรับงาน' : 'พักเบรก'}
      </span>
      <Switch 
        checked={isOnline} 
        onCheckedChange={handleToggle} 
        disabled={isLoading}
        className="data-[state=checked]:bg-[#ffd709]"
      />
    </div>
  )
}
