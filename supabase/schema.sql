-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text,
  phone text,
  role text check (role in ('admin', 'buyer')) not null,
  address text,
  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create profiles access policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create products table
create table public.products (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price decimal(10,2) not null check (price >= 0),
  stock integer not null check (stock >= 0),
  farmer_id uuid references public.profiles(id) not null,
  image_url text,
  category text not null,
  constraint name_length check (char_length(name) >= 3)
);

-- Set up RLS for products
alter table public.products enable row level security;

-- Create products access policies
create policy "Products are viewable by everyone"
  on products for select
  using ( true );

create policy "Farmers can create their own products"
  on products for insert
  with check ( auth.uid() = farmer_id );

create policy "Farmers can update their own products"
  on products for update
  using ( auth.uid() = farmer_id );

create policy "Farmers can delete their own products"
  on products for delete
  using ( auth.uid() = farmer_id );

-- Create orders table
create table public.orders (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  buyer_id uuid references public.profiles(id) not null,
  status text check (status in ('pending', 'completed', 'cancelled')) default 'pending' not null,
  total_amount decimal(10,2) not null check (total_amount >= 0)
);

-- Set up RLS for orders
alter table public.orders enable row level security;

-- Create orders access policies
create policy "Users can view their own orders"
  on orders for select
  using ( auth.uid() = buyer_id );

create policy "Users can create their own orders"
  on orders for insert
  with check ( auth.uid() = buyer_id );

create policy "Users can update their own orders"
  on orders for update
  using ( auth.uid() = buyer_id );

-- Create order_items table
create table public.order_items (
  id uuid default uuid_generate_v4() primary key not null,
  order_id uuid references public.orders(id) not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null check (quantity > 0),
  price_per_unit decimal(10,2) not null check (price_per_unit >= 0)
);

-- Set up RLS for order_items
alter table public.order_items enable row level security;

-- Create order_items access policies
create policy "Users can view their own order items"
  on order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.buyer_id = auth.uid()
    )
  );

create policy "Users can create their own order items"
  on order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.buyer_id = auth.uid()
    )
  );

-- Create function to handle user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();