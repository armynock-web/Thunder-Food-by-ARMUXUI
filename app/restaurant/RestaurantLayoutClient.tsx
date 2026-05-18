'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function RestaurantLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', path: '/restaurant', icon: 'home' },
    { name: 'Menu', path: '/restaurant/menu', icon: 'restaurant_menu' },
    { name: 'History', path: '/restaurant/history', icon: 'history' },
    { name: 'Settings', path: '/restaurant/settings', icon: 'settings' },
  ]

  return (
    <div className="bg-[#f9f6f5] font-body text-[#2f2f2e] min-h-screen">
      {/* TopAppBar */}
      <nav className="bg-[#ffffff] sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffd709]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <h1 className="font-headline font-black uppercase text-2xl italic tracking-tighter text-[#0e0e0e]">THUNDER <span className="text-[#6c5a00]">STORE</span></h1>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="px-6 pt-6 pb-32 max-w-7xl mx-auto space-y-10">
        {children}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#ffffff]/90 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.04)] rounded-t-[2rem]">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link key={item.name} href={item.path} className="flex flex-col items-center justify-center relative group w-16">
              <div className={`flex flex-col items-center justify-center px-4 py-2 transition-all duration-300 ${isActive ? 'bg-[#0e0e0e] text-[#ffd709] rounded-2xl scale-110' : 'text-[#787676] hover:text-[#2f2f2e] active:scale-90'}`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
