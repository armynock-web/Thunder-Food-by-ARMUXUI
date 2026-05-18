'use client'

import { useState } from 'react'
import { saveRestaurantProfile } from '@/app/actions/restaurant'
import { useToast } from '@/components/ui/use-toast'
import { Switch } from '@/components/ui/switch'

type ProfileProps = {
  initialProfile: any
}

export default function RestaurantSettingsForm({ initialProfile }: ProfileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(initialProfile?.is_open ?? true)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('is_open', isOpen.toString())

    const result = await saveRestaurantProfile(formData)

    if (result.error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'สำเร็จ',
        description: result.message,
      })
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Name */}
        <div className="group">
          <label className="block font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] px-1 mb-2">ชื่อร้านค้า (Restaurant Name) *</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#afadac] group-focus-within:text-[#6c5a00] transition-colors">storefront</span>
            <input 
              name="name"
              type="text" 
              required
              defaultValue={initialProfile?.name || ''}
              className="w-full bg-[#f3f0ef] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ffd709] transition-all placeholder:text-[#afadac] text-[#2f2f2e]" 
              placeholder="ร้านส้มตำแซ่บเวอร์" 
            />
          </div>
        </div>

        {/* Description */}
        <div className="group">
          <label className="block font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] px-1 mb-2">คำอธิบายร้าน (Description)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-4 text-[#afadac] group-focus-within:text-[#6c5a00] transition-colors">description</span>
            <textarea 
              name="description"
              rows={3}
              defaultValue={initialProfile?.description || ''}
              className="w-full bg-[#f3f0ef] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ffd709] transition-all placeholder:text-[#afadac] text-[#2f2f2e] resize-none" 
              placeholder="อธิบายจุดเด่นของร้านคุณ..." 
            />
          </div>
        </div>

        {/* Address */}
        <div className="group">
          <label className="block font-label text-xs font-bold uppercase tracking-widest text-[#5c5b5b] px-1 mb-2">ที่อยู่ (Address) *</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-4 text-[#afadac] group-focus-within:text-[#6c5a00] transition-colors">location_on</span>
            <textarea 
              name="address"
              required
              rows={2}
              defaultValue={initialProfile?.address || ''}
              className="w-full bg-[#f3f0ef] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ffd709] transition-all placeholder:text-[#afadac] text-[#2f2f2e] resize-none" 
              placeholder="123/45 ถนน... แขวง... เขต..." 
            />
          </div>
        </div>

        {/* Store Status Toggle */}
        <div className="flex items-center justify-between bg-[#f3f0ef] p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-[#ffd709] text-[#5b4b00]' : 'bg-[#e4e2e1] text-[#5c5b5b]'}`}>
              <span className="material-symbols-outlined">{isOpen ? 'store' : 'store_off'}</span>
            </div>
            <div>
              <p className="font-thai font-bold text-sm text-[#2f2f2e]">สถานะร้านค้า</p>
              <p className="font-thai text-xs text-[#5c5b5b] mt-0.5">{isOpen ? 'เปิดรับออเดอร์ปกติ' : 'ปิดรับออเดอร์ชั่วคราว'}</p>
            </div>
          </div>
          <Switch 
            checked={isOpen} 
            onCheckedChange={setIsOpen} 
            className="data-[state=checked]:bg-[#ffd709]"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#ffd709] hover:bg-[#5e4e00] hover:text-[#fff2cd] text-[#453900] font-bold py-5 rounded-2xl shadow-[0_12px_24px_-8px_rgba(255,215,9,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          <span>{isLoading ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูลร้านค้า'}</span>
          {!isLoading && <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">save</span>}
        </button>
      </div>
    </form>
  )
}
