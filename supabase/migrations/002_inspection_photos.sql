-- ================================================
-- MIGRATION 002: Inspection Photos + Due Dates
-- ================================================

ALTER TABLE inspections
  ADD COLUMN IF NOT EXISTS photo_front_url TEXT,
  ADD COLUMN IF NOT EXISTS photo_back_url  TEXT,
  ADD COLUMN IF NOT EXISTS photo_left_url  TEXT,
  ADD COLUMN IF NOT EXISTS photo_right_url TEXT,
  ADD COLUMN IF NOT EXISTS notes           TEXT,
  ADD COLUMN IF NOT EXISTS due_date        DATE,
  ADD COLUMN IF NOT EXISTS status          TEXT
    CHECK (status IN ('pending','done','overdue')) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS staff_id        UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS asset_id        UUID REFERENCES assets(id);

CREATE INDEX IF NOT EXISTS idx_inspections_staff    ON inspections(staff_id);
CREATE INDEX IF NOT EXISTS idx_inspections_asset    ON inspections(asset_id);
CREATE INDEX IF NOT EXISTS idx_inspections_due_date ON inspections(due_date);
CREATE INDEX IF NOT EXISTS idx_inspections_status   ON inspections(status);
