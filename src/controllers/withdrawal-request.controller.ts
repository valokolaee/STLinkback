import { Request, Response } from 'express';
import { models } from '../db/db';
import { createWithdrawalRequestSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
import getUserByReqUtils from '../utils/getUserByReq.utils';
import responser from '../utils/responser.utils';
import { validate } from '../utils/validator.utils';
import miningWalletService from '../services/miningWallet.service';
import IServiceResult from '../interfaces/IServiceResult';
import { IDeviceEarningPot } from '../db/models/device-earning-pot.model';
import { IWithdrawalRequest } from '../db/models/withdrawal-request.model';
import { safeParseFloat } from '../utils/math.utils';
import { IUserWallet } from '../db/models/user-wallet.model';
import userWalletService from '../services/userWallet.service';
import { IUser } from '../db/models/user.model';
import IWithdrawalRequestWithUser from '../interfaces/IWithdrawalRequest';
import responserUtils from '../utils/responser.utils';




const userService = genericService(models.User)
const withdrawalRequestService = genericService(models.WithdrawalRequest)
const serviceMiningWallet = genericService(models.DeviceEarningPot)
const serviceUserWallet = genericService(models.UserWallet)


export default {

  async getAll(req: Request, res: Response) {
    try {

      const items = await withdrawalRequestService.getAll([['requestedAt', 'DESC']]);
      // console.log(items.data);


      if (items.ok) {
        const list: IWithdrawalRequest[] = items.data;
        var nList: IWithdrawalRequestWithUser[] = []
        for (let index = 0; index < list.length; index++) {
          const element: IWithdrawalRequest = list[index];
          const _user: IUser | null = await models.User.findByPk(element.userId) || {};
          nList.push({
            ...element.dataValues,
            user: {
              username: _user.username,
              email: _user.email
            }
          })
        }

        console.log(nList);

        responser(res, 200, { success: true, data: nList })
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

      const items = await withdrawalRequestService.getOne(id)

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

      // const userId = req.body.userId
      const { userId, miningWalletAddress, status } = req.body as IWithdrawalRequest;
      // console.log(req.body);

      const items: IServiceResult<IWithdrawalRequest[]> = await withdrawalRequestService.getAllBy<IWithdrawalRequest>({ userId, status, miningWalletAddress, }, [['requestedAt', 'desc']]);


      if (items.ok) {
        var _withdraws: IWithdrawalRequest[] = [];

        for (let index = 0; index < items.data!.length; index++) {

          const element = items.data![index]

          const _uw: IServiceResult<IUserWallet> = await userWalletService.getOneByAddress(element.dataValues.userWalletAddress!);



          _withdraws.push({ ...element.dataValues, userWalletNickname: _uw.data?.nickname });

        }

        responser(res, 200, { success: true, data: _withdraws })
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


      const _mw: IServiceResult<IDeviceEarningPot> = await miningWalletService.getOneByAddress(data?.data!?.miningWalletAddress!)

      const _MW_newBalance = 0//_mw?.data?.availableBalance! - data?.data?.amount!

      if (_MW_newBalance < 0) {
        responser(res, 400, { success: false, message: 'request amount more than available balance' })

        return
      }

      const createdItem: IServiceResult<IWithdrawalRequest> = await withdrawalRequestService.create(data.data);


      if (createdItem.ok) {

        const _uw: IServiceResult<IUserWallet> = await userWalletService.getOneByAddress(data?.data!?.userWalletAddress!)

        const _UW_newBalance = safeParseFloat(_uw?.data?.pendingBalance!) + safeParseFloat(data?.data?.amount!)

        serviceUserWallet.update({ id: _uw.data?.id!, pendingBalance: _UW_newBalance })

        serviceMiningWallet.update({ id: _mw.data?.id!, availableBalance: _MW_newBalance })


        const _res: IWithdrawalRequest = {
          id: createdItem.data?.id,
          currency: createdItem.data?.currency,
          amount: createdItem.data?.amount,
          deviceName: ' _mw.data?.walletAddress,',
          status: createdItem.data?.status,
          userWalletNickname: _uw.data?.nickname,
          miningWalletAddress: createdItem.data?.miningWalletAddress,
          requestedAt: createdItem.data?.requestedAt
        }

        responser(res, 200, { success: true, data: _res })

      } else {

        responser(res, 400, { success: false, data: createdItem.data })

      }


    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },


  async update(req: Request, res: Response) {

    try {

      const _withDraw: IWithdrawalRequest = req.body

      const previous: IServiceResult<IWithdrawalRequest> = await withdrawalRequestService.getOne(_withDraw.id!)

      switch (previous.data!.status) {

        case 'cancelled':
        case 'completed':
        case 'rejected':
        case 'failed':

          return responserUtils(res, 400, { success: true, message: 'This request is finalized and CAN NOT be altered' })
      }


      const updatedItems = await withdrawalRequestService.update(_withDraw);

      if (updatedItems?.ok) {

        const _miningWallet: IServiceResult<IDeviceEarningPot> = await miningWalletService.getOneByAddress(_withDraw.miningWalletAddress!)

        const _userWallet: IServiceResult<IUserWallet> = await userWalletService.getOneByAddress(_withDraw!?.userWalletAddress!)



        switch (_withDraw.status) {

          case 'cancelled':
          case 'rejected':
          case 'failed':

            const _UW_newPendingBalance = safeParseFloat(_userWallet?.data?.pendingBalance!) - safeParseFloat(_withDraw.amount!)

            const _newBalance = safeParseFloat(_miningWallet?.data?.availableBalance!) + safeParseFloat(_withDraw.amount!)

            serviceUserWallet.update({ id: _userWallet.data?.id!, pendingBalance: _UW_newPendingBalance })

            serviceMiningWallet.update({ id: _miningWallet.data?.id!, availableBalance: _newBalance })

            break;

          case 'approved':

            // take from pendingBalance and add it to availableBalance

            const _UW_newPendingBalance2 = safeParseFloat(_userWallet?.data?.pendingBalance!) - safeParseFloat(_withDraw.amount!)

            const _UW_newAvailableBalance2 = safeParseFloat(_userWallet?.data?.availableBalance!) + safeParseFloat(_withDraw.amount!)

            serviceUserWallet.update({ id: _userWallet.data?.id!, pendingBalance: _UW_newPendingBalance2, availableBalance: _UW_newAvailableBalance2 })

            break;

          case 'completed':

            // take from availableBalance and add it to totalEarning and hereby the money it is also removed from our ecosystem
            // its stored in totalEarning only for reports

            const _UW_newAvailableBalance4 = safeParseFloat(_userWallet?.data?.availableBalance!) - safeParseFloat(_withDraw.amount!)
            const _UW_newTotalEarnings4 = safeParseFloat(_userWallet?.data?.totalEarnings!) + safeParseFloat(_withDraw.amount!)

            serviceUserWallet.update({ id: _userWallet.data?.id!, totalEarnings: _UW_newTotalEarnings4, availableBalance: _UW_newAvailableBalance4 })

            break;



          case 'processing':
            break;


          case 'pending':
          default:

            const _deference = (safeParseFloat(_withDraw.amount!) - safeParseFloat(previous.data?.amount))

            const _UW_newPendingBalance3 = safeParseFloat(_userWallet?.data?.pendingBalance!) + _deference

            const _newBalance3 = safeParseFloat(_miningWallet?.data?.availableBalance!) - _deference

            serviceUserWallet.update({ id: _userWallet.data?.id!, pendingBalance: _UW_newPendingBalance3, })

            serviceMiningWallet.update({ id: _miningWallet.data?.id!, availableBalance: _newBalance3 })
            break;
        }






        responser(res, 200, { success: true, data: updatedItems.data })

      } else {

        responser(res, 400, { success: false, data: updatedItems.data })

      }

    } catch (error) {
      responser(res, 500, { success: false, }, error)
    }
  },


  // {/*we dont have delete here 
  // we just update the status into cancel on user asked for delete*/}

  async delete(req: Request, res: Response) {

    try {

      const id = parseInt(req?.params.id || '0')
      console.log(id);

      const deletedItems = await withdrawalRequestService.delete(id);

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





