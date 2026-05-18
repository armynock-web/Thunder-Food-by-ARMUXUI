-- Create migration to update handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role public.user_role;
BEGIN
  v_role := COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role);

  INSERT INTO public.users (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown User'), 
    v_role
  );
  
  IF v_role = 'rider' THEN
    INSERT INTO public.rider_profiles (id, is_online)
    VALUES (new.id, false);
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
