import { Includeable, Model, ModelStatic, Op, Order, TransactionOptions, WhereOptions } from 'sequelize';
import serviceResponser from '../utils/serviceResponser.utils';
import buildWhereClause from '../utils/buildWhereClause';
import MiningDevice, { IMiningDevice } from '../db/models/mining-device.model';
import DeviceEarningPot from '../db/models/device-earning-pot.model';
import { log } from 'console';
import DevicePotAssignment from '../db/models/device-pot-assignment';
import User from '../db/models/user.model';
import Transaction, { ITransaction } from '../db/models/transaction.model';
import UserWallet from '../db/models/user-wallet.model';
import { sequelize } from '../db/db';
import { decimalLessThan, decimalMinus, decimalPlus } from '../utils/decimalConvertor';


const transactionModel: ModelStatic<Model> = Transaction
export default () => {

  return {

    async getAll() {
      try {

        const items = await transactionModel.findAll({

        },);



        return serviceResponser({ ok: true, data: items })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }
    },


    async getOne(id: number) {

      try {

        const item = await transactionModel.findByPk(id, {
          include: [
            {
              model: DeviceEarningPot,
              as: 'currentPot'
            }
          ],

          raw: true,
          nest: true,

        }) as IMiningDevice


        return serviceResponser({ ok: true, data: item })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },

    async getAllBy(t: ITransaction) {
      const { fromDevicePotId, fromWalletId, toWalletId } = t || {}
      var where = {}
      var include: Includeable[] = [
        {
          model: UserWallet,
          as: 'toUserWallet'
        },
        {
          model: UserWallet,
          as: 'fromUserWallet'
        },
        {
          model: DeviceEarningPot,
          as: 'fromDevicePot',
          include: [
            {
              model: DevicePotAssignment,
              as: 'potAssignment',
              include: [
                {
                  model: MiningDevice,
                  as: 'device'
                }
              ]
            }
          ]
        }

      ]



      if (fromDevicePotId) {

        where = { fromDevicePotId }

      } else {

        where = {
          [Op.or]: [
            { fromWalletId },
            { toWalletId },
          ],
        }
      };



      try {

        const devices = await Transaction.findAll({ where, include, order: [['createdAt', 'DESC']] });


        return serviceResponser({ ok: true, data: devices })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },

    async findOne<T = any>(foreignKey: WhereOptions<T>) {

      try {
        const items = await transactionModel.findOne({
          where: { ...foreignKey, softDeleted: 0 },
        });

        return serviceResponser({ ok: true, data: items })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },


    async create(object: ITransaction, tr?: TransactionOptions) {

      const transaction = await sequelize.transaction()


      try {

        const { fromDevicePotId, fromWalletId, toWalletId, amount } = object || {}



        if (fromDevicePotId! > 0) {

          const pot = await DeviceEarningPot.findByPk(fromDevicePotId)

          if (decimalLessThan(pot?.availableBalance!, amount!)) {
            return serviceResponser({ ok: false, data: 'Insufficient balance' })
          }

          const potBalance = decimalMinus(pot?.availableBalance!, amount!)
          await pot?.update({ availableBalance: potBalance }, { transaction })

        } else {

          const fromWallet = await UserWallet.findByPk(fromWalletId)
          if (decimalLessThan(fromWallet?.availableBalance!, amount!)) {
            return serviceResponser({ ok: false, message: 'Insufficient balance' })
          }

          const fromWalletBalance = decimalMinus(fromWallet?.availableBalance!, amount!)
          await fromWallet?.update({ availableBalance: fromWalletBalance }, { transaction })

// device wallet changed to pot with assignment and transactions between 
        }



        const destWallet = await UserWallet.findByPk(toWalletId)
        const destWalletBalance = decimalPlus(destWallet?.availableBalance!, amount!)
        await destWallet?.update({ availableBalance: destWalletBalance }, { transaction })


        const item = await Transaction.create(object as any, { transaction });

        await transaction.commit()
        return serviceResponser({ ok: true, data: item })

      } catch (error) {
        await transaction.rollback()

        return serviceResponser({ ok: false }, error)

      }

    },

    async update(object: any, tr?: TransactionOptions) {
      console.log('object', object);

      try {

        const numOfUpdated = await transactionModel.update(object, { where: { id: object.id } });

        return serviceResponser({ ok: true, data: numOfUpdated })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },


    async delete(id: number) {
      try {

        const numberOfDeleted = await this.update({ id, softDeleted: true })

        return numberOfDeleted

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    }

  }

}


// function buildWhereClause<T>(
//   filters: WhereOptions<T>
// ): WhereOptions<T> {
//   const where: Partial<T> = {};

//   Object.keys(filters).forEach((key) => {
//     const value = filters[key as keyof WhereOptions<T>];
//     if (value !== undefined && value !== null) {
//       where[key as keyof T] = value;
//     }
//   });

//   return where as WhereOptions;
// }