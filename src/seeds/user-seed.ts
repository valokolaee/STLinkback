// src/seeds/user-seed.ts
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export const seedUsers = async () => {
  const hashedPassword = bcrypt.hashSync('admin123', 8);

  await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password_hash: hashedPassword,
    role_id: 1,
    client_type: 'individual',
  });
};