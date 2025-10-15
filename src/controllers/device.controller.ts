// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import IResponse from '../interfaces/IResponse';
import { IMiningDevice } from '../models/mining-device.model';
import deviceService from '../services/device.service';
import getUserByReq from '../utils/getUserByReq';
import responser from '../utils/responser';
import { validate } from '../utils/validator.utils';
import { createDeviceSchema } from '../dtos/auth.dto';

export default class {

  static async getAll(req: Request, res: Response) {
    try {
      const userId = getUserByReq(req).id;

      const devices = await deviceService.getAll(userId!);
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



  static async getOne(req: Request, res: Response) {

    try {
      const id = req.params
      // console.log(id);

      responser(res, 200)
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

      const data = validate(createDeviceSchema, req?.body, res);
      if (!data.ok) {
        return
      }

      const _device: IMiningDevice = { userId, ...data.data }

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