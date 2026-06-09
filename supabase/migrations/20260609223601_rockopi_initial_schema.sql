/*
# Rockopi Initial Schema & Seed

## 1. New Tables
- `products`: Menu items dengan kolom id, name, description, price, category, image_url, created_at
- `orders`: Order transactions dengan kolom id, description, type, amount, status, production_status, created_at
- `admin_settings`: Konfigurasi aplikasi dengan key-value storage

## 2. Security
- RLS enabled di semua tabel
- Polisi anon+authenticated untuk CRUD (single-tenant app, no auth)

## 3. Seed Data
- 12 produk menu berdasarkan asset gambar yang tersedia
- Default admin PIN: 123456
*/

-- Table: Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Hot Coffee',
  image_url TEXT NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Table: Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'IN',
  amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PENDING',
  production_status TEXT NOT NULL DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now()
);

-- Table: Admin Settings
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Products policies
DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE TO anon, authenticated USING (true);

-- Orders policies
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE TO anon, authenticated USING (true);

-- Admin settings policies
DROP POLICY IF EXISTS "anon_select_settings" ON admin_settings;
CREATE POLICY "anon_select_settings" ON admin_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_settings" ON admin_settings;
CREATE POLICY "anon_update_settings" ON admin_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed products
INSERT INTO products (name, description, price, category, image_url) VALUES
  ('Hot Rockopi', 'Kopi khas Rockopi yang sangat populer. Perpaduan sempurna antara rasa kopi dan racikan spesial khas Rockopi. Wajib coba untuk penggemar kopi otentik.', 12000, 'Hot Coffee', '/Hot Menu.avif'),
  ('Caramel Macchiato', 'Espresso dengan sentuhan caramel manis dan foam susu yang lembut. Minuman hangat yang menenangkan hati di setiap suapan.', 18000, 'Hot Coffee', '/Caramel Macchiato.avif'),
  ('Butterscotch Latte', 'Perpaduan unik kopi dengan sirup butterscotch yang memberikan rasa karamel dengan aroma butter yang creamy dan hangat.', 16000, 'Hot Coffee', '/Butterscotch.avif'),
  ('Iced Rockopi', 'Varian dingin dari kopi legendaris Rockopi. Segar, manis, dan kopi-nya berasa. Cocok untuk cuaca panas dan teman aktivitas sehari-hari.', 14000, 'Iced Coffee', '/Iced Rockopi.avif'),
  ('Iced Americano', 'Espresso dingin dengan air yang menyegarkan. Rasa kopi murni tanpa tambahan gula atau susu. Pilihan tepat bagi pencinta kopi asli.', 13000, 'Iced Coffee', '/Iced Americano.avif'),
  ('Brown Sugar Coffee', 'Kopi dingin dengan brown sugar yang memberikan cita rasa karamel alami dan sedikit rasa gula aren yang otentik. Trending di kalangan anak muda.', 15000, 'Iced Coffee', '/Brown Sugar.avif'),
  ('Iced Matcha', 'Matcha green tea yang segar dengan susu. Rasa teh hijau yang smooth dengan sentuhan manis. Minuman sehat dan menyegarkan.', 17000, 'Iced Coffee', '/Iced Matcha.avif'),
  ('Iced Vanilla', 'Kopi dingin dengan sirup vanilla yang lembut. Aroma vanilla yang harum membuat setiap tegukan terasa istimewa dan elegan.', 15000, 'Iced Coffee', '/Iced Vanilla.avif'),
  ('Banana Iced Coffee', 'Inovasi rasa kopi dengan banana yang unik. Perpaduan kopi dan pisang yang memberikan sensasi berbeda dan nikmat.', 16000, 'Iced Coffee', '/Banana Iced Coffee.avif'),
  ('Iced Pandan Coffee', 'Kopi dingin dengan rasa pandan yang aromatik dan khas. Sentuhan rasa tropis Indonesia yang unik dan menyegarkan.', 16000, 'Iced Coffee', '/Iced Pandan Coffee.avif'),
  ('Iced Chocolate', 'Minuman coklat dingin yang creamy dengan rasa coklat premium yang kaya. Pilihan sempurna untuk pecinta coklat yang tidak suka kopi.', 14000, 'Non Coffee', '/Iced Chocolate.avif'),
  ('Iced Lemon Tea', 'Teh dingin dengan perasan lemon segar. Rasa asam manis yang menyegarkan tenggorokan dan menyegarkan pikiran.', 12000, 'Non Coffee', '/Iced Lemon Tea.avif')
ON CONFLICT (id) DO NOTHING;

-- Seed admin settings
INSERT INTO admin_settings (key, value) VALUES
  ('admin_pin', '123456')
ON CONFLICT (key) DO NOTHING;
