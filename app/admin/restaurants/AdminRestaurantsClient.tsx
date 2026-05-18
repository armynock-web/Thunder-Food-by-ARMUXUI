'use client'

import { useState } from 'react'
import { verifyRestaurant } from '@/app/actions/admin'
import { useToast } from '@/components/ui/use-toast'

export default function AdminRestaurantsClient({ initialRestaurants }: { initialRestaurants: any[] }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleVerify = async (id: string) => {
    setLoadingId(id)
    const res = await verifyRestaurant(id)
    if (res.error) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' })
    } else {
      toast({ title: 'อนุมัติร้านค้าสำเร็จ', description: 'ร้านค้าสามารถเริ่มต้นขายได้แล้ว' })
      setRestaurants(prev => prev.filter(r => r.id !== id))
    }
    setLoadingId(null)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-thai">ร้านค้าที่รอการอนุมัติ</h2>
      
      {restaurants.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
          <p className="text-gray-500 font-thai">ไม่มีร้านค้าที่รอการอนุมัติในขณะนี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((rest) => (
            <div key={rest.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                  {rest.image_url ? (
                    <img src={rest.image_url} alt={rest.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined">restaurant</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{rest.name}</h3>
                  <p className="text-sm text-gray-500">{rest.users?.full_name} ({rest.users?.phone || '-'})</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                <strong>ที่อยู่:</strong> {rest.address || 'ไม่ได้ระบุ'}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  onClick={() => handleVerify(rest.id)}
                  disabled={loadingId === rest.id}
                  className="bg-black text-white px-6 py-2 rounded-lg font-bold font-thai hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loadingId === rest.id ? 'กำลังดำเนินการ...' : 'อนุมัติร้านค้า'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
