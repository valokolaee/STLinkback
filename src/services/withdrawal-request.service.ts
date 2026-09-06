import { log } from 'console';
import { Model, ModelStatic, Order, Transaction, WhereOptions } from 'sequelize';
import UserWallet from '../db/models/user-wallet.model';
import buildWhereClause from '../utils/buildWhereClause';
import serviceResponser from '../utils/serviceResponser.utils';
import WithdrawalRequest from '../db/models/withdrawal-request.model';
import User from '../db/models/user.model';



export default () => {
  const model = WithdrawalRequest;
  return {

    async getAll(
      order?: Order

    ) {
      try {

        const items = await model.findAll(
          {
            order,
            include: [
              {
                model: UserWallet,
                as: 'userWallet'
              },
              {
                model: User,
                as: 'owner'
              }
            ]
          },

        );

        return serviceResponser({ ok: true, data: items })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }
    },


    async getOne(id: number, options?: { transaction?: Transaction; lock?: boolean | Transaction['LOCK'][keyof Transaction['LOCK']] }) {

      try {

        const item = await model.findByPk(id,options)

        return serviceResponser({ ok: true, data: item })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },

    async getAllBy<T = any>(foreignKey: WhereOptions<T>, order?: Order, limit?: number,) {

      try {
        foreignKey = buildWhereClause<T>(foreignKey)
        console.log(foreignKey);

        const items = await model.findAll({
          where: { ...foreignKey, softDeleted: 0 },
          order,
          limit,
          include: [{
            model: UserWallet,
            as: 'userWallet'
          }
          ]

        });








        return serviceResponser({ ok: true, data: items })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },

    async findOne<T = any>(foreignKey: WhereOptions<T>) {

      try {
        const items = await model.findOne({
          where: { ...foreignKey, softDeleted: 0 },
        });

        return serviceResponser({ ok: true, data: items })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },


    async create(object: any, transaction?: Transaction) {

      try {
        const item = await model.create(object, { transaction });

        return serviceResponser({ ok: true, data: item })

      } catch (error) {
        log(error)
        return serviceResponser({ ok: false }, error)

      }

    },


    async update(object: any, transaction?: Transaction) {
      try {
        const numOfUpdated = await model.update(
          object,
          { where: { id: object.id }, transaction },
        );

        return serviceResponser({ ok: true, data: numOfUpdated });

      } catch (error) {
        return serviceResponser({ ok: false }, error);
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