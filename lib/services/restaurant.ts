import { createClient } from '@/utils/supabase/client';

export class RestaurantService {
  static async getAllRestaurants() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_open', true);
    return { data, error };
  }

  static async getRestaurantById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('restaurants')
      .select('*, menu_categories(*, menu_items(*))')
      .eq('id', id)
      .single();
    return { data, error };
  }

  static async getMyRestaurant(ownerId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', ownerId)
      .single();
    return { data, error };
  }
}
