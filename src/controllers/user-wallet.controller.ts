import { Request, Response } from 'express';
import { createMiningWalletSchema, createUserWalletSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
import { validate } from '../utils/validator.utils';
import IServiceResult from '../interfaces/IServiceResult';
import { models } from '../db/db';
import getUserByReqUtils from '../utils/getUserByReq.utils';
import { log } from 'console';
import UserWallet, { IUserWallet } from '../db/models/user-wallet.model';
import responserUtils from '../utils/responser.utils';




const service = genericService(UserWallet)

export default {

  async getAll(req: Request, res: Response) {
    try {

      const items = await service.getAll();


      if (items.ok) {
        return responserUtils(res, 200, { success: true, data: items.data })
      } else {
        return responserUtils(res, 404, { success: false, })
      }


    } catch (error) {

      return responserUtils(res, 500, { success: false, }, error)

    }
  },

  // 09116246120
  async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req?.params.id || '0')

      const items = await service.getOne(id)

      if (items.ok) {

        return responserUtils(res, 200, { success: true, data: items.data })

      } else {

        return responserUtils(res, 404, { success: false, })

      }

    } catch (error) {

      return responserUtils(res, 500, { success: false, }, error)

    }
  },

  async getAllBy(req: Request, res: Response) {
    try {

      const userId = req.body.userId

      const items = await service.getAllBy({ userId });

      if (items.ok) {
        return responserUtils(res, 200, { success: true, data: items.data })
      } else {
        return responserUtils(res, 404, { success: false, })
      }

    } catch (error) {

      return responserUtils(res, 500, { success: false, }, error)

    }
  },

  async create(req: Request, res: Response) {

    // console.log('req', req.user.id);
    const userId = getUserByReqUtils(req)?.id

    try {

      const data: IServiceResult<IUserWallet> = validate(createUserWalletSchema, req?.body, res);

      if (!data.ok) { return }

      const w = await service.findOne({ walletAddress: data.data!.walletAddress, userId });

      if (w.data!?.id! > 0) { return responserUtils(res, 400, { success: false, message: 'Wallet address already exists' }) }

      const w2 = await service.findOne({ nickname: data.data!.nickname, userId });

      if (w2.data!?.id! > 0) {
        return responserUtils(res, 400, { success: false, message: 'Wallet nickname already exists' })
      }

      const createdItem = await service.create({ ...data.data, userId });


      if (createdItem.ok) {

        return responserUtils(res, 200, { success: true, data: createdItem.data })

      } else {

        return responserUtils(res, 400, { success: false, data: createdItem.data })

      }

    } catch (error) {

      return responserUtils(res, 500, { success: false, }, error)

    }
  },

  async update(req: Request, res: Response) {

    try {

      const w = req.body

      const updatedItems = await service.update(w);

      if (updatedItems.ok) {

        return responserUtils(res, 200, { success: true, data: updatedItems.data })

      } else {

        return responserUtils(res, 400, { success: false, data: updatedItems.data })

      }

    } catch (error) {
      return responserUtils(res, 500, { success: false, }, error)
    }
  },

  async delete(req: Request, res: Response) {

    try {

      const id = parseInt(req?.params.id || '0')

      const deletedItems = await service.delete(id);

      if (deletedItems.ok) {

        return responserUtils(res, 200, { success: true, message: `${deletedItems.data} wallets were deleted` })

      } else {

        return responserUtils(res, 400, { success: false, data: deletedItems.data })

      }


    } catch (error) {

      return responserUtils(res, 400, { success: false }, error)

    }
  }

}