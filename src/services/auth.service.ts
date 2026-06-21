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
import serviceResponserUtils from '../utils/serviceResponser.utils';

export default class {



  static async register(data: any) {
    const { username, email, password, clientType } = data.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const _uName = await UserService.getUserByUserName(username)
    const _uEmail = await UserService.getUserByEmail(email)


    if (_uName?.id! > 0) {
      return serviceResponserUtils({
        ok: false,
        data: {
          code: 409,
          msg: 'username already taken'
        }
      })
    }
    if (_uEmail?.id! > 0) {
      return serviceResponserUtils({
        ok: false,
        data: {
          code: 409,
          msg: 'email already taken'
        }
      })
    }


    const transaction = await sequelize.transaction();

    try {

      const user = await User.create({
        username,
        email,
        passwordHash: hashedPassword,
      }, { transaction });
      console.log('user', user);

      const customer = await Customer.create({
        userId: user.id,
        ranking: 'None'
      }, { transaction });

      log('customer', customer)

      await user.update({
        customerId: customer.id
      }, { transaction });

      await transaction.commit();
      // console.log('transaction.commit', transaction);
      // return this.login({ email, password })
      // 


      // const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
      // // return { accessToken: token, user: user.get({ plain: true }) };


      return serviceResponserUtils({
        ok: true,
        data: { email, password }//: user.get({ plain: true })
      })

    } catch (err) {

      await transaction.rollback();
      console.error(err);

      // throw err;
      return serviceResponserUtils({
        ok: false,
        data: {
          code: 500,
          err
        }
      })

    }




    // const user = await User.create({
    //   username,
    //   email,
    //   passwordHash: hashedPassword,
    //   clientType,

    // });
    // console.log(user);


    // const w: IUserWallet = {
    //   userId: user.id,
    //   walletAddress: 'samp',
    // }


    //TODO const wallet = await UserWallet.create(w)

    // const c: ICustomer = {
    //   userId: user?.id,
    //   ranking: 'None',
    //   // defaultWalletId: wallet?.dataValues?.id || 0

    // }
    // await Customer.create({
    //   userId: user?.id,
    //   ranking: 'None',
    //   // defaultWalletId: wallet?.dataValues?.id || 0

    // })
    // console.log('user', user);




  }

  static async login(data: any) {

    const { email, password } = data;

    var where = {};

    if (isValidEmail(email)) {
      where = { email };
    } else {
      where = { username: email };
    }

    var user: IUser | null = await User.findOne({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          include: [{
            model: UserWallet,
            as: 'defaultWallet'
          }]
        }],
      raw: true,  // Returns plain object, no Sequelize methods
      nest: true  // Nests the customer object properly
    });

    // const user: IUser | null = await getCustomerInfoService(data);
    // console.log('this.login', user);

    // if (!user) throw new Error('Invalid credentials');
    if (!user) {
      console.log('User not found')
      return serviceResponserUtils({
        ok: false,
        data: {
          code: 500,
        }

      })

    }


    const isPasswordValid = await bcrypt.compare(password, user?.passwordHash!);

    // if (!isPasswordValid) throw new Error('Invalid credentials');
    if (!isPasswordValid) {
      console.log('Invalid credentials');
      return serviceResponserUtils({
        ok: false,
        data: {
          code: 500,
        }
      })
    }


    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });


    const _u: IUser = { token, ...user, passwordHash: '' };

    return serviceResponserUtils({
      ok: true,
      data: _u
    })
    // return _u
  }

  
}



