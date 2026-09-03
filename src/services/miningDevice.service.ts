import { Model, ModelStatic, Order, Transaction, WhereOptions } from 'sequelize';
import serviceResponser from '../utils/serviceResponser.utils';
import buildWhereClause from '../utils/buildWhereClause';
import MiningDevice, { IMiningDevice } from '../db/models/mining-device.model';
import DeviceEarningPot from '../db/models/device-earning-pot.model';
import { log } from 'console';
import DevicePotAssignment from '../db/models/device-pot-assignment';
import User from '../db/models/user.model';


const miningDevice: ModelStatic<Model> = MiningDevice
export default () => {

  return {

    async getAll(
      order?: Order

    ) {
      try {

        const items = await miningDevice.findAll({
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

        const item = await miningDevice.findByPk(id, {
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

    async getAllBy(userId: number) {

      try {

        const devices = await MiningDevice.findAll({
          include: [
            {
              model: DevicePotAssignment,
              as: 'assignments',
              required: true,
              where: {
                unassignedAt: null,
                softDeleted: false,
              },
              include: [
                {
                  model: DeviceEarningPot,
                  as: 'pot',
                  required: true,
                  where: {
                    userId,
                    softDeleted: false,
                  },
                },
              ],
            },
          ],
        });


        return serviceResponser({ ok: true, data: devices })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },

    async findOne<T = any>(foreignKey: WhereOptions<T>) {

      try {
        const items = await miningDevice.findOne({
          where: { ...foreignKey, softDeleted: 0 },
        });

        return serviceResponser({ ok: true, data: items })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },


    async create(object: any, transaction?: Transaction) {

      try {
        const item = await miningDevice.create(object, {transaction});

        return serviceResponser({ ok: true, data: item })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },

    async update(object: any, transaction?: Transaction) {
      console.log('object', object);

      try {

        const numOfUpdated = await miningDevice.update(object, { where: { id: object.id } });

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