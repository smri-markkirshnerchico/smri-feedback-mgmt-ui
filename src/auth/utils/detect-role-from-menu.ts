import type { UserRole } from '../types';

export type MenuSection = {
  subheader?: string;
  items?: Array<{ title: string; path: string }>;
};

export function detectRoleFromMenu(menuData: MenuSection[]): UserRole | null {
  if (!Array.isArray(menuData)) {
    return null;
  }

  const subheaders = menuData.map(section => section.subheader?.toLowerCase());

  // Priority order: employee > manager > admin
  // When users have multiple roles, the highest priority role is returned
  if (subheaders.includes('employee')) {
    return 'employee';
  }

  if (subheaders.includes('manager')) {
    return 'manager';
  }

  if (subheaders.includes('admin')) {
    return 'admin';
  }

  return null;
}
