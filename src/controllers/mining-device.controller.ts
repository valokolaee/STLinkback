import { Request, Response } from 'express';
import IResponse from '../interfaces/IResponse';
import { IMiningDevice } from '../db/models/mining-device.model';
import getUserByReq from '../utils/getUserByReq.utils';
import { validate } from '../utils/validator.utils';
import { createDeviceSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
import { models, sequelize } from '../db/db';
import DeviceEarningPot, { IDeviceEarningPot } from '../db/models/device-earning-pot.model';
import IServiceResult from '../interfaces/IServiceResult';
import { dateDifference } from '../utils/DateTimeHelper';
import responserUtils from '../utils/responser.utils';
import MiningDeviceService from '../services/miningDevice.service';
import DevicePotAssignment, { IDevicePotAssignment } from '../db/models/device-pot-assignment';
import { log } from 'console';
import statusCalculator from '../utils/statusCalculator';




const miningDeviceService = MiningDeviceService()
const serviceDeviceEarningPot = genericService(DeviceEarningPot)
const serviceDeviceJoinPot = genericService(DevicePotAssignment)

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

      const data = validate(createDeviceSchema, req?.body, res);
      if (!data.ok) {
        return
      }


      const _deviceData = data?.data
      const userId = _deviceData?.userId // data?.data?.userId



      const _pot: Partial<IDeviceEarningPot> = { userId: userId!, currency: 'USDT' }
      const createdPot: IServiceResult<IDeviceEarningPot> = await serviceDeviceEarningPot.create(_pot,  transaction);

      if (!createdPot.ok) { throw new Error("Pot Failed "); }


      const _device: IMiningDevice = { creatorId, currentPotId: createdPot.data?.id, deviceModel: _deviceData?.deviceModel, serialNumber: _deviceData?.serialNumber, deviceName: _deviceData?.deviceName, imei: _deviceData?.imei }
      const createdDevice: IServiceResult<IMiningDevice> = await miningDeviceService.create(_device,  transaction);

      if (!createdDevice.ok) { throw new Error("Device Failed "); }


      const _devicePotAssignment: IDevicePotAssignment = { deviceId: createdDevice.data?.id, potId: createdPot.data?.id, }
      log('_devicePotAssignment', _devicePotAssignment)
      const _join: IServiceResult<DevicePotAssignment> = await serviceDeviceJoinPot.create(_devicePotAssignment,  transaction)

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
          message: 'we regret to inform fail'
        })

      }


    } catch (error) {

      await transaction.rollback()

      return responserUtils(res, 400, {
        success: false,
        message: 'we regret to inform fail'
      })

      // return res.status(500).json({
      //   success: false,
      // });

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