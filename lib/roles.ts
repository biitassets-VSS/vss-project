// ================================================
// ROLE HELPERS
// ================================================

type Profile = { role: string; active: boolean };

export const isAdmin  = (p: Profile) => p.role   === "admin";
export const isStaff  = (p: Profile) => p.role   === "staff";
export const isActive = (p: Profile) => p.active === true;

export const canAccessAdmin      = (p: Profile) => isAdmin(p) && isActive(p);
export const canSubmitInspection = (p: Profile) => isStaff(p) && isActive(p);
export const canUploadPhotos     = (p: Profile) => isStaff(p) && isActive(p);