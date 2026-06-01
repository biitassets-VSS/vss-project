-- ================================================
-- MIGRATION 003: Inspection Notifications
-- ================================================

CREATE TABLE IF NOT EXISTS inspection_notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
  staff_id      UUID REFERENCES profiles(id)    ON DELETE CASCADE,
  due_date      DATE,
  status        TEXT CHECK (status IN ('pending','sent','overdue')) DEFAULT 'pending',
  message       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_staff  ON inspection_notifications(staff_id);
CREATE INDEX IF NOT EXISTS idx_notif_status ON inspection_notifications(status);
CREATE INDEX IF NOT EXISTS idx_notif_date   ON inspection_notifications(due_date);
