import { ReactNode } from "react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import RiderLayoutClient from "./RiderLayoutClient"

export default async function RiderLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check rider role from public.users table
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'rider') {
    // Redirect non-rider to their proper portal
    redirect(`/${profile?.role || 'customer'}`)
  }

  return <RiderLayoutClient>{children}</RiderLayoutClient>
}
