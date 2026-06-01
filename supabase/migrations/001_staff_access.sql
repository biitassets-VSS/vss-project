-- ================================================
-- MIGRATION 001: Core Tables & Staff Access
-- ================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS active      BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS role        TEXT CHECK (role IN ('admin','staff')) DEFAULT 'staff',
  ADD COLUMN IF NOT EXISTS department  TEXT,
  ADD COLUMN IF NOT EXISTS phone       TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url  TEXT;

CREATE TABLE IF NOT EXISTS staff_assets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  asset_id    UUID NOT NULL REFERENCES assets(id)   ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES profiles(id),
  UNIQUE(staff_id, asset_id)
);

CREATE TABLE IF NOT EXISTS tracking_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id   UUID NOT NULL REFERENCES assets(id),
  staff_id   UUID REFERENCES profiles(id),
  type       TEXT NOT NULL CHECK (type IN ('ASSIGN','RETURN','INSPECT','NOTE')),
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

CREATE OR REPLACE RULE no_update_tracking AS
  ON UPDATE TO tracking_history DO INSTEAD NOTHING;
CREATE OR REPLACE RULE no_delete_tracking AS
  ON DELETE TO tracking_history DO INSTEAD NOTHING;

CREATE INDEX IF NOT EXISTS idx_staff_assets_staff ON staff_assets(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_assets_asset ON staff_assets(asset_id);
CREATE INDEX IF NOT EXISTS idx_tracking_asset     ON tracking_history(asset_id);
CREATE INDEX IF NOT EXISTS idx_tracking_staff     ON tracking_history(staff_id);
