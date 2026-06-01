-- ================================================
-- MIGRATION 005: Asset Categories
-- ================================================

CREATE TABLE IF NOT EXISTS asset_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  label       TEXT NOT NULL,
  icon        TEXT NOT NULL,
  description TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO asset_categories (slug, label, icon, description, sort_order) VALUES
  ('laptop',            'Laptop',              '💻', 'Laptops and portable computers',    1),
  ('keyboard-wireless', 'Wireless Keyboard',   '⌨️', 'Wireless keyboards',                2),
  ('keyboard-usb',      'USB Keyboard+Mouse',  '🖱️', 'USB keyboard and mouse combos',     3),
  ('headphone',         'Headphone',           '🎧', 'Headphones and audio devices',       4),
  ('laptop-stand',      'Laptop Stand',        '🗜️', 'Stands and risers for laptops',     5),
  ('mouse-pad',         'Mouse Pad',           '🟦', 'Mouse pads and desk mats',           6),
  ('mobile-phone',      'Mobile Phone',        '📱', 'Mobile phones and smartphones',      7),
  ('usb-ext-hub',       'USB EXT Hub',         '🔌', 'USB extension hubs and splitters',   8),
  ('cleaning-kit',      'Cleaning Kit',        '🧹', 'Device cleaning kits and supplies',  9),
  ('others',            'Others',              '📦', 'Miscellaneous assets',              10)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS category_id    UUID REFERENCES asset_categories(id),
  ADD COLUMN IF NOT EXISTS category_slug  TEXT DEFAULT 'others',
  ADD COLUMN IF NOT EXISTS serial_number  TEXT,
  ADD COLUMN IF NOT EXISTS brand          TEXT,
  ADD COLUMN IF NOT EXISTS model          TEXT,
  ADD COLUMN IF NOT EXISTS available      BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS image_url      TEXT,
  ADD COLUMN IF NOT EXISTS assigned_to    UUID REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category_slug);
CREATE INDEX IF NOT EXISTS idx_assets_available ON assets(available);

ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_read_categories" ON asset_categories FOR SELECT USING (true);

CREATE POLICY "admin_manage_categories" ON asset_categories FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
