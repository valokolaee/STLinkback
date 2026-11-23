import { Model, ModelStatic, Order, Transaction, WhereOptions } from 'sequelize';
import serviceResponser from '../utils/serviceResponser.utils';
import buildWhereClause from '../utils/buildWhereClause';
import MiningDevice, { IMiningDevice } from '../db/models/mining-device.model';
import DeviceEarningPot from '../db/models/device-earning-pot.model';
import { log } from 'console';
import DevicePotAssignment from '../db/models/device-pot-assignment';
import User from '../db/models/user.model';
import DeviceAffiliate from '../db/models/device-affiliate.model';


const deviceAffiliateAssignment: ModelStatic<Model> = DeviceAffiliate
export default () => {

  return {

    async getAll(order?: Order) {
      try {

        const items = await deviceAffiliateAssignment.findAll({
          order,
          include: [
            {
              model: DeviceEarningPot,
              as: 'currentPot',
              required: true,
              where: {
                // userId,
                softDeleted: false,
              },
              include: [
                {
                  model: User,
                  as: 'owner'
                }
              ]


            },
          ],

        },);








        return serviceResponser({ ok: true, data: items })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }
    },


    async getOne(id: number) {

      try {

        const item = await deviceAffiliateAssignment.findByPk(id, {
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

    async getAllBy(potAssignmentId: number) {

      try {

        const devices = await DeviceAffiliate.findAll({

          where: {
            potAssignmentId,
            softDeleted: false,
          },

          include: [
            { model: User, as: 'affiliate', },
            { model: DeviceEarningPot, as: 'pot', },
          ],
          raw: true,
          nest: true,
        });


        return serviceResponser({ ok: true, data: devices })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },

    async findOne<T = any>(foreignKey: WhereOptions<T>) {

      try {

        const items = await deviceAffiliateAssignment.findOne({
          where: { ...foreignKey, softDeleted: 0 },
        });

        if (items?.dataValues?.id > 0) {

          return serviceResponser({ ok: true, data: items })

        } else {

          return serviceResponser({ ok: false, })

        }

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },


    async create(object: any, transaction?: Transaction) {

      try {
        const item = await deviceAffiliateAssignment.create(object, { transaction });

        return serviceResponser({ ok: true, data: item })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },

    async update(id: number, object: Partial<DeviceAffiliate>, transaction?: Transaction) {

      try {

        const numOfUpdated = await DeviceAffiliate.update(object, {
          where: { id },
          transaction,
        });

        return serviceResponser({ ok: true, data: numOfUpdated })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },


    async delete(id: number, transaction?: Transaction) {
      try {

        const numOfUpdated = await deviceAffiliateAssignment.update({ softDeleted: true }, {

          transaction,
          where: { id }
        });

        return serviceResponser({
          ok: true,
          data: numOfUpdated
        },)

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