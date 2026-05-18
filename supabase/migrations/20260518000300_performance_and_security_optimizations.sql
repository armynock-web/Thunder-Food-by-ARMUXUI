-- Revoke execution from public/anon to secure the RPC function is_admin
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- Add covering indexes for all unindexed foreign keys to optimize database performance
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant_id ON public.menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON public.order_items(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_restaurant_id ON public.user_favorites(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON public.user_payment_methods(user_id);

-- Optimize RLS policies by wrapping auth.uid() and auth.role() to prevent re-evaluation on every row
-- 1. Table: users
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING ((SELECT auth.uid()) = id);

-- 2. Table: restaurants
DROP POLICY IF EXISTS "Owners can update their restaurants" ON public.restaurants;
CREATE POLICY "Owners can update their restaurants" ON public.restaurants
  FOR UPDATE USING ((SELECT auth.uid()) = owner_id);

-- 3. Table: rider_profiles
DROP POLICY IF EXISTS "Riders can modify their own profile" ON public.rider_profiles;
CREATE POLICY "Riders can modify their own profile" ON public.rider_profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id);

-- 4. Table: notifications
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- 5. Table: user_addresses
DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.user_addresses;
CREATE POLICY "Users can manage their own addresses" ON public.user_addresses
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- 6. Table: user_favorites
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.user_favorites;
CREATE POLICY "Users can manage their own favorites" ON public.user_favorites
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- 7. Table: user_payment_methods
DROP POLICY IF EXISTS "Users can manage their own payment methods" ON public.user_payment_methods;
CREATE POLICY "Users can manage their own payment methods" ON public.user_payment_methods
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- 8. Table: orders
DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
CREATE POLICY "Customers can view own orders" ON public.orders
  FOR SELECT USING ((SELECT auth.uid()) = customer_id);

DROP POLICY IF EXISTS "Customers can update their pending orders" ON public.orders;
CREATE POLICY "Customers can update their pending orders" ON public.orders
  FOR UPDATE USING (((SELECT auth.uid()) = customer_id) AND (status = 'pending'::order_status));

DROP POLICY IF EXISTS "Riders can update their accepted orders" ON public.orders;
CREATE POLICY "Riders can update their accepted orders" ON public.orders
  FOR UPDATE USING ((((rider_id IS NULL) AND (status = 'ready'::order_status)) OR ((SELECT auth.uid()) = rider_id)));

DROP POLICY IF EXISTS "Riders can view ready orders or their own" ON public.orders;
CREATE POLICY "Riders can view ready orders or their own" ON public.orders
  FOR SELECT USING (((status = 'ready'::order_status) OR ((SELECT auth.uid()) = rider_id)));
