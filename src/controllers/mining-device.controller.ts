import { Request, Response } from 'express';
import IResponse from '../interfaces/IResponse';
import { IMiningDevice } from '../models/mining-device.model';
import getUserByReq from '../utils/getUserByReq.utils';
import { validate } from '../utils/validator.utils';
import { createDeviceSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
import { models, sequelize } from '../db';
import { IMiningWallet } from '../models/mining-wallet.model';
import IServiceResult from '../interfaces/IServiceResult';
import { dateDifference } from '../utils/DateTimeHelper';
import responserUtils from '../utils/responser.utils';




const service = genericService(models.MiningDevice)
const serviceWallet = genericService(models.MiningWallet)

export default {

  async getAll(req: Request, res: Response) {
    try {
      const devices = await service.getAll();

      if (devices.ok) {
        return responserUtils(res, 200, {
          success: true,
          data: devices.data
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
    try {
      const id = parseInt(req?.params.id || '0')

      const devices = await service.getOne(id)
      if (devices.ok) {
        return responserUtils(res, 200, {
          success: true,
          data: devices.data
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


  async getAllBy(req: Request, res: Response) {
    try {

      const userId = req.body?.userId


      const devices: IServiceResult<IMiningDevice[]> = await service.getAllBy({ userId });




      var _devs: IMiningDevice[] = []

      devices?.data?.forEach(element => {

        _devs.push({
          ...element.dataValues,
          status: (dateDifference(new Date(), element.updatedAt) > 300 || dateDifference(new Date(), element.updatedAt) < 0) ? 'offline' : 'active'
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
    // TODO this should be by transaction
    const transaction = await sequelize.transaction()
    try {

      const data = validate(createDeviceSchema, req?.body, res);
      if (!data.ok) {
        return data.data
      }




      const userId = data?.data?.userId


      const _deviceWallet: Partial<IMiningWallet> = { userId: userId!, walletAddress: `CID${userId}_imei${data?.data?.imei}`, currency: 'USDT' }


      const createdWallet: IServiceResult<IMiningWallet> = await serviceWallet.create(_deviceWallet, { transaction });
      console.log('createdWallet', createdWallet);



      if (!createdWallet.ok) {
        const _res: IResponse<IMiningDevice> = {
          success: false,
          message: 'device create failed due to issue in creating corresponding wallet'
        }
        return responserUtils(res, 400, _res)

      }

      const _dev = data.data
      const _device: IMiningDevice = { userId: createdWallet.data?.userId, walletId: createdWallet.data?.id, deviceModel: _dev?.deviceModel, serialNumber: _dev?.serialNumber, deviceName: _dev?.deviceName, imei: _dev?.imei }

      const createdDevice = await service.create(_device, { transaction });




      await transaction.commit()


      
      if (createdDevice.ok) {
        const device = createdDevice.data
        const wallet = createdWallet.data

        const _res: IResponse<{ device: IMiningDevice; wallet: IMiningWallet }> = {
          success: true,
          data: { device, wallet: wallet! }
        }

        return responserUtils(res, 200, _res)

      } else {
        return responserUtils(res, 400, {
          success: false,
          message: 'we regret to inform fail'
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


      const deletedDevice = await service.delete(id);

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