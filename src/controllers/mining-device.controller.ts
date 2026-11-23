import { log } from 'console';
import { Request, Response } from 'express';
import { sequelize } from '../db/db';
import { IDeviceEarningPot } from '../db/models/device-earning-pot.model';
import DevicePotAssignment, { IDevicePotAssignment } from '../db/models/device-pot-assignment';
import { IMiningDevice } from '../db/models/mining-device.model';
import { createDeviceSchema } from '../dtos/dto';
import IResponse from '../interfaces/IResponse';
import IServiceResult from '../interfaces/IServiceResult';
import DeviceEarningPotService from '../services/DeviceEarningPot.service';
import DevicePotAssignmentService from '../services/DevicePotAssignment.service';
import MiningDeviceService from '../services/miningDevice.service';
import getUserByReq from '../utils/getUserByReq.utils';
import responserUtils from '../utils/responser.utils';
import statusCalculator from '../utils/statusCalculator';
import { validate } from '../utils/validator.utils';




const miningDeviceService = MiningDeviceService()
const serviceDeviceEarningPot = DeviceEarningPotService()
const serviceDeviceJoinPot = DevicePotAssignmentService(DevicePotAssignment)

export default {

  async getAll(req: Request, res: Response) {
    try {


      const devices: IServiceResult<IMiningDevice[]> = await miningDeviceService.getAll();





      if (devices.ok) {
        var _devs: IMiningDevice[] = []

        devices?.data?.forEach(element => {

          _devs.push({
            ...element.dataValues,
            status: statusCalculator(element.updatedAt!) // (dateDifference(new Date(), element.updatedAt) > 300 || dateDifference(new Date(), element.updatedAt) < 0) ? 'offline' : 'active'
          })
        });




        return responserUtils(res, 200, {
          success: true,
          data: _devs// devices.data
        })

      } else {

        return responserUtils(res, 404, {
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

    // return responserUtils(res, 200, { success: true, data:' devices.data' })

    try {
      const id = parseInt(req?.params.id || '0')

      const devices = await miningDeviceService.getOne(id);

      if (devices.ok) {

        return responserUtils(res, 200, { success: true, data: devices.data })

      } else {

        return responserUtils(res, 404, { success: false, })

      }

    } catch (error) {

      return res.status(500).json({ success: false, });

    }
  },


  async getAllBy(req: Request, res: Response) {

    try {

      const userId = req.body?.userId


      const devices: IServiceResult<IMiningDevice[]> = await miningDeviceService.getAllBy(userId);


      var _devs: IMiningDevice[] = []

      devices?.data?.forEach(element => {

        _devs.push({
          ...element.dataValues,
          status: statusCalculator(element.updatedAt!) // (dateDifference(new Date(), element.updatedAt) > 300 || dateDifference(new Date(), element.updatedAt) < 0) ? 'offline' : 'active'
        })
      });


      if (devices.ok) {
        return responserUtils(res, 200, {
          success: true,
          data: _devs// devices.data
        })
      } else {
        return responserUtils(res, 404, {
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

    const creatorId = getUserByReq(req)?.id

    const transaction = await sequelize.transaction();

    try {

      const b = { ...req?.body, userId: req?.body?.userId || creatorId }
      const data = validate(createDeviceSchema, b, res);


      if (!data.ok) {
        return
      }


      const _deviceData = data?.data
      const userId = _deviceData?.userId || creatorId//// it is when no owner has bee specified which will make the admin the owner



      const _pot: Partial<IDeviceEarningPot> = { userId: userId!, currency: 'USDT' }


      // return responserUtils(res, 400, {
      //   success: false,
      //   message: `createdDevice.message || 'we regret to inform fail'`,
      //   data: _pot
      // })
      const createdPot: IServiceResult<IDeviceEarningPot> = await serviceDeviceEarningPot.create(_pot, transaction);

      if (!createdPot.ok) { throw new Error(createdPot?.message); }


      const _device: IMiningDevice = { creatorId, currentPotId: createdPot.data?.id, deviceModel: _deviceData?.deviceModel, serialNumber: _deviceData?.serialNumber, deviceName: _deviceData?.deviceName, imei: _deviceData?.imei }
      const createdDevice: IServiceResult<IMiningDevice> = await miningDeviceService.create(_device, transaction);

      if (!createdDevice?.ok) {
        throw new Error(createdDevice?.message);
      
      }


      const _devicePotAssignment: IDevicePotAssignment = { deviceId: createdDevice.data?.id, potId: createdPot.data?.id,creatorId:userId }
      log('_devicePotAssignment', _devicePotAssignment)
      const _join: IServiceResult<DevicePotAssignment> = await serviceDeviceJoinPot.create(_devicePotAssignment, transaction)

      if (!_join.ok) { throw new Error("Device Pot Assignment Failed "); }


      await transaction.commit()


      if (createdDevice.ok) {
        const device = createdDevice?.data!
        const pot = createdPot.data!

        const _res: IResponse<{ device: IMiningDevice; pot: IDeviceEarningPot }> = {
          success: true,
          data: { device, pot }
        }

        return responserUtils(res, 200, _res)

      } else {
        return responserUtils(res, 400, {
          success: false,
          message: createdDevice.message || 'we regret to inform fail'
        })

      }


    } catch (error: any) {

      await transaction.rollback()


      return responserUtils(res, 400, {
        success: false,
        message: error.message || 'we regret to inform fail'
      })

    }
  },

  async update(req: Request, res: Response) {

    try {

      const _device: IMiningDevice = req.body

      const createdDevice = await miningDeviceService.update(_device);

      if (createdDevice.ok) {
        const _res: IResponse<IMiningDevice> = {
          success: true,
          data: createdDevice.data
        }

        return responserUtils(res, 200, _res)

      } else {
        return responserUtils(res, 400, {
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


      const deletedDevice = await miningDeviceService.delete(id);

      if (deletedDevice.ok) {
        const _res: IResponse<IMiningDevice> = {
          success: true,
          message: `${deletedDevice.data} devices were deleted`
        }

        return responserUtils(res, 200, _res)

      } else {


        return responserUtils(res, 400, {
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