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
import { safeParseFloat } from '../utils/math.utils';
import { IUserWallet } from '../models/user-wallet.model';
import userWalletService from '../services/userWallet.service';




const service = genericService(models.WithdrawalRequest)
const serviceMiningWallet = genericService(models.MiningWallet)
const serviceUserWallet = genericService(models.UserWallet)


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

      const items = await service.getAllBy({ userId }, [['requestedAt', 'desc']]);

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


      const _mw: IServiceResult<IMiningWallet> = await miningWalletService.getOneByAddress(data?.data!?.miningWalletAddress)

      const _MW_newBalance = _mw?.data?.availableBalance! - data?.data?.amount!

      if (_MW_newBalance < 0) {
        responser(res, 400, { success: false, message: 'request amount more than available balance' })

        return
      }

      const createdItem = await service.create(data.data);


      if (createdItem.ok) {

        const _uw: IServiceResult<IUserWallet> = await userWalletService.getOneByAddress(data?.data!?.userWalletAddress)

        const _UW_newBalance = safeParseFloat(_uw?.data?.pendingBalance!) + safeParseFloat(data?.data?.amount!)

        serviceUserWallet.update({ id: _uw.data?.id!, pendingBalance: _UW_newBalance })

        serviceMiningWallet.update({ id: _mw.data?.id!, availableBalance: _MW_newBalance })

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

      const w: IWithdrawalRequest = req.body

      const previous: IServiceResult<IWithdrawalRequest> = await service.getOne(w.id!)

      const updatedItems = await service.update(w);

      if (updatedItems.ok) {

        const _mw: IServiceResult<IMiningWallet> = await miningWalletService.getOneByAddress(w.miningWalletAddress)

        var _newBalance = 0

        if (w.status === 'cancelled') {

          _newBalance = safeParseFloat(_mw?.data?.availableBalance!) + safeParseFloat(w.amount!)

        } else {

          _newBalance = safeParseFloat(_mw?.data?.availableBalance!) - (safeParseFloat(w.amount!) - safeParseFloat(previous.data?.amount))

        }

        serviceMiningWallet.update({ id: _mw.data?.id!, availableBalance: _newBalance })

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