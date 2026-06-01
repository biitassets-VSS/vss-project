// ================================================
// GLOBAL CONSTANTS
// ================================================

export const BRAND = {
  name:      "Virtual Staffing Solutions",
  shortName: "VSS",
  tagline:   "Smart Asset Management",
  copyright: `© ${new Date().getFullYear()} AinodeArt. All rights reserved.`,
  email:     "support@virtualstaffingsolutions.com",
} as const;

export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
} as const;

export const INSPECTION_STATUS = {
  PENDING: "pending",
  DONE:    "done",
  OVERDUE: "overdue",
} as const;

export const TRACKING_TYPES = {
  ASSIGN:  "ASSIGN",
  RETURN:  "RETURN",
  INSPECT: "INSPECT",
  NOTE:    "NOTE",
} as const;

export const PHOTO_SIDES = [
  "photo_front",
  "photo_back",
  "photo_left",
  "photo_right",
] as const;

export type PhotoSide = typeof PHOTO_SIDES[number];
