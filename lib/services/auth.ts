import { createClient } from '@/utils/supabase/client';

export class AuthService {
  static async login(phoneOrUsername: string, pin: string) {
    const supabase = createClient();
    
    // Auto-append domain for simple login without real email
    const email = `${phoneOrUsername.toLowerCase()}@thunder-food.com`;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pin,
    });
    
    return { data, error };
  }

  static async register(phoneOrUsername: string, pin: string, fullName: string, role: 'customer' | 'restaurant' | 'rider' = 'customer') {
    const supabase = createClient();
    const email = `${phoneOrUsername.toLowerCase()}@thunder-food.com`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pin,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    
    return { data, error };
  }

  static async logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  static async getUser() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;

    // Fetch profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return { ...user, profile };
  }
}
