// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import IResponse from '../interfaces/IResponse';
import { IMiningDevice } from '../models/mining-device.model';
// import service from '../services/device.service';
import getUserByReq from '../utils/getUserByReq.utils';
import responser from '../utils/responser.utils';
import { validate } from '../utils/validator.utils';
import { createDeviceSchema } from '../dtos/auth.dto';
import genericService from '../services/generic.service';
import { models } from '../db';




const service = genericService(models.MiningDevice)

export default {

  async getAll(req: Request, res: Response) {
    try {
      const devices = await service.getAll();
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
  },



  async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req?.params.id || '0')

      const devices = await service.getOne(id)
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
  },


  async getAllBy(req: Request, res: Response) {
    try {

      const userId = req.body.userId

      const devices = await service.getAllBy({ userId });

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
  },

  async create(req: Request, res: Response) {

    try {
      const userId = getUserByReq(req).id;

      const data = validate(createDeviceSchema, req?.body, res);
      if (!data.ok) {
        return
      }

      const _device: IMiningDevice = { userId, ...data.data }

      const createdDevice = await service.create(_device);

      if (createdDevice.ok) {
        const _res: IResponse<IMiningDevice> = {
          success: true,
          data: createdDevice.data
        }

        responser(res, 200, _res)

      } else {
        responser(res, 400, {
          success: false,
          data: createdDevice.data
        })

      }


    } catch (error) {

      return res.status(500).json({
        success: false,
      });
    }
  },

  async update(req: Request, res: Response) {

    try {

      const _device: IMiningDevice = req.body

      const createdDevice = await service.update(_device);

      if (createdDevice.ok) {
        const _res: IResponse<IMiningDevice> = {
          success: true,
          data: createdDevice.data
        }

        responser(res, 200, _res)

      } else {
        responser(res, 400, {
          success: false,
          data: createdDevice.data
        })

      }


    } catch (error) {

      return res.status(500).json({
        success: false,
      });
    }
  },


  async delete(req: Request, res: Response) {

    try {

      const id = parseInt(req?.params.id || '0')


      const deletedDevice = await service.delete(id);

      if (deletedDevice.ok) {
        const _res: IResponse<IMiningDevice> = {
          success: true,
          message: `${deletedDevice.data} devices were deleted`
        }

        responser(res, 200, _res)

      } else {


        responser(res, 400, {
          success: false,
          data: deletedDevice.data
        })

      }


    } catch (error) {

      return res.status(500).json({
        success: false,
      });
    }
  }

}