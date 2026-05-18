'use client'

import { useState } from 'react'
import { Heart, Store } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { toggleFavorite } from '@/app/actions/customer'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

export default function ProfileFavoritesClient({ initialFavorites }: { initialFavorites: any[] }) {
  const [favorites, setFavorites] = useState(initialFavorites)
  const { toast } = useToast()

  const handleToggle = async (restaurantId: string) => {
    const res = await toggleFavorite(restaurantId, true) // isFavorite is true, so it removes it
    if (res.error) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' })
    } else {
      setFavorites(prev => prev.filter(f => f.restaurant_id !== restaurantId))
      toast({ title: 'ลบออกจากร้านโปรดแล้ว' })
    }
  }

  return (
    <div className="space-y-4">
      {favorites.length === 0 ? (
        <div className="text-center p-6 text-gray-500 font-thai bg-white rounded-2xl shadow-sm">
          คุณยังไม่มีร้านโปรดเลย ไปเลือกร้านอร่อยกันเถอะ!
        </div>
      ) : (
        favorites.map((fav) => (
          <Card key={fav.id} className="border-0 shadow-sm rounded-2xl overflow-hidden relative">
            <CardContent className="p-4 flex gap-4 items-center">
              <Link href={`/customer/restaurant/${fav.restaurant_id}`} className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {fav.restaurants?.image_url ? (
                  <img src={fav.restaurants.image_url} alt={fav.restaurants.name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="text-gray-400 h-8 w-8" />
                )}
              </Link>
              <div className="flex-1">
                <Link href={`/customer/restaurant/${fav.restaurant_id}`}>
                  <h3 className="font-bold text-gray-900 text-base">{fav.restaurants?.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{fav.restaurants?.description || 'อาหารอร่อยๆ'}</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-bold text-gray-700">
                  <span className="material-symbols-outlined text-yellow-500 text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  {fav.restaurants?.rating || 4.5}
                </div>
              </div>
              <button 
                onClick={() => handleToggle(fav.restaurant_id)}
                className="bg-red-50 p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors"
              >
                <Heart className="h-5 w-5 fill-current" />
              </button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
