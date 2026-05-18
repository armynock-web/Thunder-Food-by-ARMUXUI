'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// B-03 Fixed: getUserFavorites now uses correct column name image_url
export async function getOpenRestaurants() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, description, image_url, rating, review_count, address, lat, lng')
    .eq('is_open', true)
    .order('rating', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getUserAddresses() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function addUserAddress(title: string, address: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('user_addresses')
    .insert({ user_id: user.id, title, address })

  if (error) return { error: error.message }
  revalidatePath('/profile/addresses')
  return { success: true }
}

export async function deleteUserAddress(addressId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/profile/addresses')
  return { success: true }
}

// B-03 Fixed: select image_url not cover_image_url
export async function getUserFavorites() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('*, restaurants(id, name, description, image_url, rating)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function toggleFavorite(restaurantId: string, isFavorite: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  if (isFavorite) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .match({ user_id: user.id, restaurant_id: restaurantId })
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: user.id, restaurant_id: restaurantId })
    if (error) return { error: error.message }
  }
  revalidatePath('/profile/favorites')
  return { success: true }
}

export async function getPaymentMethods() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('user_payment_methods')
    .select('*')
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return { data }
}

export async function setDefaultPaymentMethod(provider: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: existing } = await supabase
    .from('user_payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .eq('provider', provider)
    .single()

  if (existing) {
    await supabase.from('user_payment_methods').update({ is_default: false }).eq('user_id', user.id)
    await supabase.from('user_payment_methods').update({ is_default: true }).eq('id', existing.id)
  } else {
    await supabase.from('user_payment_methods').update({ is_default: false }).eq('user_id', user.id)
    await supabase.from('user_payment_methods').insert({ user_id: user.id, provider, is_default: true })
  }

  revalidatePath('/profile/payment')
  return { success: true }
}

export async function updateUserProfile(fullName: string, phone: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('users')
    .update({ full_name: fullName, phone })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/profile')
  revalidatePath('/profile/settings')
  return { success: true }
}
