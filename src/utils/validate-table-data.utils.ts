// src/utils/validate-table-data.utils.ts
export const validateTableData = (table: string, data: Record<string, any>): string | null => {
  switch (table) {
    case 'users':
      if (!data.username || !data.email || !data.password_hash) {
        return 'Username, email and password_hash are required';
      }
      break;
    case 'roles':
      if (!data.name) {
        return 'Role name is required';
      }
      break;
    default:
      return null;
  }
  return null;
};