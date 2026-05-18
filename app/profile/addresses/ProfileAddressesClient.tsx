'use client'

import { useState } from "react"
import { MapPin, Plus, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { addUserAddress, deleteUserAddress } from "@/app/actions/customer"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function ProfileAddressesClient({ initialAddresses }: { initialAddresses: any[] }) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleAdd = async () => {
    if (!newTitle || !newAddress) {
      toast({ title: 'Error', description: 'กรุณากรอกข้อมูลให้ครบถ้วน', variant: 'destructive' })
      return
    }
    
    setLoading(true)
    const res = await addUserAddress(newTitle, newAddress)
    if (res.error) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' })
    } else {
      toast({ title: 'เพิ่มที่อยู่สำเร็จ' })
      setIsAdding(false)
      setNewTitle("")
      setNewAddress("")
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm("คุณต้องการลบที่อยู่นี้ใช่หรือไม่?")) return
    setLoading(true)
    const res = await deleteUserAddress(addressId)
    if (res.error) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' })
    } else {
      toast({ title: 'ลบที่อยู่สำเร็จ' })
      setAddresses(prev => prev.filter(a => a.id !== addressId))
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <Card key={addr.id} className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-yellow-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{addr.title}</span>
                  {addr.is_default && (
                    <span className="bg-[#ffd709] text-xs font-bold px-2 py-0.5 rounded-full text-gray-900">
                      ค่าเริ่มต้น
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{addr.address}</p>
                
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    disabled={loading}
                    className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" /> ลบ
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {addresses.length === 0 && !isAdding && (
        <div className="text-center p-6 text-gray-500 font-thai bg-white rounded-2xl">
          ยังไม่มีที่อยู่จัดส่ง
        </div>
      )}

      {isAdding && (
        <Card className="border border-yellow-200 shadow-sm rounded-2xl overflow-hidden bg-yellow-50/50">
          <CardContent className="p-4 space-y-3 font-thai">
            <h3 className="font-bold">เพิ่มที่อยู่ใหม่</h3>
            <input 
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="ป้ายกำกับ (เช่น บ้าน, ที่ทำงาน)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea 
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="ที่อยู่จัดส่งแบบเต็ม"
              rows={3}
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => setIsAdding(false)}
              >
                ยกเลิก
              </Button>
              <Button 
                className="flex-1 rounded-xl bg-black text-white hover:bg-gray-800"
                onClick={handleAdd}
                disabled={loading}
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกที่อยู่'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isAdding && (
        <Button 
          onClick={() => setIsAdding(true)}
          className="w-full mt-6 bg-[#ffd709] text-gray-900 hover:bg-yellow-500 py-6 rounded-xl font-bold text-lg shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5" />
          เพิ่มที่อยู่ใหม่
        </Button>
      )}
    </div>
  )
}
