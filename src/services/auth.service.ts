import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import { sequelize, models } from '../db';
import { UserService } from './user.service';
import { log } from 'console';
import Role, { IRole } from '../models/role.model';
import initialRolesList from '../utils/initialRolesList';
import User, { IUser } from '../models/user.model';
import Customer, { ICustomer } from '../models/customer.model';
import UserWallet, { IUserWallet } from '../models/user-wallet.model';
import Joi from 'joi';
import isValidEmail from '../utils/isValidEmail';
import getCustomerInfoService from './getCustomerInfo.service';

export default class {
  static async register(data: any) {
    const { username, email, password, clientType } = data.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const _uName = await UserService.getUserByUserName(username)
    const _uEmail = await UserService.getUserByEmail(email)


    if (_uName?.id! > 0) {
      return 'username already taken'
    }
    if (_uEmail?.id! > 0) {
      return 'email already taken'
    }

    // await initializeRoles();

    // const rolls = await models.Role.findAndCountAll()

    // if (rolls.count < 1) {


    //   const _rolls: IRole[] =initialRolesList

    //   for (let index = 0; index < _rolls.length; index++) {
    //     const role = await models.Role.create(_rolls[index])
    //   }

    // }


    const user = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
      clientType,
      // roleId: 1,
    });


    const w: IUserWallet = {
      userId: user.id,
      walletAddress: 'samp',
    }


    //TODO const wallet = await UserWallet.create(w)

    const c: ICustomer = {
      userId: user?.id,
      ranking: 'None',
      // defaultWalletId: wallet?.dataValues?.id || 0

    }
    await Customer.create(c)
    console.log('user', user);




    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    return { accessToken: token, user: user.get({ plain: true }) };
  }

  static async login(data: any) {
    const { email, password } = data;

    var where = {};

    if (isValidEmail(email)) {
      where = { email };
    } else {
      where = { username: email };
    }

    var user = await User.findOne({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          include: [{
            model: UserWallet,
            as: 'defaultWallet'
          }]
        }]
    });

    // const user: IUser | null = await getCustomerInfoService(data);
    console.log(user);

    if (!user) throw new Error('Invalid credentials');


    const isPasswordValid = await bcrypt.compare(password, user?.passwordHash!);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    return { accessToken: token, user: user.get!({ plain: true }) };
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



