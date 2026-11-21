import { UserRole } from "@prisma/client";

// Permission matrix
export const PERMISSIONS = {
  // User management
  MANAGE_USERS: [UserRole.SUPER_ADMIN],
  
  // Settings
  MANAGE_SETTINGS: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL],
  MANAGE_SCHOOL_PROFILE: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.SCHOOL_ADMIN],
  
  // Teachers
  MANAGE_TEACHERS: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.SCHOOL_ADMIN, UserRole.TEACHER_EDITOR],
  PUBLISH_TEACHERS: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.SCHOOL_ADMIN],
  
  // Administration
  MANAGE_ADMIN_PROFILES: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.SCHOOL_ADMIN],
  
  // Notices
  MANAGE_NOTICES: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.SCHOOL_ADMIN, UserRole.CONTENT_EDITOR],
  PUBLISH_NOTICES: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.SCHOOL_ADMIN],
  
  // News & Events
  MANAGE_NEWS: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.CONTENT_EDITOR],
  PUBLISH_NEWS: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN],
  
  // Gallery
  MANAGE_GALLERY: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.GALLERY_MANAGER, UserRole.CONTENT_EDITOR],
  PUBLISH_GALLERY: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.GALLERY_MANAGER],
  
  // Results
  MANAGE_RESULTS: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.SCHOOL_ADMIN],
  PUBLISH_RESULTS: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL],
  
  // Alumni
  MANAGE_ALUMNI: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.ALUMNI_MODERATOR],
  
  // Downloads
  MANAGE_DOWNLOADS: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.CONTENT_EDITOR],
  
  // Academics
  MANAGE_ACADEMICS: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.SCHOOL_ADMIN, UserRole.CONTENT_EDITOR],
  
  // Media
  MANAGE_MEDIA: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.GALLERY_MANAGER, UserRole.CONTENT_EDITOR],
  
  // Audit & Backup
  VIEW_AUDIT_LOGS: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL],
  MANAGE_BACKUPS: [UserRole.SUPER_ADMIN],
  
  // Contact messages
  VIEW_CONTACT_MESSAGES: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN],
  
  // Migration
  MANAGE_MIGRATION: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN],
};

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly UserRole[]).includes(role);
}

export function requirePermission(role: UserRole | undefined, permission: Permission): void {
  if (!role || !hasPermission(role, permission)) {
    throw new Error("Unauthorized: insufficient permissions");
  }
}
