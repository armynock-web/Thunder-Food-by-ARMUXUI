'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRiderProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('rider_profiles')
    .select('*, users(*)')
    .eq('id', user.id)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function updateRiderStatus(isOnline: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('rider_profiles')
    .update({ is_online: isOnline })
    .eq('id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/rider')
  return { success: true }
}

export async function getRiderHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants (name, address),
      customer:users!customer_id (full_name, phone)
    `)
    .eq('rider_id', user.id)
    .in('status', ['completed', 'cancelled'])
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function updateRiderVehicle(vehicleInfo: string, licensePlate: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('rider_profiles')
    .update({ 
      vehicle_info: vehicleInfo,
      license_plate: licensePlate,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/rider/profile')
  revalidatePath('/rider/vehicle')
  return { success: true }
}

