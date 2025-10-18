import serviceResponser from '../utils/serviceResponser.utils';



export default (model: any) => {

  return {

    async getAll() {
      try {

        const items = await model.findAll();

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

    async getAllBy(foreignKey: object) {

      try {
        const items = await model.findAll({ where: foreignKey });

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