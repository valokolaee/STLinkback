import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import { models } from '../db';
import Role from '../models/role.model';
import Agent from '../models/agent.model';
import User from '../models/user.model';

export default class {

  static async login(data: any) {
    const { email, password } = data;

    const user = await User.findOne({
      where: { username: email },
      include: [
        {
          model: Agent,
          as: 'agent',
          include: [{
            model: Role,
            as: 'role'
          }]
        }]
    });

    // const aaa = await Agent.findAll()
    console.log(user?.dataValues);


    if (!user) throw new Error('User not found');

    console.log(password, user.passwordHash);

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    // console.log('isPasswordValid',isPasswordValid);
    
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    return { accessToken: token, user: user.get({ plain: true }) };

  }



}



