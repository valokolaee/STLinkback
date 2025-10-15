// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import IResponse from '../interfaces/IResponse';

import getUserByReq from '../utils/getUserByReq';
import responser from '../utils/responser';
import { validate } from '../utils/validator.utils';
import { createDeviceEarningSchema, createDeviceSchema } from '../dtos/auth.dto';
import earningsService from '../services/earnings.service';
import { IDeviceEarning } from '../models/device-earning.model';
import { IMiningDevice } from '../models/mining-device.model';
import deviceService from '../services/device.service';

export default class {

  static async getAll(req: Request, res: Response) {
    try {
      const userId = getUserByReq(req).id;

      const devices = await earningsService.getAll(userId!);
      if (devices.ok) {
        responser(res, 200, {
          success: true,
          data: devices.data
        })
      } else {
        responser(res, 404, {
          success: false,
        })

      }

    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  }


  static async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req?.params.id || '0')

      const devices = await earningsService.getOne(id)
      if (devices.ok) {
        responser(res, 200, {
          success: true,
          data: devices.data
        })
      } else {
        responser(res, 404, {
          success: false,
        })

      }

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
      });
    }
  }

  static async create(req: Request, res: Response) {

    try {
      const userId = getUserByReq(req).id;

      const data = validate(createDeviceEarningSchema, req?.body, res);
      if (!data.ok) {
        return
      }

      const _device: IDeviceEarning = { userId, ...data.data }

      const createdDevice = await earningsService.create(_device);

      if (createdDevice.ok) {
        const _res: IResponse<IDeviceEarning> = {
          success: true,
          data: createdDevice.data
        }

        responser(res, 200, _res)

      } else {

        console.log(createdDevice);

        responser(res, 400, {
          success: false,
          data: createdDevice.data
          // message: 'device not created'
        })

      }


    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        // message: 'Failed to fetch profile',
      });
    }
  }




  static async update(req: Request, res: Response) {

    try {
      const userId = getUserByReq(req).id;


      const _device: IMiningDevice = { userId, }

      const createdDevice = await deviceService.create(_device);

      if (createdDevice.ok) {
        const _res: IResponse<IMiningDevice> = {
          success: true,
          data: createdDevice.data
        }

        responser(res, 200, _res)

      } else {

        console.log(createdDevice);

        responser(res, 400, {
          success: false,
          data: createdDevice.data
          // message: 'device not created'
        })

      }


    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        // message: 'Failed to fetch profile',
      });
    }
  }
  static async delete(req: Request, res: Response) {

    try {
      const userId = getUserByReq(req).id;


      const _device: IMiningDevice = { userId, }

      const createdDevice = await deviceService.create(_device);

      if (createdDevice.ok) {
        const _res: IResponse<IMiningDevice> = {
          success: true,
          data: createdDevice.data
        }

        responser(res, 200, _res)

      } else {

        console.log(createdDevice);

        responser(res, 400, {
          success: false,
          data: createdDevice.data
          // message: 'device not created'
        })

      }


    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        // message: 'Failed to fetch profile',
      });
    }
  }






}