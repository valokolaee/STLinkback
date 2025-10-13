import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import { sequelize, models } from '../db';
import { UserService } from './user.service';
import { log } from 'console';

export class AuthService {
  static async register(data: any) {
    const { username, email, password, clientType } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const _uName = await UserService.getUserByUserName(username)
    const _uEmail = await UserService.getUserByEmail(email)

    if (_uName?.id! > 0) {
      return 'username already taken'
    }
    if (_uEmail?.id! > 0) {
      return 'email already taken'
    }

    const user = await models.User.create({
      username,
      email,
      passwordHash: hashedPassword,
      clientType,
      roleId: 1,
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return { accessToken: token, user: user.get({ plain: true }) };
  }

  static async login(data: any) {
    const { email, password } = data;
    console.log(data);
    var user = await models.User.findOne({ where: { email } });

    
    // in order to make login possible with username too
    if (!user) { user = await models.User.findOne({ where: { username: email } }); }


    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return { accessToken: token, user: user.get({ plain: true }) };
  }

  static async authenticate(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const user = await models.User.findByPk(decoded.id, {
        include: [{ model: models.Role, as: 'role' }]
      });

      if (!user) return null;
      return user;
    } catch (error) {
      return null;
    }
  }
}