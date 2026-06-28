import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import { models } from '../db';
import Role from '../models/role.model';
import Agent from '../models/agent.model';
import User from '../models/user.model';
import { log } from 'console';
import { Op } from 'sequelize';
import serviceResponserUtils from '../utils/serviceResponser.utils';
import Customer from '../models/customer.model';
import UserWallet from '../models/user-wallet.model';

export default class {

  static async search(data?: any) {
    const { searchTerm } = data;
    // console.log(searchTerm);
    
    const users = await User.findAll({
      where: {

        [Op.or]: [
          { username: { [Op.like]: `%${searchTerm || ''}%` } },
          { email: { [Op.like]: `%${searchTerm || ''}%` } },
        ]
      },
      include: [
        {
          model: Customer,
          as: 'customer',
          required: true, // فقط یوزرهایی که Customer دارند
          include: [{
            model: UserWallet,
            as: 'defaultWallet'
          }]
        }],

      raw: true,  // Returns plain object, no Sequelize methods
      nest: true  // Nests the customer object properly
    });

    return serviceResponserUtils({
      ok: true,
      data: users
    })
  }



}



