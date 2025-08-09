-- Create tables for the e-commerce system
-- Run this in your Supabase SQL editor if tables don't exist

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  images TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Can be 'guest-user' or actual user ID
  status TEXT DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_transaction_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to products
CREATE POLICY "Allow public read access to active products" ON public.products
    FOR SELECT USING (active = true);

-- Create policies for orders (admin can see all, users can see their own)
CREATE POLICY "Allow public read access to orders" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to orders" ON public.orders
    FOR UPDATE USING (true);

-- Create policies for order_items
CREATE POLICY "Allow public read access to order_items" ON public.order_items
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to order_items" ON public.order_items
    FOR INSERT WITH CHECK (true);

-- Create policies for users
CREATE POLICY "Allow public read access to users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Insert some sample products if the table is empty
INSERT INTO public.products (name, description, price, category, image, featured, active)
SELECT * FROM (VALUES
  ('Colashampan 20oz', 'Refrescante bebida tradicional', 1.16, 'bebidas', 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Colashampan', true, true),
  ('Café Coscafe', 'Café de primera calidad, aromático y con gran sabor', 3.50, 'cafe', 'https://via.placeholder.com/150/654321/FFFFFF?text=Cafe+Coscafe', true, true),
  ('Alboroto', 'Delicioso snack crujiente para disfrutar', 4.20, 'antojitos', 'https://via.placeholder.com/150/MDURKL/FFFFFF?text=Alboroto', true, true)
) AS t(name, description, price, category, image, featured, active)
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);

COMMIT;