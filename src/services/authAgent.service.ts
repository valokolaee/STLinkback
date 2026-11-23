import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import Agent from '../db/models/agent.model';
import Role from '../db/models/role.model';
import User from '../db/models/user.model';

export default class {

  static async login(data: any) {
    const { email, username, password } = data;
    const user = await User.scope('withPassword').findOne({
      where: { email: email },
      include: [
        {
          model: Agent,
          as: 'agent',
          include: [{
            model: Role,
            as: 'role'
          }]
        }],
      raw: true,
      nest: true
    });

    console.log(data, user)


    if (!user) throw new Error('User not found');


    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    return { accessToken: token, user: user };

  }



}



