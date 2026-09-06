import { Request, Response } from 'express';
import { models, sequelize } from '../db/db';
import { createWithdrawalRequestSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
import getUserByReqUtils from '../utils/getUserByReq.utils';
import { validate } from '../utils/validator.utils';
import miningWalletService from '../services/miningWallet.service';
import IServiceResult from '../interfaces/IServiceResult';
import DeviceEarningPot, { IDeviceEarningPot } from '../db/models/device-earning-pot.model';
import WithdrawalRequest, { IWithdrawalRequest } from '../db/models/withdrawal-request.model';
import { safeParseFloat } from '../utils/math.utils';
import UserWallet, { IUserWallet } from '../db/models/user-wallet.model';
import userWalletService from '../services/userWallet.service';
import { IUser } from '../db/models/user.model';
import IWithdrawalRequestWithUser from '../interfaces/IWithdrawalRequest';
import responserUtils from '../utils/responser.utils';
import withdrawalRequestSrvc from '../services/withdrawal-request.service';
import { decimalFromString, decimalGreaterThan, decimalLessThan, decimalMinus, decimalPlus, } from '../utils/decimal.utils';
import transactionsService from '../services/transactions.service';
import { log } from 'console';





const withdrawalRequestService = withdrawalRequestSrvc()
const serviceMiningWallet = genericService(DeviceEarningPot)
const serviceUserWallet = genericService(UserWallet)


export default {

  async getAll(req: Request, res: Response) {
    try {

      const items = await withdrawalRequestService.getAll([['requestedAt', 'DESC']]);

      if (items.ok) {

        return responserUtils(res, 200, { success: true, data: items.data })

      } else {

        return responserUtils(res, 404, { success: false, })

      }


    } catch (error) {

      return responserUtils(res, 500, { success: false, }, error)

    }
  },


  async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req?.params.id || '0')

      const items = await withdrawalRequestService.getOne(id)

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

      // const userId = req.body.userId
      const { userId, status } = req.body as IWithdrawalRequest;
      // console.log(req.body);

      const items: IServiceResult<IWithdrawalRequest[]> = await withdrawalRequestService.getAllBy<IWithdrawalRequest>({ userId, status }, [['requestedAt', 'desc']]);


      if (items.ok) {
        // var _withdraws: IWithdrawalRequest[] = [];

        // for (let index = 0; index < items.data!.length; index++) {

        //   const element = items.data![index]

        //   const _uw: IServiceResult<IUserWallet> = await userWalletService.getOneByAddress(element.dataValues.userWalletId!);

        //   _withdraws.push({ ...element.dataValues, userWalletNickname: _uw.data?.nickname });

        // }

        return responserUtils(res, 200, { success: true, data: items?.data })
      } else {
        return responserUtils(res, 404, { success: false, })
      }

    } catch (error) {

      return responserUtils(res, 500, { success: false, }, error)

    }
  },

  async create(req: Request, res: Response) {
    try {
      const userId = getUserByReqUtils(req)?.id;

      if (!userId) {
        return responserUtils(res, 401, { success: false, message: 'Unauthorized' });
      }

      const currency = 'USDT';
      const reqData: IServiceResult<IWithdrawalRequest> = validate(
        createWithdrawalRequestSchema,
        { userId, currency, ...req?.body },
        res
      );

      if (!reqData.ok) {
        return;
      }

      const transaction = await sequelize.transaction();

      try {
        // Fetch + lock the wallet row *inside* the transaction so a concurrent
        // withdrawal request can't read the same stale balance (TOCTOU race).
        const _userWallet: IServiceResult<IUserWallet> = await serviceUserWallet.getOne(
          reqData.data?.userWalletId!,
          {
            transaction,
            lock: transaction.LOCK.UPDATE
          }
        );

        if (!_userWallet.ok || !_userWallet.data) {
          await transaction.rollback();
          return responserUtils(res, 400, { success: false, message: 'Wallet Not Found' });
        }

        if (decimalGreaterThan(reqData.data?.amount!, _userWallet.data.availableBalance!)) {
          await transaction.rollback();
          return responserUtils(res, 400, { success: false, message: 'Insufficient Balance' });
        }

        const createdItem: IServiceResult<IWithdrawalRequest> = await withdrawalRequestService.create(
          reqData.data,
          transaction
        );

        if (!createdItem.ok) {
          await transaction.rollback();
          return responserUtils(res, 400, {
            success: false,
            message: createdItem.message || 'Failed to create withdrawal request',
          });
        }

        const _user_wallet_new_availableBalance = decimalMinus(
          _userWallet.data.availableBalance!,
          reqData.data?.amount!
        );
        const _user_wallet_new_pendingBalance = decimalPlus(
          _userWallet.data.pendingBalance!,
          reqData.data?.amount!
        );

        const newWall = {
          id: _userWallet.data.id!,
          availableBalance: _user_wallet_new_availableBalance,
          pendingBalance: _user_wallet_new_pendingBalance,
        };

        const updatedWallet: IServiceResult<IUserWallet> = await serviceUserWallet.update(
          newWall,
          transaction
        );

        if (!updatedWallet.ok) {
          await transaction.rollback();
          return responserUtils(res, 400, {
            success: false,
            message: updatedWallet.message || 'Failed to update wallet balance',
          });
        }

        await transaction.commit();

        return responserUtils(res, 200, {
          success: true,
          message:
            'Your withdrawal request has been submitted successfully. We will review it and notify you once processed.',
        });
      } catch (e) {
        await transaction.rollback();
        console.error('Withdrawal request transaction failed:', e);

        return responserUtils(res, 400, {
          success: false,
          message: 'Something went wrong while creating the withdrawal request',
        });
      }
    } catch (error) {
      console.error('Withdrawal request creation failed:', error);

      return responserUtils(res, 500, {
        success: false,
        message: 'Something went wrong. Please try again later.',
      });
    }
  },


  // async create(req: Request, res: Response) {


  //   try {
  //     const userId = getUserByReqUtils(req)?.id;

  //     const currency = 'USDT'
  //     const reqData: IServiceResult<IWithdrawalRequest> = validate(createWithdrawalRequestSchema, { userId, currency, ...req?.body }, res);

  //     if (!reqData.ok) {
  //       return
  //     }


  //     const _userWallet: IServiceResult<IUserWallet> = await serviceUserWallet.getOne(reqData.data?.userWalletId!)
  //     console.log(_userWallet);

  //     if (!_userWallet.ok) {
  //       return responserUtils(res, 400, { success: false, message: 'Wallet Not Found' })

  //     }

  //     if (decimalGreaterThan(reqData.data?.amount!, _userWallet.data?.availableBalance!)) {
  //       return responserUtils(res, 400, { success: false, message: 'Insufficient Balance' })
  //     }


  //     const transaction = await sequelize.transaction();

  //     try {


  //       const createdItem: IServiceResult<IWithdrawalRequest> = await withdrawalRequestService.create(reqData.data, transaction);


  //       const _user_wallet_new_availableBalance = decimalMinus(_userWallet?.data?.availableBalance!, reqData?.data?.amount!)
  //       const _user_wallet_new_pendingBalance = decimalPlus(_userWallet?.data?.pendingBalance!, reqData?.data?.amount!)

  //       const newWall = { id: _userWallet.data?.id!, availableBalance: _user_wallet_new_availableBalance, pendingBalance: _user_wallet_new_pendingBalance }

  //       console.log(newWall);

  //       await serviceUserWallet.update(newWall, transaction)


  //       await transaction.commit()
  //       return responserUtils(res, 200, {
  //         success: true,
  //         message: 'Your withdrawal request has been submitted successfully. We will review it and notify you once processed.'

  //       })

  //     } catch (e) {
  //       await transaction.rollback()

  //       return responserUtils(res, 400, {
  //         success: false,
  //         message: 'Something went wrong while creating the withdrawal request'
  //       })

  //     }


  //   } catch (error) {

  //     return responserUtils(res, 500, { success: false, }, error)

  //   }
  // },

  async update(req: Request, res: Response) {
    const transaction = await sequelize.transaction();

    try {
      const _withDraw: IWithdrawalRequest = req.body;
      const userId = getUserByReqUtils(req)?.id;

      // Get existing withdrawal
      const existingWithdraw: IServiceResult<IWithdrawalRequest> =
        await withdrawalRequestService.getOne(_withDraw.id!,
       {
          transaction,
          lock: transaction.LOCK.UPDATE,
}
        );

      if (!existingWithdraw.ok || !existingWithdraw.data) {
        return responserUtils(res, 404, {
          success: false,
          message: 'Withdrawal request not found'
        });
      }

      // Finalized requests cannot be changed
      switch (existingWithdraw.data.status) {
        case 'cancelled':
        case 'completed':
        case 'rejected':
        case 'failed':
          return responserUtils(res, 400, {
            success: false,
            message: 'This request is finalized and CAN NOT be altered'
          });
      }

      // Start transaction

      try {
        /*
         * Update withdrawal request
         */
        const updatedItems: IServiceResult<IWithdrawalRequest> =
          await withdrawalRequestService.update(
            _withDraw,
            transaction
          );

        if (!updatedItems.ok) {
          throw new Error(
            updatedItems.message ?? 'Failed to update withdrawal request'
          );
        }

        /*
         * Get user wallet
         *
         * This is a read-only query, so it does not need
         * to use the transaction in the current design.
         */
        const _userWallet: IServiceResult<IUserWallet> =
          await serviceUserWallet.getOne(
            _withDraw.userWalletId!
          );

        if (!_userWallet.ok || !_userWallet.data) {
          throw new Error('User wallet not found');
        }

        /*
         * Handle balance changes according to withdrawal status
         */
        switch (_withDraw.status) {

          /*
           * Withdrawal rejected/cancelled:
           *
           * pendingBalance   -= amount
           * availableBalance += amount
           */
          case 'cancelled':
          case 'rejected': {
            const newPendingBalance = decimalMinus(
              _userWallet.data.pendingBalance!,
              _withDraw.amount!
            );

            const newAvailableBalance = decimalPlus(
              _userWallet.data.availableBalance!,
              _withDraw.amount!
            );

            await serviceUserWallet.update(
              {
                id: _userWallet.data.id!,
                availableBalance: newAvailableBalance,
                pendingBalance: newPendingBalance
              },
              transaction
            );

            break;
          }

          /*
           * Approved:
           *
           * No balance change.
           *
           * Money is already in pendingBalance.
           */
          case 'approved': {
            break;
          }

          /*
           * Completed:
           *
           * pendingBalance   -= amount
           * withdrawnAmount  += amount
           */
            
            
          case 'completed': {
            const newPendingBalance = decimalMinus(
              _userWallet.data.pendingBalance!,
              _withDraw.amount!
            );

            const newWithdrawnAmount = decimalPlus(
              _userWallet.data.withdrawnAmount!,
              _withDraw.amount!
            );

            console.log(newWithdrawnAmount, newPendingBalance);

            await serviceUserWallet.update(
              {
                id: _userWallet.data.id!,
                pendingBalance: newPendingBalance,
                withdrawnAmount: newWithdrawnAmount
              },
              transaction
            );


            const tr = {
              approverAgentId: userId!,
              fromWalletId: _withDraw.userWalletId,
              withdrawId: _withDraw.id,
              amount: _withDraw.amount
            }


            await transactionsService().create(tr, transaction)

            break;
          }

          /*
           * Processing:
           *
           * No balance change.
           */
          case 'processing': {
            break;
          }

          /*
           * These statuses should not be processed here.
           */
          case 'pending':
          case 'failed':
          default:
            throw new Error('Invalid withdrawal status');
        }

        /*
         * Everything succeeded.
         */
        await transaction.commit();

        return responserUtils(res, 200, {
          success: true,
          data: updatedItems.data
        });

      } catch (e) {

        /*
         * Any failure inside the transaction:
         * rollback withdrawal update + wallet update
         */
        await transaction.rollback();

        return responserUtils(res, 400, {
          success: false,
          message: 'Something went wrong while updating the withdrawal request'
        });
      }

    } catch (error) {

      return responserUtils(
        res,
        500,
        {
          success: false
        },
        error
      );
    }
  },

  // async update(req: Request, res: Response) {

  //   try {

  //     const _withDraw: IWithdrawalRequest = req.body

  //     const existingWithdraw: IServiceResult<IWithdrawalRequest> = await withdrawalRequestService.getOne(_withDraw.id!)

  //     switch (existingWithdraw.data!.status) {
  //       //refusing changing finalized requests

  //       case 'cancelled':
  //       case 'completed':
  //       case 'rejected':
  //       case 'failed':

  //         return responserUtils(res, 400, { success: true, message: 'This request is finalized and CAN NOT be altered' })
  //     }



  //     const transaction = await sequelize.transaction();



  //     try {

  //       const updatedItems = await withdrawalRequestService.update(_withDraw, transaction);


  //       const _userWallet: IServiceResult<IUserWallet> = await serviceUserWallet.getOne(_withDraw!?.userWalletId!)

  //       switch (_withDraw.status) {

  //         case 'cancelled':
  //         case 'rejected':



  //           const _user_wallet_new_pendingBalance = decimalMinus(_userWallet?.data?.pendingBalance!, _withDraw?.amount!)
  //           const _user_wallet_new_availableBalance = decimalPlus(_userWallet?.data?.availableBalance!, _withDraw?.amount!)


  //           await serviceUserWallet.update({ id: _userWallet.data?.id!, availableBalance: _user_wallet_new_availableBalance, pendingBalance: _user_wallet_new_pendingBalance })

  //           break;

  //         case 'approved':

  //           // take from pendingBalance and add it to availableBalance

  //           // const _UW_newPendingBalance2 = safeParseFloat(_userWallet?.data?.pendingBalance!) - safeParseFloat(_withDraw.amount!)

  //           // const _UW_newAvailableBalance2 = safeParseFloat(_userWallet?.data?.availableBalance!) + safeParseFloat(_withDraw.amount!)

  //           // serviceUserWallet.update({ id: _userWallet.data?.id!, availableBalance: _UW_newAvailableBalance2 })

  //           break;

  //         case 'completed':

  //           // take from availableBalance and add it to totalEarning and hereby the money it is also removed from our ecosystem
  //           // its stored in totalEarning only for reports

  //           const _UW_new_withdrawnAmount = decimalPlus(_userWallet?.data?.withdrawnAmount!, _withDraw.amount!)
  //           const _UW_new_pendingBalance = decimalMinus(_userWallet?.data?.pendingBalance!, _withDraw.amount!)

  //           await serviceUserWallet.update({ id: _userWallet.data?.id!, pendingBalance: _UW_new_pendingBalance, withdrawnAmount: _UW_new_withdrawnAmount }, transaction)

  //           break;



  //         case 'processing':
  //           break;


  //         case 'pending':
  //         case 'failed':
  //         default:
  //           await transaction.rollback()

  //           return responserUtils(res, 400, { success: false, message: 'Invalid request' })

  //         // const _deference = (safeParseFloat(_withDraw.amount!) - safeParseFloat(existingWithdraw.data?.amount))

  //         // const _UW_newPendingBalance3 = safeParseFloat(_userWallet?.data?.pendingBalance!) + _deference

  //         // serviceUserWallet.update({ id: _userWallet.data?.id!, pendingBalance: _UW_newPendingBalance3, })

  //       }



  //       await transaction.commit()
  //       return responserUtils(res, 200, { success: true, data: updatedItems.data })

  //     } catch (e) {
  //       await transaction.rollback()

  //       return responserUtils(res, 400, { success: false, })

  //     }

  //   } catch (error) {
  //     return responserUtils(res, 500, { success: false, }, error)
  //   }
  // },


  // {/*we dont have delete here 
  // we just update the status into cancel on user asked for delete*/}

  async delete(req: Request, res: Response) {

    try {

      const id = parseInt(req?.params.id || '0')
      console.log(id);

      const deletedItems = await withdrawalRequestService.delete(id);

      if (deletedItems.ok) {

        return responserUtils(res, 200, { success: true, message: `${deletedItems.data} items were deleted` })

      } else {

        return responserUtils(res, 400, { success: false, data: deletedItems.data })

      }


    } catch (error) {

      return responserUtils(res, 400, { success: false }, error)

    }
  }

}





