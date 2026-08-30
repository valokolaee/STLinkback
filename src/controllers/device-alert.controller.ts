import { Request, Response } from 'express';
import { models } from '../db/db';
import { createMiningWalletSchema, createWithdrawalRequestSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
 import { validate } from '../utils/validator.utils';
import getUserByReqUtils from '../utils/getUserByReq.utils';
import responser from '../utils/responser.utils';




const service = genericService(models.DeviceAlert)


export default {

  async getAll(req: Request, res: Response) {
    try {

      const items = await service.getAll();


      if (items.ok) {
        return responser(res, 200, { success: true, data: items.data })
      } else {
        return responser(res, 404, { success: false, })
      }


    } catch (error) {

      return responser(res, 500, { success: false, }, error)

    }
  },


  async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req?.params.id || '0')

      const items = await service.getOne(id)

      if (items.ok) {

        return responser(res, 200, { success: true, data: items.data })

      } else {

        return responser(res, 404, { success: false, })

      }

    } catch (error) {

      return responser(res, 500, { success: false, }, error)

    }
  },

  async getAllBy(req: Request, res: Response) {
    try {

      const userId = req.body.userId

      const items = await service.getAllBy({ userId });

      if (items.ok) {
        return responser(res, 200, { success: true, data: items.data })
      } else {
        return responser(res, 404, { success: false, })
      }

    } catch (error) {

      return responser(res, 500, { success: false, }, error)

    }
  },

  async create(req: Request, res: Response) {

    try {
      const userId = getUserByReqUtils(req)?.id;

      const data = validate(createWithdrawalRequestSchema, { userId, ...req?.body }, res);

      if (!data.ok) {
        return
      }

      const createdItem = await service.create(data.data);


      if (createdItem.ok) {

        return responser(res, 200, { success: true, data: createdItem.data })

      } else {

        return responser(res, 400, { success: false, data: createdItem.data })

      }

    } catch (error) {

      return responser(res, 500, { success: false, }, error)

    }
  },

  async update(req: Request, res: Response) {

    try {

      const w = req.body

      const updatedItems = await service.update(w);

      if (updatedItems.ok) {

        return responser(res, 200, { success: true, data: updatedItems.data })

      } else {

        return responser(res, 400, { success: false, data: updatedItems.data })

      }

    } catch (error) {
      return responser(res, 500, { success: false, }, error)
    }
  },

  async delete(req: Request, res: Response) {

    try {

      const id = parseInt(req?.params.id || '0')

      const deletedItems = await service.delete(id);

      if (deletedItems.ok) {

        return responser(res, 200, { success: true, message: `${deletedItems.data} items were deleted` })

      } else {

        return responser(res, 400, { success: false, data: deletedItems.data })

      }


    } catch (error) {

      return responser(res, 400, { success: false }, error)

    }
  }

}