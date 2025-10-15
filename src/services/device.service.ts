import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import { sequelize, models } from '../db';
import { UserService } from './user.service';
import { log } from 'console';
import getUserByReq from '../utils/getUserByReq';
import { IMiningDevice } from '../models/mining-device.model';
import IServiceResult from '../interfaces/IServiceResult';
import serviceResponser from '../utils/serviceResponser';

export default class {

  static async getAll(userId: number) {

    try {
      const devices = await models.MiningDevice.findAll({ where: { userId } });
      // console.log(devices);

      return serviceResponser({
        ok: true,
        data: devices
      })
    } catch (error) {

      return serviceResponser({
        ok: true,
        data: error
      })
    }



  }

  static async create(device: IMiningDevice) {


    try {
      const _device = await models.MiningDevice.create(device);

      return serviceResponser({
        ok: true,
        data: _device
      })

    } catch (error) {
      return serviceResponser({ ok: false, data: error })

    }

  }


}