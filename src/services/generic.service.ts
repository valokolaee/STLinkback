import { Model, ModelStatic, Order, WhereOptions } from 'sequelize';
import serviceResponser from '../utils/serviceResponser.utils';
import buildWhereClause from '../utils/buildWhereClause';



export default (model: ModelStatic<Model>) => {

  return {

    async getAll(
      order?: Order

    ) {
      try {

        const items = await model.findAll({ order });

        return serviceResponser({ ok: true, data: items })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }
    },


    async getOne(id: number) {

      try {

        const item = await model.findByPk(id)

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


    async create(object: any) {

      try {
        const item = await model.create(object);

        return serviceResponser({ ok: true, data: item })

      } catch (error) {

        return serviceResponser({ ok: false }, error)

      }

    },

    async update(object: any) {
      console.log(object);

      try {

        const numOfUpdated = await model.update(object, { where: { id: object.id } });

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