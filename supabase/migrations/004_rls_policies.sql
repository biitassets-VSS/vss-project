-- ================================================
-- MIGRATION 004: Row Level Security Policies
-- ================================================

ALTER TABLE profiles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_assets             ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections              ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_history         ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_notifications ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ──
CREATE POLICY "admin_all_profiles" ON profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "staff_read_own_profile" ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "staff_update_own_profile" ON profiles FOR UPDATE
  USING (id = auth.uid());

-- ── ASSETS ──
CREATE POLICY "admin_all_assets" ON assets FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "staff_read_assigned_assets" ON assets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_assets sa
      WHERE sa.asset_id = assets.id AND sa.staff_id = auth.uid()
    )
    AND (SELECT active FROM profiles WHERE id = auth.uid()) = true
  );

-- ── STAFF_ASSETS ──
CREATE POLICY "admin_all_staff_assets" ON staff_assets FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "staff_read_own_assignments" ON staff_assets FOR SELECT
  USING (staff_id = auth.uid());

-- ── INSPECTIONS ──
CREATE POLICY "admin_all_inspections" ON inspections FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "staff_read_inspections" ON inspections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_assets sa
      WHERE sa.asset_id = inspections.asset_id AND sa.staff_id = auth.uid()
    )
    AND (SELECT active FROM profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "staff_create_inspections" ON inspections FOR INSERT
  WITH CHECK (
    staff_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM staff_assets sa
      WHERE sa.asset_id = inspections.asset_id AND sa.staff_id = auth.uid()
    )
    AND (SELECT active FROM profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "staff_update_own_inspections" ON inspections FOR UPDATE
  USING (
    staff_id = auth.uid()
    AND (SELECT active FROM profiles WHERE id = auth.uid()) = true
  );

-- ── TRACKING HISTORY ──
CREATE POLICY "admin_all_tracking" ON tracking_history FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "staff_read_tracking" ON tracking_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_assets sa
      WHERE sa.asset_id = tracking_history.asset_id AND sa.staff_id = auth.uid()
    )
  );

CREATE POLICY "staff_insert_tracking" ON tracking_history FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND (SELECT active FROM profiles WHERE id = auth.uid()) = true
  );

-- ── NOTIFICATIONS ──
CREATE POLICY "admin_all_notifications" ON inspection_notifications FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "staff_read_own_notifications" ON inspection_notifications FOR SELECT
  USING (staff_id = auth.uid());
