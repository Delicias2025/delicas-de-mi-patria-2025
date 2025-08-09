-- =============================================
-- DELICIAS DE MI PATRIA - SUPABASE SETUP 100% REAL
-- =============================================
-- Run this SQL in your Supabase SQL Editor

BEGIN;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- USERS PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    gallery_urls TEXT[], -- Array of image URLs
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    weight DECIMAL(8,2), -- For shipping calculations
    dimensions JSONB, -- {length, width, height}
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_intent_id VARCHAR(255),
    
    -- Customer Info
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    
    -- Shipping Address
    shipping_address JSONB NOT NULL,
    
    -- Order Totals
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Shipping Info
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL, -- Store name in case product is deleted
    product_image VARCHAR(500),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- CART TABLE (for persistent shopping carts)
-- =============================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- For guest users
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, product_id),
    UNIQUE(session_id, product_id)
);

-- =============================================
-- SHIPPING ZONES AND RATES
-- =============================================
CREATE TABLE IF NOT EXISTS shipping_zones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    countries TEXT[] NOT NULL,
    states TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS shipping_rates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    zone_id UUID REFERENCES shipping_zones(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    min_weight DECIMAL(8,2) DEFAULT 0,
    max_weight DECIMAL(8,2),
    min_price DECIMAL(10,2) DEFAULT 0,
    max_price DECIMAL(10,2),
    rate DECIMAL(10,2) NOT NULL,
    estimated_days VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- CONTACT MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(300),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'text', -- text, number, boolean, json
    category VARCHAR(100) DEFAULT 'general',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all order items" ON order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Cart Items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Contact Messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all messages" ON contact_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update messages" ON contact_messages FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Site Settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Shipping
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view shipping info" ON shipping_zones FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view shipping rates" ON shipping_rates FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage shipping" ON shipping_zones FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage shipping rates" ON shipping_rates FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Default categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Dulces Tradicionales', 'dulces-tradicionales', 'Dulces típicos de Colombia', true),
('Postres Caseros', 'postres-caseros', 'Postres hechos en casa con amor', true),
('Bebidas Artesanales', 'bebidas-artesanales', 'Bebidas tradicionales colombianas', true),
('Conservas y Mermeladas', 'conservas-mermeladas', 'Conservas caseras y mermeladas naturales', true)
ON CONFLICT (slug) DO NOTHING;

-- Default shipping zone (Colombia)
INSERT INTO shipping_zones (name, countries, is_active) VALUES
('Colombia Nacional', ARRAY['Colombia', 'CO'], true)
ON CONFLICT DO NOTHING;

-- Default shipping rates
INSERT INTO shipping_rates (zone_id, name, min_weight, max_weight, rate, estimated_days, is_active) VALUES
((SELECT id FROM shipping_zones WHERE name = 'Colombia Nacional' LIMIT 1), 'Envío Estándar', 0, 5, 15000, '3-5 días', true),
((SELECT id FROM shipping_zones WHERE name = 'Colombia Nacional' LIMIT 1), 'Envío Express', 0, 5, 25000, '1-2 días', true)
ON CONFLICT DO NOTHING;

-- Default site settings
INSERT INTO site_settings (key, value, type, category, description) VALUES
('site_name', 'Delicias de mi Patria', 'text', 'general', 'Nombre del sitio web'),
('site_description', 'Dulces y postres tradicionales colombianos', 'text', 'general', 'Descripción del sitio'),
('contact_email', 'info@deliciasdemipatria.com', 'text', 'contact', 'Email de contacto'),
('contact_phone', '+57 300 123 4567', 'text', 'contact', 'Teléfono de contacto'),
('contact_address', 'Bogotá, Colombia', 'text', 'contact', 'Dirección física'),
('currency', 'COP', 'text', 'ecommerce', 'Moneda del sitio'),
('tax_rate', '19', 'number', 'ecommerce', 'Tasa de impuesto (%)'),
('free_shipping_threshold', '100000', 'number', 'ecommerce', 'Monto mínimo para envío gratis')
ON CONFLICT (key) DO NOTHING;

COMMIT;

-- =============================================
-- REALTIME SUBSCRIPTIONS (Enable after tables are created)
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;

-- Success message
SELECT 'Delicias de mi Patria database setup completed successfully! 🎉' as result;