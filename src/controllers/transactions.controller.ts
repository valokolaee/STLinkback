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
import { error, log } from 'console';
import statusCalculator from '../utils/statusCalculator';
import Transaction, { ITransaction } from '../db/models/transaction.model';
import TransactionsService from '../services/transactions.service';
import UserWallet from '../db/models/user-wallet.model';
import { decimalLessThan, decimalMinus } from '../utils/decimal.utils';
import serviceResponserUtils from '../utils/serviceResponser.utils';




const transactionsService = TransactionsService()
const miningDeviceService = MiningDeviceService()
const serviceDeviceEarningPot = genericService(DeviceEarningPot)
const serviceDeviceJoinPot = genericService(DevicePotAssignment)
const serviceTransaction = genericService(Transaction)

export default {

  async getAll(req: Request, res: Response) {
    try {

      const _transactions: IServiceResult<ITransaction[]> = await transactionsService.getAll();
      return responserUtils(res, 200, { success: true, data: _transactions.data })

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

      const t = req.body


      const _transactions: IServiceResult<ITransaction[]> = await transactionsService.getAllBy(t);


      if (_transactions.ok) {

        return responserUtils(res, 200, {
          success: true,
          data: _transactions.data
        })

      } else {

        return responserUtils(res, 400, {
          success: false,
        })

      }

    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  },


  // Transactioncontroller.fixed · TS
  async create(req: Request, res: Response) {
    const transaction = await sequelize.transaction();

    try {
      const object: ITransaction = req?.body;
      const { fromDevicePotId, fromWalletId, toWalletId, amount } = object || {};

      // ---- Input validation ----
      if (!amount || Number(amount) <= 0) {
        await transaction.rollback();
        return responserUtils(res, 400, {
          success: false,
          message: "A valid positive amount is required",
        });
      }

      if (fromDevicePotId! > 0 && fromWalletId! > 0) {
        await transaction.rollback();
        return responserUtils(res, 400, {
          success: false,
          message: "2 Sources not allowed",
        });
      }

      if (!fromDevicePotId && !fromWalletId) {
        await transaction.rollback();
        return responserUtils(res, 400, {
          success: false,
          message: "A source (wallet or pot) is required",
        });
      }

      if (fromWalletId && fromWalletId === toWalletId) {
        await transaction.rollback();
        return responserUtils(res, 400, {
          success: false,
          message: "Source and destination wallets cannot be the same.",
        });
      }

      // ---- Wallet-sourced transfer ----
      if (fromWalletId) {
        // Lock the row for the duration of this transaction to prevent
        // concurrent requests from reading a stale balance (TOCTOU race).
        const fromWallet = await UserWallet.findByPk(fromWalletId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!fromWallet) {
          await transaction.rollback();
          return responserUtils(res, 400, {
            success: false,
            message: "Source wallet not found",
          });
        }

        if (decimalLessThan(fromWallet.availableBalance, amount)) {
          await transaction.rollback();
          return responserUtils(res, 400, {
            success: false,
            message: "Insufficient balance",
          });
        }

        const createdTransaction: IServiceResult<ITransaction> =
          await transactionsService.create(
            { ...req.body, toWalletType: "" },
            transaction
          );

        if (!createdTransaction.ok) {
          await transaction.rollback();
          return responserUtils(res, 400, {
            success: false,
            message: createdTransaction.message,
          });
        }

        const fromWalletBalance = decimalMinus(fromWallet.availableBalance, amount);
        await fromWallet.update(
          { availableBalance: fromWalletBalance },
          { transaction }
        );

        await transaction.commit();

        return responserUtils(res, 200, {
          data: createdTransaction.data,
          success: true,
          message: "created Transaction",
        });
      }

      // ---- Pot-sourced transfer ----
      if (fromDevicePotId) {
        const fromPot = await DeviceEarningPot.findByPk(fromDevicePotId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!fromPot) {
          await transaction.rollback();
          return responserUtils(res, 400, {
            success: false,
            message: "Source pot not found",
          });
        }

        if (decimalLessThan(fromPot.availableBalance, amount)) {
          await transaction.rollback();
          return responserUtils(res, 400, {
            success: false,
            message: "Insufficient balance",
          });
        }

        const createdTransaction: IServiceResult<ITransaction> =
          await transactionsService.create(
            { ...req.body, toWalletType: "" },
            transaction
          );

        if (!createdTransaction.ok) {
          await transaction.rollback();
          return responserUtils(res, 400, {
            success: false,
            message: createdTransaction.message,
          });
        }

        const fromPotBalance = decimalMinus(fromPot.availableBalance, amount);
        await fromPot.update({ availableBalance: fromPotBalance }, { transaction });

        await transaction.commit();

        return responserUtils(res, 200, {
          data: createdTransaction.data,
          success: true,
          message: "created Transaction",
        });
      }
    } catch (error) {
      await transaction.rollback();

      // Log the real error server-side; never swallow it silently.
      console.error("Transaction creation failed:", error);

      return responserUtils(res, 400, {
        success: false,
        message: "we regret to inform fail",
      });
    }
  },


  // async create(req: Request, res: Response) {
  //   const transaction = await sequelize.transaction()

  //   try {

  //     const object: ITransaction = req?.body;


  //     const { fromDevicePotId, fromWalletId, toWalletId, amount } = object || {}

  //     if (fromDevicePotId! > 0 && fromWalletId! > 0) {
  //       return responserUtils(res, 400, {
  //         success: false,
  //         message: "2 Sources not allowed"
  //       })

  //     } else if (fromWalletId === toWalletId) {
  //       return responserUtils(res, 400, {
  //         success: false,
  //         message: "Source and destination wallets cannot be the same."
  //       })
  //     }


  //     const fromWallet = await UserWallet.findByPk(fromWalletId)

  //     if (decimalLessThan(fromWallet?.availableBalance!, amount!)) {
  //       transaction.rollback()
  //       return responserUtils(res, 400, { success: false, message: 'Insufficient balance' })
  //     }


  //     const createdTransaction: IServiceResult<ITransaction> = await transactionsService.create({ ...req.body, toWalletType: '', }, transaction);


  //     if (createdTransaction.ok) {

  //       const fromWalletBalance = decimalMinus(fromWallet?.availableBalance!, amount!)
  //       await fromWallet?.update({ availableBalance: fromWalletBalance }, { transaction })

  //       await transaction.commit();


  //       return responserUtils(res, 200, {
  //         data: createdTransaction.data,
  //         success: true,
  //         message: 'created Transaction'
  //       })

  //     } else {
  //       throw error(createdTransaction.message)
  //       // return responserUtils(res, 400, {
  //       //   success: false,
  //       //   message: createdTransaction.message
  //       // })

  //     }


  //   } catch (error) {


  //     await transaction.rollback();

  //     return responserUtils(res, 400, {
  //       success: false,
  //       message: 'we regret to inform fail'
  //     })

  //     // return res.status(500).json({
  //     //   success: false,
  //     // });

  //   }
  // },

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