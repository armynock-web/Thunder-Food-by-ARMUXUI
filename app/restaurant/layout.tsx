import { ReactNode } from "react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import RestaurantLayoutClient from "./RestaurantLayoutClient"

export default async function RestaurantLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check restaurant role from public.users table
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'restaurant') {
    // Redirect non-restaurant to their proper portal
    redirect(`/${profile?.role || 'customer'}`)
  }

  return <RestaurantLayoutClient>{children}</RestaurantLayoutClient>
}
