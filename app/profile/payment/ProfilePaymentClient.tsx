'use client'

import { useState } from 'react'
import { CreditCard, Wallet, QrCode, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { setDefaultPaymentMethod } from '@/app/actions/customer'
import { useToast } from '@/components/ui/use-toast'

export default function ProfilePaymentClient({ initialMethods }: { initialMethods: any[] }) {
  const [methods, setMethods] = useState([
    { id: "promptpay", label: "พร้อมเพย์ / QR Code", icon: <QrCode className="h-6 w-6 text-blue-500" /> },
    { id: "cod", label: "เงินสด (COD)", icon: <Wallet className="h-6 w-6 text-green-500" /> },
    { id: "card", label: "บัตรเครดิต / เดบิต", icon: <CreditCard className="h-6 w-6 text-gray-700" /> },
  ])
  
  const { toast } = useToast()
  
  // Find default provider
  const defaultProvider = initialMethods.find(m => m.is_default)?.provider || 'promptpay'
  const [activeProvider, setActiveProvider] = useState(defaultProvider)
  const [loading, setLoading] = useState(false)

  const handleSelect = async (provider: string) => {
    setActiveProvider(provider)
    setLoading(true)
    const res = await setDefaultPaymentMethod(provider)
    if (res.error) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' })
    } else {
      toast({ title: 'อัปเดตวิธีชำระเงินสำเร็จ' })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {methods.map((method) => {
        const isActive = activeProvider === method.id
        return (
          <Card 
            key={method.id} 
            onClick={() => !loading && handleSelect(method.id)}
            className={`border-2 shadow-sm rounded-2xl overflow-hidden cursor-pointer transition-colors ${isActive ? 'border-[#ffd709] bg-yellow-50/30' : 'border-transparent bg-white'} ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  {method.icon}
                </div>
                <span className="font-bold text-gray-900">{method.label}</span>
              </div>
              {isActive && (
                <div className="w-6 h-6 rounded-full bg-[#ffd709] flex items-center justify-center text-gray-900">
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
      
      <Button variant="outline" className="w-full mt-6 bg-white border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 py-6 rounded-xl font-bold text-base shadow-sm">
        <Plus className="mr-2 h-5 w-5" />
        เพิ่มบัตรเครดิต / เดบิต
      </Button>
    </div>
  )
}
