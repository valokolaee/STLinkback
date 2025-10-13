// src/seeds/role-seed.ts
import { Role } from '../models/Role';

export const seedRoles = async () => {
  await Role.bulkCreate([
    { name: 'admin', description: 'Super Admin' },
    { name: 'user', description: 'Regular User' },
    { name: 'agent', description: 'Affiliate Agent' },
  ]);
};