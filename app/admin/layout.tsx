import { ReactNode } from "react"
import Link from "next/link"
import { LayoutDashboard, Store, Users, FileText, Settings, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { logout } from "@/app/actions/auth"

// B-08 Fixed: Admin Auth Guard — ตรวจสอบ Role ก่อน render ทุกครั้ง
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check admin role from public.users table
  const { data: profile } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    // Redirect non-admin to their proper portal
    redirect(`/${profile?.role || 'customer'}`)
  }

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/restaurants', icon: Store, label: 'จัดการร้านอาหาร' },
    { href: '/admin/users', icon: Users, label: 'ผู้ใช้งาน / ไรเดอร์' },
    { href: '/admin/orders', icon: FileText, label: 'ประวัติคำสั่งซื้อ' },
    { href: '/admin/settings', icon: Settings, label: 'ตั้งค่าระบบ' },
  ]

  return (
    <div className="flex h-screen bg-[#f9f6f5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0e0e0e] text-[#f9f6f5] flex flex-col transition-all duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-black text-[#ffd709] tracking-tight">THUNDER<span className="text-white">ADMIN</span></h1>
          <p className="text-[#8c8a88] text-xs mt-1 uppercase tracking-widest">System Management</p>
          <p className="text-[#4a4a4a] text-xs mt-2">👤 {profile.full_name}</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b0adab] hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1a1a1a]">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#f95630] hover:bg-[#f95630]/10 transition-colors"
            >
              <LogOut size={20} />
              <span>ออกจากระบบ</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
