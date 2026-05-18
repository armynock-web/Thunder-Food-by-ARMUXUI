'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveRestaurantProfile(formData: FormData) {
  const supabase = await createClient()

  // Ensure user is authenticated and is a restaurant
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'ไม่พบข้อมูลผู้ใช้งาน (Unauthorized)' }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'restaurant') {
    return { error: 'สิทธิ์การใช้งานไม่ถูกต้อง' }
  }

  // Extract form data
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string
  const isOpen = formData.get('is_open') === 'true'

  if (!name || !address) {
    return { error: 'กรุณากรอกชื่อร้านและที่อยู่ให้ครบถ้วน' }
  }

  // Use .upsert() matching owner_id
  const { data, error } = await supabase
    .from('restaurants')
    .upsert({
      owner_id: user.id,
      name,
      description: description || null,
      address,
      is_open: isOpen,
      // Setting mock default location to avoid lat/lng null constraint errors 
      // if not provided, since the schema requires lat/lng
      lat: 13.7563,
      lng: 100.5018
    }, {
      onConflict: 'owner_id',
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    console.error('Error upserting restaurant:', error)
    return { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลร้านค้า: ' + error.message }
  }

  revalidatePath('/restaurant/settings')
  return { success: true, message: 'บันทึกข้อมูลร้านค้าสำเร็จ' }
}

export async function getRestaurantProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is expected for new restaurants
    console.error('Error fetching restaurant profile:', error)
    return null
  }

  return data
}
