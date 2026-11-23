import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import { sequelize } from '../db/db';
import Client from '../db/models/client.model';
import User, { IUser } from '../db/models/user.model';
import isValidEmail from '../utils/isValidEmail';
import serviceResponserUtils from '../utils/serviceResponser.utils';
import { UserService } from './user.service';

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


      const client = await Client.create({
        userId: user.id,
        ranking: 'None'
      }, { transaction });


      await user.update({
        clientId: client.id
      }, { transaction });

      await transaction.commit();



      return serviceResponserUtils({
        ok: true,
        data: { email, password }
      })

    } catch (err) {

      await transaction.rollback();
      console.error(err);

      return serviceResponserUtils({
        ok: false,
        data: {
          code: 500,
          err
        }
      })

    }




    

  }

  static async login(data: any) {

    const { email, password } = data;

    var where = {};

    if (isValidEmail(email)) {
      where = { email };
    } else {
      where = { username: email };
    }

    var user: IUser | null = await User.scope('withPassword').findOne({
      where,
      include: [
        {
          model: Client,
          as: 'client',
        }],
      raw: true,  // Returns plain object, no Sequelize methods
      nest: true  // Nests the client object properly
    });


    

    if (!user) {
      // console.log('User not found')
      return serviceResponserUtils({
        ok: false,
        data: {
          code: 401,
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



