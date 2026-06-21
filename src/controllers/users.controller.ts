import { Request, Response } from 'express';
import { models } from '../db';
import { createDeviceEarningSchema } from '../dtos/dto';
import IServiceResult from '../interfaces/IServiceResult';
import { IDeviceEarning } from '../models/device-earning.model';
import MiningWallet, { IMiningWallet } from '../models/mining-wallet.model';
import genericService from '../services/generic.service';
import getUserByReq from '../utils/getUserByReq.utils';
import responser from '../utils/responser.utils';
import { validate } from '../utils/validator.utils';
import usersService from '../services/users.service';


const service = genericService(models.DeviceEarning)
const serviceWallet = genericService(models.MiningWallet)

export default {

  async getAll(req: Request, res: Response) {
    try {

      // const devices = await service.getAll();
      responser(res, 200, {
        message: 'thanks',
        data: {
          d: 'we did it'
        }
      })

      // if (devices.ok) {
      //   responser(res, 200, { success: true, data: devices.data })
      // } else {
      //   responser(res, 404, { success: false, })
      // }


    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },
  async search(req: Request, res: Response) {
    try {
      const { searchTerm } = req?.body || {}
      // console.log(searchTerm);

      const users = await usersService.search({searchTerm});
      responser(res, 200, {
        // message: 'thanks',
        data: users,
        success: true

      })





    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },


  async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req?.params.id || '0')

      const devices = await service.getOne(id)

      if (devices.ok) {

        responser(res, 200, { success: true, data: devices.data })

      } else {

        responser(res, 404, { success: false, })

      }

    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },

  async getAllBy(req: Request, res: Response) {
    try {

      const deviceId = req.body.deviceId

      const devices = await service.getAllBy({ deviceId });

      if (devices.ok) {
        responser(res, 200, { success: true, data: devices.data })
      } else {
        responser(res, 404, { success: false, })
      }

    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },

  async create(req: Request, res: Response) {

    try {
      const userId = getUserByReq(req).id;
      const walletId = req.body.walletId!;

      const data = validate(createDeviceEarningSchema, req?.body, res);

      if (!data.ok) {
        return
      }

      const _res: IDeviceEarning = { userId, ...data.data }
      const createdDeviceEarning: IServiceResult<IDeviceEarning> = await service.create(_res);

      if (createdDeviceEarning.ok) {

        const mwID = walletId

        var mw: IMiningWallet = (await serviceWallet.getOne(mwID)).data

        const newBalance =
          parseFloat(mw.availableBalance!.toString())
          + createdDeviceEarning.data?.amount! || 0;


        const newTotalEarning =
          parseFloat(mw.totalEarnings!.toString())
          + createdDeviceEarning.data?.amount! || 0;


        await serviceWallet.update({
          id: mwID,
          availableBalance: newBalance,
          totalEarnings: newTotalEarning
        })


        responser(res, 200, { success: true, data: createdDeviceEarning.data })

      } else {

        responser(res, 400, { success: false, data: createdDeviceEarning.data })

      }

    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },

  async update(req: Request, res: Response) {

    try {

      const _device: IDeviceEarning = req.body

      const createdDevice = await service.update(_device);

      if (createdDevice.ok) {

        responser(res, 200, { success: true, data: createdDevice.data })

      } else {

        responser(res, 400, { success: false, data: createdDevice.data })

      }

    } catch (error) {
      responser(res, 500, { success: false, }, error)
    }
  },

  async delete(req: Request, res: Response) {

    try {

      const id = parseInt(req?.params.id || '0')

      const deletedDevice = await service.delete(id);

      if (deletedDevice.ok) {

        responser(res, 200, { success: true, message: `${deletedDevice.data} earnings were deleted` })

      } else {

        responser(res, 400, { success: false, data: deletedDevice.data })

      }


    } catch (error) {

      responser(res, 400, { success: false }, error)

    }
  }

}