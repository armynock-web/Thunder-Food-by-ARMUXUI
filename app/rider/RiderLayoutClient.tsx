'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function RiderLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Jobs', path: '/rider', icon: 'two_wheeler' },
    { name: 'History', path: '/rider/history', icon: 'history' },
    { name: 'Profile', path: '/rider/profile', icon: 'person' },
  ]

  return (
    <div className="bg-[#1c1c1e] text-white min-h-screen">
      <main className="pb-32">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-[#1c1c1e]/90 backdrop-blur-xl border-t border-white/10 rounded-t-[2rem]">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link key={item.name} href={item.path} className="flex flex-col items-center justify-center relative group w-16">
              <div className={`flex flex-col items-center justify-center px-4 py-2 transition-all duration-300 ${isActive ? 'bg-[#ffd709] text-[#1c1c1e] rounded-2xl scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                <span className="text-[10px] font-bold uppercase mt-1">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
