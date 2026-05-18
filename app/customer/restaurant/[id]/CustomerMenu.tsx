'use client'

import { useState } from 'react'
import { useNotification } from '@/components/thunder/notification-popup'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/thunder/cart-context'
import { X, Plus, Minus, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export default function CustomerMenu({ restaurantId, restaurantName, items, categories }: { restaurantId: string, restaurantName: string, items: any[], categories: string[] }) {
  const { showNotification } = useNotification()
  const router = useRouter()
  
  // Use global cart
  const { items: cartItems, addItem, totalItems, totalPrice } = useCart()
  
  const [activeCategory, setActiveCategory] = useState<string>('ทั้งหมด')

  // Customization Modal states
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  
  // 1. Toppings
  const [egg, setEgg] = useState(false)
  const [omelet, setOmelet] = useState(false)
  const [extraMeat, setExtraMeat] = useState(false)
  const [extraRice, setExtraRice] = useState(false)
  
  // 2. Preferences
  const [noVeg, setNoVeg] = useState(false)
  const [noGarlic, setNoGarlic] = useState(false)
  const [utensils, setUtensils] = useState(false)
  const [extra, setExtra] = useState(false) // Direct extra option
  
  // 3. Spicy level
  const [spicyLevel, setSpicyLevel] = useState("normal")
  
  // 4. Special request
  const [specialRequest, setSpecialRequest] = useState("")
  
  const [quantity, setQuantity] = useState(1)

  const handleOpenCustomization = (item: any) => {
    setSelectedItem(item)
    setEgg(false)
    setOmelet(false)
    setExtraMeat(false)
    setExtraRice(false)
    setNoVeg(false)
    setNoGarlic(false)
    setUtensils(false)
    setExtra(false)
    setSpicyLevel("normal")
    setSpecialRequest("")
    setQuantity(1)
  }

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(p)
  }

  const toppingPrice = 
    (egg ? 10 : 0) +
    (omelet ? 15 : 0) +
    (extraMeat ? 20 : 0) +
    (extraRice ? 10 : 0) +
    (extra ? 15 : 0)

  const singleItemPrice = (selectedItem?.price || 0) + toppingPrice
  const totalPriceForCustom = singleItemPrice * quantity

  const getOptionsLabel = () => {
    const opts = []
    
    // Spicy level label
    if (spicyLevel === "none") opts.push("ไม่เผ็ด")
    if (spicyLevel === "mild") opts.push("เผ็ดน้อย")
    if (spicyLevel === "spicy") opts.push("เผ็ดมาก")
    
    // Toppings
    if (egg) opts.push("ไข่ดาว")
    if (omelet) opts.push("ไข่เจียว")
    if (extraMeat) opts.push("เพิ่มเนื้อ")
    if (extraRice) opts.push("เพิ่มข้าว")
    if (extra) opts.push("พิเศษ")
    
    // Preferences
    if (noVeg) opts.push("ไม่ใส่ผัก")
    if (noGarlic) opts.push("ไม่ใส่กระเทียม")
    if (utensils) opts.push("รับช้อนส้อม")
    
    // Special request snippet
    if (specialRequest.trim()) {
      opts.push(`คำขอ: ${specialRequest.trim()}`)
    }
    
    return opts.length > 0 ? `(${opts.join(", ")})` : ""
  }

  const handleConfirmAdd = () => {
    if (!selectedItem) return

    const optionsLabel = getOptionsLabel()
    const finalName = optionsLabel ? `${selectedItem.name} ${optionsLabel}` : selectedItem.name
    // Generate a unique ID so different options of the same dish are stored as separate items
    const finalId = optionsLabel ? `${selectedItem.id}-${optionsLabel.replace(/\s+/g, '')}` : selectedItem.id

    // Add selected quantity of items
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: finalId,
        name: finalName,
        price: singleItemPrice,
        image: selectedItem.image_url,
        restaurantId: restaurantId,
        restaurantName: restaurantName
      })
    }

    showNotification({ type: 'cart', title: 'เพิ่มลงตะกร้าสำเร็จ! 🛍️', message: `${finalName} จำนวน ${quantity} จาน` })
    setSelectedItem(null) // Close modal
  }

  const handleGoToCheckout = () => {
    router.push('/checkout')
  }

  const allCategories = ['ทั้งหมด', ...categories]
  
  const filteredItems = activeCategory === 'ทั้งหมด' 
    ? items 
    : items.filter(item => item.menu_categories?.name === activeCategory)

  return (
    <div className="relative font-thai">
      
      {/* Category Pills - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-4 pt-2 hide-scrollbar snap-x">
        {allCategories.map((cat, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold snap-start transition-all border ${
              activeCategory === cat 
                ? 'bg-[#ffd709] border-[#ffd709] text-gray-900 shadow-sm font-thai' 
                : 'bg-white border-gray-200 text-gray-600 font-thai'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items List (Aligned with Home Page style - 2 columns per row) */}
      <div className="grid grid-cols-2 gap-3 pb-24 mt-2">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => handleOpenCustomization(item)}
            className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all cursor-pointer active:scale-[0.99] transition-transform duration-200"
          >
            
            {/* Image (Top) */}
            <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden relative">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400 text-3xl">fastfood</span>
                </div>
              )}
              {/* Popular Tag */}
              {(item.name === 'ส้มตำไทย' || item.name === 'ส้มตำปูปลาร้า' || item.is_popular) && (
                <div className="absolute top-0 left-0 bg-[#ffd709] text-[10px] font-bold px-2 py-0.5 rounded-br-xl text-gray-900 z-10 font-thai">
                  ยอดนิยม
                </div>
              )}
            </div>

            {/* Details (Bottom) */}
            <div className="p-3 flex-grow flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-sm line-clamp-1 font-thai">{item.name}</h4>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 font-thai">{item.menu_categories?.name || 'อาหาร'}</p>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-tight min-h-[2rem] font-thai">{item.description || 'อร่อย สะอาด ถูกสุขอนามัย'}</p>
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="font-black text-gray-900 text-base">฿{item.price}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenCustomization(item)
                  }}
                  className="bg-[#ffd709] hover:bg-yellow-500 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Floating Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 bg-[#0e0e0e] text-white p-4 rounded-[1.5rem] shadow-2xl flex items-center justify-between z-40 animate-in slide-in-from-bottom-10 duration-300 font-thai">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400 font-medium">{totalItems} รายการ</span>
            <span className="font-black text-xl text-[#ffd709]">฿{totalPrice}</span>
          </div>
          <button 
            onClick={handleGoToCheckout}
            className="bg-[#ffd709] text-[#0e0e0e] font-black px-6 py-3 rounded-xl active:scale-95 transition-transform font-thai"
          >
            ดูตะกร้า
          </button>
        </div>
      )}

      {/* Customizable Premium Pop-up Modal Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200 font-thai">
          {/* Backdrop Click Closes Modal */}
          <div className="absolute inset-0 cursor-default" onClick={() => setSelectedItem(null)} />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[85vh] animate-in slide-in-from-bottom-full duration-300 z-10 border border-gray-100">
            
            {/* Draggable Drag handle design */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 shrink-0" />

            {/* Scrollable Form Content */}
            <div className="overflow-y-auto px-6 pb-32 space-y-6">
              
              {/* Header Info */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <Badge className="bg-yellow-50 hover:bg-yellow-50 text-yellow-700 border-yellow-100 rounded-md font-bold mb-1.5 text-xs font-thai">
                    {selectedItem.menu_categories?.name || 'อาหาร'}
                  </Badge>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight font-thai">{selectedItem.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Large Image Showcase */}
              <div className="w-full aspect-[16/10] rounded-[1.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                {selectedItem.image_url ? (
                  <img src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-300 text-6xl">fastfood</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedItem.description && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-thai">คำอธิบายเมนู</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed font-thai">{selectedItem.description}</p>
                </div>
              )}

              <Separator className="bg-gray-100" />

              {/* Required Group 1: Spicy Level (Radio style - บังคับเลือก 1 ข้อ) */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-800 font-thai">ระดับความเผ็ด</span>
                    <span className="text-[10px] text-gray-400 font-bold tracking-wider font-thai">เลือกได้ 1 ตัวเลือก</span>
                  </div>
                  <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-100 font-thai">จำเป็น</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                  {[
                    { id: "none", label: "ไม่เผ็ดเลย", sub: "ไม่ใส่พริก" },
                    { id: "mild", label: "เผ็ดน้อย", sub: "พริกประมาณ 1-2 เม็ด" },
                    { id: "normal", label: "เผ็ดปกติ", sub: "สูตรดั้งเดิมของร้าน" },
                    { id: "spicy", label: "เผ็ดจัดจ้าน", sub: "สำหรับคนชอบรสจัด" }
                  ].map(level => {
                    const isSelected = spicyLevel === level.id
                    return (
                      <div 
                        key={level.id}
                        onClick={() => setSpicyLevel(level.id)}
                        className="flex items-center justify-between p-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800 font-thai">{level.label}</span>
                          <span className="text-xs text-gray-400 font-thai">{level.sub}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#ffd709]' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#ffd709]" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Optional Group 2: Toppings (Checkbox style - เลือกเพิ่มเติม) */}
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-800 font-thai">เครื่องเคียง / ท็อปปิ้ง</span>
                  <span className="text-[10px] text-gray-400 font-bold tracking-wider font-thai">เลือกเพิ่มได้ตามใจชอบ</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                  {[
                    { id: "egg", label: "ไข่ดาวกรอบ", price: 10, state: egg, setter: setEgg },
                    { id: "omelet", label: "ไข่เจียวฟู", price: 15, state: omelet, setter: setOmelet },
                    { id: "extraMeat", label: "เพิ่มเนื้อสัตว์", price: 20, state: extraMeat, setter: setExtraMeat },
                    { id: "extraRice", label: "เพิ่มข้าวสวย / เพิ่มเส้น", price: 10, state: extraRice, setter: setExtraRice }
                  ].map(topping => {
                    return (
                      <div 
                        key={topping.id}
                        onClick={() => topping.setter(!topping.state)}
                        className="flex items-center justify-between p-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800 font-thai">{topping.label}</span>
                          <span className="text-xs text-[#ffd709] font-black font-thai">+฿{topping.price}</span>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          topping.state ? 'border-[#ffd709] bg-[#ffd709]' : 'border-gray-300'
                        }`}>
                          {topping.state && <Check className="w-3.5 h-3.5 text-gray-900 stroke-[3px]" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Optional Group 3: Specific Preferences (Checkbox style) */}
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-800 font-thai">ความต้องการพิเศษ</span>
                  <span className="text-[10px] text-gray-400 font-bold tracking-wider font-thai">ติ๊กเพื่อเลือก</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                  {[
                    { label: "🥬 ไม่ใส่ผัก", state: noVeg, setter: setNoVeg },
                    { label: "🧄 ไม่ใส่กระเทียม", state: noGarlic, setter: setNoGarlic },
                    { label: "✨ สั่งพิเศษ (+฿15)", state: extra, setter: setExtra },
                    { label: "🍴 รับช้อนส้อมพลาสติก", state: utensils, setter: setUtensils }
                  ].map((preference, idx) => {
                    return (
                      <div 
                        key={idx}
                        onClick={() => preference.setter(!preference.state)}
                        className="flex items-center justify-between p-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <span className="text-sm font-bold text-gray-800 font-thai">{preference.label}</span>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          preference.state ? 'border-[#ffd709] bg-[#ffd709]' : 'border-gray-300'
                        }`}>
                          {preference.state && <Check className="w-3.5 h-3.5 text-gray-900 stroke-[3px]" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Input Group 4: Special Request Text Field */}
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-800 font-thai">โน้ตพิเศษถึงร้านอาหาร</span>
                  <span className="text-[10px] text-gray-400 font-bold tracking-wider font-thai">ระบุความต้องการเพิ่มเติม</span>
                </div>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="เช่น ไม่โรยถั่ว, ขอพริกน้ำปลาเพิ่ม, แยกน้ำราด..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:border-[#ffd709] focus:ring-2 focus:ring-[#ffd709]/20 outline-none transition-all resize-none h-20 font-thai"
                  maxLength={120}
                />
              </div>

            </div>

            {/* Quantity Controller & Confirm CTA Fixed Bar */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] z-20 flex items-center justify-between gap-4 font-thai">
              {/* Quantity Select Group */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-600 hover:bg-gray-100 active:scale-90 transition-transform"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-black text-base text-gray-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-600 hover:bg-gray-100 active:scale-90 transition-transform"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirmAdd}
                className="flex-1 bg-[#ffd709] text-black hover:bg-yellow-500 py-6 text-base font-bold rounded-2xl shadow-sm active:scale-98 transition-transform shrink-0 font-thai"
              >
                เพิ่มลงตะกร้า • {formatPrice(totalPriceForCustom)}
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Global styles for hide-scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
