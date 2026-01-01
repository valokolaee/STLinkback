import { Model, ModelStatic, Order, WhereOptions } from 'sequelize';
import serviceResponser from '../utils/serviceResponser.utils';



export default (model: ModelStatic<Model>) => {

  return {

    async getAll(
        order?: Order
      
    ) {
      try {

        const items = await model.findAll({order});

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

    async getAllBy(foreignKey: WhereOptions<any>, order?: Order, limit?: number,) {

      try {
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

    async findOne(foreignKey: WhereOptions<any>) {

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