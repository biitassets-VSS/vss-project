// ================================================
// SHARED TYPES
// ================================================

export type Role             = "admin" | "staff";
export type InspectionStatus = "pending" | "done" | "overdue";
export type TrackingType     = "ASSIGN" | "RETURN" | "INSPECT" | "NOTE";
export type NotifStatus      = "pending" | "sent" | "overdue";

export type Profile = {
  id:          string;
  role:        Role;
  active:      boolean;
  department?: string;
  avatar_url?: string;
  phone?:      string;
};

export type Asset = {
  id:             string;
  name:           string;
  image_url?:     string;
  department?:    string;
  category_slug?: string;
  serial_number?: string;
  brand?:         string;
  model?:         string;
  available?:     boolean;
  assigned_to?:   string;
  status:         InspectionStatus;
};

export type TrackingRow = {
  id:          string;
  asset_id:    string;
  staff_id?:   string;
  type:        TrackingType;
  notes?:      string;
  created_at:  string;
  created_by?: string;
};

export type Inspection = {
  id:               string;
  asset_id:         string;
  staff_id:         string;
  status:           InspectionStatus;
  due_date?:        string;
  notes?:           string;
  photo_front_url?: string;
  photo_back_url?:  string;
  photo_left_url?:  string;
  photo_right_url?: string;
  created_at?:      string;
};

export type Notification = {
  id:            string;
  inspection_id: string;
  staff_id:      string;
  due_date?:     string;
  status:        NotifStatus;
  message:       string;
  created_at:    string;
};
