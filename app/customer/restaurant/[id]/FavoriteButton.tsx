'use client'

import { useState } from 'react'
import { toggleFavorite } from '@/app/actions/customer'
import { useToast } from '@/components/ui/use-toast'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  restaurantId: string
  initialIsFavorite: boolean
}

export default function FavoriteButton({ restaurantId, initialIsFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleToggle = async () => {
    if (isLoading) return
    setIsLoading(true)
    
    // Call server action to toggle favorite status
    const res = await toggleFavorite(restaurantId, isFavorite)
    
    if (res.error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: res.error,
        variant: 'destructive',
      })
    } else {
      const nextState = !isFavorite
      setIsFavorite(nextState)
      toast({
        title: nextState ? 'บันทึกร้านโปรดสำเร็จ!' : 'ลบออกจากร้านโปรดแล้ว',
        description: nextState ? 'ร้านนี้ถูกเพิ่มในลิสต์ร้านโปรดของคุณแล้ว' : 'ร้านนี้ถูกลบออกจากลิสต์ร้านโปรดแล้ว',
        duration: 2000
      })
    }
    setIsLoading(false)
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 duration-200 ${
        isFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-white text-gray-800 hover:bg-gray-100'
      }`}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  )
}
