import { Request, Response } from 'express';
import { createMiningWalletSchema, createUserWalletSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
import responser from '../utils/responser.utils';
import { validate } from '../utils/validator.utils';
import IServiceResult from '../interfaces/IServiceResult';
import { models } from '../db/db';
 import responserUtils from '../utils/responser.utils';
import getUserByReqUtils from '../utils/getUserByReq.utils';
import { log } from 'console';
import UserWallet, { IUserWallet } from '../db/models/user-wallet.model';




const service = genericService(UserWallet)

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

  // 09116246120
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
    const userId = getUserByReqUtils(req).id
    log('userId', userId)
    try {

      const data: IServiceResult<IUserWallet> = validate(createUserWalletSchema, req?.body, res);

      if (!data.ok) {
        return responserUtils(res, 400, data)
      }

      const w = await service.findOne({ walletAddress: data.data!.walletAddress, userId });
      // console.log(w);
      if (w.data!?.id! > 0) {
      
        return        responser(res, 400, { success: false, message: 'Wallet address already exists' })
      }

      const w2 = await service.findOne({ nickname: data.data!.nickname, userId });
      // console.log(w);
      if (w2.data!?.id! > 0) {

        return responser(res, 400, { success: false, message: 'Wallet nickname already exists' })
      }

      const createdItem = await service.create({ ...data.data, userId });


      if (createdItem.ok) {

       return responser(res, 200, { success: true, data: createdItem.data })

      } else {

       return responser(res, 400, { success: false, data: createdItem.data })

      }

    } catch (error) {

     return responser(res, 500, { success: false, }, error)

    }
  },

  async update(req: Request, res: Response) {

    try {

      const w = req.body

      const updatedItems = await service.update(w);

      if (updatedItems.ok) {

        return responser(res, 200, { success: true, data: updatedItems.data })

      } else {

        return responser(res, 400, { success: false, data: updatedItems.data })

      }

    } catch (error) {
      return responser(res, 500, { success: false, }, error)
    }
  },

  async delete(req: Request, res: Response) {

    try {

      const id = parseInt(req?.params.id || '0')

      const deletedItems = await service.delete(id);

      if (deletedItems.ok) {

        return responser(res, 200, { success: true, message: `${deletedItems.data} wallets were deleted` })

      } else {

        return responser(res, 400, { success: false, data: deletedItems.data })

      }


    } catch (error) {

      return responser(res, 400, { success: false }, error)

    }
  }

}