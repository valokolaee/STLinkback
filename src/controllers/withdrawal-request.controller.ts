import { Request, Response } from 'express';
import { models } from '../db';
import { createWithdrawalRequestSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
import getUserByReqUtils from '../utils/getUserByReq.utils';
import responser from '../utils/responser.utils';
import { validate } from '../utils/validator.utils';
import miningWalletService from '../services/miningWallet.service';
import IServiceResult from '../interfaces/IServiceResult';
import { IMiningWallet } from '../models/mining-wallet.model';
import { IWithdrawalRequest } from '../models/withdrawal-request.model';




const service = genericService(models.WithdrawalRequest)
const serviceMiningWallet = genericService(models.MiningWallet)


export default {

  async getAll(req: Request, res: Response) {
    try {

      const items = await service.getAll();


      if (items.ok) {
        responser(res, 200, { success: true, data: items.data })
      } else {
        responser(res, 404, { success: false, })
      }


    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },


  async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req?.params.id || '0')

      const items = await service.getOne(id)

      if (items.ok) {

        responser(res, 200, { success: true, data: items.data })

      } else {

        responser(res, 404, { success: false, })

      }

    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },

  async getAllBy(req: Request, res: Response) {
    try {

      const userId = req.body.userId

      const items = await service.getAllBy({ userId });

      if (items.ok) {
        responser(res, 200, { success: true, data: items.data })
      } else {
        responser(res, 404, { success: false, })
      }

    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },

  async create(req: Request, res: Response) {

    try {
      const userId = getUserByReqUtils(req).id;

      const currency = 'USDT'
      const data: IServiceResult<IWithdrawalRequest> = validate(createWithdrawalRequestSchema, { userId, currency, ...req?.body }, res);

      if (!data.ok) {
        return
      }



      // console.log('mw', _mw);

      // const _res: IDeviceEarning = { userId, ...data.data }
      const createdItem = await service.create(data.data);


      if (createdItem.ok) {

        const _mw: IServiceResult<IMiningWallet> = await miningWalletService.getOneByAddress(data?.data!?.walletAddress)

        const _newBalance = _mw?.data?.availableBalance! - data?.data?.amount!


        responser(res, 200, { success: true, data: createdItem.data })

      } else {

        responser(res, 400, { success: false, data: createdItem.data })

      }

    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },

  async update(req: Request, res: Response) {

    try {

      const w = req.body

      const updatedItems = await service.update(w);

      if (updatedItems.ok) {

        responser(res, 200, { success: true, data: updatedItems.data })

      } else {

        responser(res, 400, { success: false, data: updatedItems.data })

      }

    } catch (error) {
      responser(res, 500, { success: false, }, error)
    }
  },

  async delete(req: Request, res: Response) {

    try {

      const id = parseInt(req?.params.id || '0')
      console.log(id);

      const deletedItems = await service.delete(id);

      if (deletedItems.ok) {

        responser(res, 200, { success: true, message: `${deletedItems.data} items were deleted` })

      } else {

        responser(res, 400, { success: false, data: deletedItems.data })

      }


    } catch (error) {

      responser(res, 400, { success: false }, error)

    }
  }

}