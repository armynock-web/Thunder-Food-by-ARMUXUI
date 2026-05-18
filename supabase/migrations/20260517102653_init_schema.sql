-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Enums
create type user_role as enum ('customer', 'restaurant', 'rider', 'admin');
create type order_status as enum ('pending', 'preparing', 'ready', 'picking_up', 'delivering', 'completed', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'failed');
create type payment_method as enum ('cash', 'transfer');

-- 2. Create Tables

-- users
create table public.users (
  id uuid references auth.users not null primary key,
  role user_role default 'customer'::user_role not null,
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- restaurants
create table public.restaurants (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.users(id) not null unique,
  name text not null,
  description text,
  image_url text,
  address text not null,
  lat float8 not null,
  lng float8 not null,
  is_open boolean default true not null,
  rating float8 default 0 not null,
  review_count int default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- menu_categories
create table public.menu_categories (
  id uuid default uuid_generate_v4() primary key,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  name text not null,
  sort_order int default 0 not null,
  created_at timestamptz default now() not null
);

-- menu_items
create table public.menu_items (
  id uuid default uuid_generate_v4() primary key,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  category_id uuid references public.menu_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  is_available boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- orders
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.users(id) not null,
  restaurant_id uuid references public.restaurants(id) not null,
  rider_id uuid references public.users(id),
  status order_status default 'pending'::order_status not null,
  total_amount numeric not null,
  delivery_fee numeric not null,
  delivery_address jsonb not null,
  payment_method payment_method default 'cash'::payment_method not null,
  payment_status payment_status default 'pending'::payment_status not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- order_items
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  menu_item_id uuid references public.menu_items(id) not null,
  quantity int not null,
  price_at_time numeric not null
);

-- rider_profiles
create table public.rider_profiles (
  id uuid references public.users(id) on delete cascade not null primary key,
  vehicle_info text,
  license_plate text,
  is_online boolean default false not null,
  current_lat float8,
  current_lng float8,
  total_earnings numeric default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Indexes
create index idx_orders_customer_id on public.orders(customer_id);
create index idx_orders_restaurant_id on public.orders(restaurant_id);
create index idx_orders_rider_id on public.orders(rider_id);
create index idx_orders_status on public.orders(status);
create index idx_menu_items_restaurant_id on public.menu_items(restaurant_id);
create index idx_menu_items_category_id on public.menu_items(category_id);
create index idx_restaurants_owner_id on public.restaurants(owner_id);
create index idx_restaurants_is_open on public.restaurants(is_open);

-- 4. Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.restaurants enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.rider_profiles enable row level security;

-- 5. RLS Policies

-- Users: Read public, Update own
create policy "Users can read all profiles" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Restaurants: Read public, Insert/Update/Delete by owner
create policy "Restaurants are viewable by everyone" on public.restaurants for select using (true);
create policy "Owners can insert their restaurants" on public.restaurants for insert with check (auth.uid() = owner_id);
create policy "Owners can update their restaurants" on public.restaurants for update using (auth.uid() = owner_id);

-- Menu Categories: Read public, Modify by restaurant owner
create policy "Menu categories are viewable by everyone" on public.menu_categories for select using (true);
create policy "Restaurant owners can modify categories" on public.menu_categories for all using (
  exists (select 1 from public.restaurants where id = restaurant_id and owner_id = auth.uid())
);

-- Menu Items: Read public, Modify by restaurant owner
create policy "Menu items are viewable by everyone" on public.menu_items for select using (true);
create policy "Restaurant owners can modify menu items" on public.menu_items for all using (
  exists (select 1 from public.restaurants where id = restaurant_id and owner_id = auth.uid())
);

-- Orders: 
-- Customer: Select own, Insert own
-- Restaurant: Select own restaurant's, Update own restaurant's
-- Rider: Select ready OR own, Update own
create policy "Customers can view own orders" on public.orders for select using (auth.uid() = customer_id);
create policy "Restaurants can view their orders" on public.orders for select using (
  exists (select 1 from public.restaurants where id = restaurant_id and owner_id = auth.uid())
);
create policy "Riders can view ready orders or their own" on public.orders for select using (
  status = 'ready' or auth.uid() = rider_id
);

create policy "Customers can create orders" on public.orders for insert with check (auth.uid() = customer_id);
create policy "Customers can update their pending orders" on public.orders for update using (auth.uid() = customer_id and status = 'pending');
create policy "Restaurants can update their orders" on public.orders for update using (
  exists (select 1 from public.restaurants where id = restaurant_id and owner_id = auth.uid())
);
create policy "Riders can update their accepted orders" on public.orders for update using (
  (rider_id is null and status = 'ready') or auth.uid() = rider_id
);

-- Order Items: Select/Insert based on order
create policy "Users can view order items for their orders" on public.order_items for select using (
  exists (
    select 1 from public.orders 
    where id = order_id and (
      customer_id = auth.uid() or 
      rider_id = auth.uid() or 
      exists (select 1 from public.restaurants where id = restaurant_id and owner_id = auth.uid())
    )
  )
);
create policy "Customers can create order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where id = order_id and customer_id = auth.uid())
);

-- Rider Profiles
create policy "Rider profiles are viewable by everyone" on public.rider_profiles for select using (true);
create policy "Riders can modify their own profile" on public.rider_profiles for all using (auth.uid() = id);

-- 6. Triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_rider_profiles_updated_at BEFORE UPDATE ON public.rider_profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Supabase auth hook to create public.users profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown User'), 
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Enable Realtime
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.rider_profiles;
