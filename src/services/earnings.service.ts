import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import { sequelize, models } from '../db';
import { UserService } from './user.service';
import { log } from 'console';
import getUserByReq from '../utils/getUserByReq';
import IServiceResult from '../interfaces/IServiceResult';
import serviceResponser from '../utils/serviceResponser';
import { IDeviceEarning } from '../models/device-earning.model';
 
export default class {

  static async getAll( deviceId:number) {

    try {
      const devices = await models.DeviceEarning.findAll({
        where: {
          // userId
        }
      });
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

  static async getOne(userId: number) {

    try {
      const devices = await models.DeviceEarning.findAll({
        where: {
        
        }
      });
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

  static async create(device: IDeviceEarning) {


    try {
      const _device = await models.DeviceEarning.create(device);

      return serviceResponser({
        ok: true,
        data: _device
      })

    } catch (error) {
      return serviceResponser({ ok: false, data: error })

    }

  }


}