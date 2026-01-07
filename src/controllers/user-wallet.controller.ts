import { Request, Response } from 'express';
import { models } from '../db';
import { createMiningWalletSchema, createUserWalletSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
import responser from '../utils/responser.utils';
import { validate } from '../utils/validator.utils';
import { IUserWallet } from '../models/user-wallet.model';
import IServiceResult from '../interfaces/IServiceResult';




const service = genericService(models.UserWallet)

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

      const data:IServiceResult <IUserWallet> = validate(createUserWalletSchema, req?.body, res);

      if (!data.ok) {
        return
      }

      const w = await service.findOne({ walletAddress: data.data!.walletAddress, userId: data.data!.userId });
      // console.log(w);
      if (w.data!?.id! > 0) {
        responser(res, 400, { success: false, message: 'Wallet address already exists' })
        return
      }

      const w2 = await service.findOne({ nickname: data.data!.nickname, userId: data.data!.userId });
      // console.log(w);
      if (w2.data!?.id! > 0) {

        return responser(res, 400, { success: false, message: 'Wallet nickname already exists' })
      }

      const createdItem = await service.create(data.data);


      if (createdItem.ok) {

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

      const deletedItems = await service.delete(id);

      if (deletedItems.ok) {

        responser(res, 200, { success: true, message: `${deletedItems.data} wallets were deleted` })

      } else {

        responser(res, 400, { success: false, data: deletedItems.data })

      }


    } catch (error) {

      responser(res, 400, { success: false }, error)

    }
  }

}