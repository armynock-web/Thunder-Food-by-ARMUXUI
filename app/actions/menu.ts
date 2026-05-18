'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function getRestaurantId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('restaurants')
    .select('id')
    .eq('owner_id', user.id)
    .single()
  
  return data?.id
}

// ================= Categories =================

export async function getMenuCategories() {
  const restaurantId = await getRestaurantId()
  if (!restaurantId) return { error: 'Restaurant not found' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('sort_order', { ascending: true })

  if (error) return { error: error.message }
  return { data }
}

export async function addCategory(name: string) {
  const restaurantId = await getRestaurantId()
  if (!restaurantId) return { error: 'Restaurant not found' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('menu_categories')
    .insert({ restaurant_id: restaurantId, name })

  if (error) return { error: error.message }
  revalidatePath('/restaurant/menu')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/restaurant/menu')
  return { success: true }
}

// ================= Menu Items =================

export async function getMenuItems() {
  const restaurantId = await getRestaurantId()
  if (!restaurantId) return { error: 'Restaurant not found' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menu_items')
    .select(`*, menu_categories(name)`)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function addMenuItem(formData: FormData) {
  const restaurantId = await getRestaurantId()
  if (!restaurantId) return { error: 'Restaurant not found' }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category_id = formData.get('category_id') as string || null
  let image_url = formData.get('image_url') as string || null
  const image_file = formData.get('image_file') as File | null
  const is_available = formData.get('is_available') === 'true'

  if (!name || isNaN(price)) return { error: 'ชื่อเมนูและราคาไม่ถูกต้อง' }

  const supabase = await createClient()
  
  if (image_file && image_file.size > 0) {
    const fileExt = image_file.name.split('.').pop()
    const fileName = `${restaurantId}/${crypto.randomUUID()}.${fileExt}`
    const { error: uploadError, data } = await supabase.storage.from('menus').upload(fileName, image_file)
    if (!uploadError && data) {
      const { data: publicUrlData } = supabase.storage.from('menus').getPublicUrl(fileName)
      image_url = publicUrlData.publicUrl
    }
  }

  const { error } = await supabase
    .from('menu_items')
    .insert({
      restaurant_id: restaurantId,
      name,
      description,
      price,
      category_id,
      image_url,
      is_available
    })

  if (error) return { error: error.message }
  revalidatePath('/restaurant/menu')
  return { success: true }
}

export async function updateMenuItem(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category_id = formData.get('category_id') as string || null
  let image_url = formData.get('image_url') as string || null
  const image_file = formData.get('image_file') as File | null
  const is_available = formData.get('is_available') === 'true'

  if (!name || isNaN(price)) return { error: 'ชื่อเมนูและราคาไม่ถูกต้อง' }

  const supabase = await createClient()
  
  if (image_file && image_file.size > 0) {
    // Determine restaurantId from the current item first if we don't have it in scope
    // We can just use the item id to create a unique enough path
    const fileExt = image_file.name.split('.').pop()
    const fileName = `item_${id}/${crypto.randomUUID()}.${fileExt}`
    const { error: uploadError, data } = await supabase.storage.from('menus').upload(fileName, image_file)
    if (!uploadError && data) {
      const { data: publicUrlData } = supabase.storage.from('menus').getPublicUrl(fileName)
      image_url = publicUrlData.publicUrl
    }
  }

  const { error } = await supabase
    .from('menu_items')
    .update({
      name,
      description,
      price,
      category_id,
      image_url,
      is_available
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/restaurant/menu')
  return { success: true }
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/restaurant/menu')
  return { success: true }
}
