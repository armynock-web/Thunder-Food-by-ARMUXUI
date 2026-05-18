-- Enable admins to select all orders
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Enable admins to update all restaurants (e.g. for verification)
CREATE POLICY "Admins can update all restaurants" ON public.restaurants
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
