import { Request, Response } from 'express';
import { sequelize } from '../../db/db';
import { IDeviceAffiliate } from '../../db/models/device-affiliate.model';
import { IMiningDevice } from '../../db/models/mining-device.model';
import { createDeviceAffiliateSchema } from '../../dtos/dto';
import IResponse from '../../interfaces/IResponse';
import IServiceResult from '../../interfaces/IServiceResult';
import deviceAffiliateService from '../../services/deviceAffiliate.service';
import DeviceEarningPotService from '../../services/DeviceEarningPot.service';
import getUserByReq from '../../utils/getUserByReq.utils';
import responserUtils from '../../utils/responser.utils';
import statusCalculator from '../../utils/statusCalculator';
import { validate } from '../../utils/validator.utils';
import totalPercent from './totalPercent';
import meLog from '../../utils/meLog';




const serviceDeviceAffiliate = deviceAffiliateService()
const serviceDeviceEarningPot = DeviceEarningPotService()


export default {

  async getAll(req: Request, res: Response) {


    try {

      const devices: IServiceResult<IMiningDevice[]> = await serviceDeviceAffiliate.getAll();


      if (devices.ok) {
        var _devs: IMiningDevice[] = []

        devices?.data?.forEach(element => {

          _devs.push({
            ...element.dataValues,
            status: statusCalculator(element.updatedAt!) // (dateDifference(new Date(), element.updatedAt) > 300 || dateDifference(new Date(), element.updatedAt) < 0) ? 'offline' : 'active'
          })
        });


        return responserUtils(res, 200, {
          success: true,
          data: _devs// devices.data
        })

      } else {

        return responserUtils(res, 404, {
          success: false,
        })

      }

    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  },



  async getOne(req: Request, res: Response) {

 
    try {
      const id = parseInt(req?.params.id || '0')

      const devices = await serviceDeviceAffiliate.getOne(id);

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
    // console.log(req.body);
    try {
      const allAffiliates = await serviceDeviceAffiliate.getAllBy(req.body.potAssignmentId)


      if (allAffiliates.ok) {
        return responserUtils(res, 200, {
          success: true,
          data: allAffiliates.data
        })
      } else {
        return responserUtils(res, 404, {
          success: false,
        })

      }

    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  },

  async create(req: Request, res: Response) {

    const creatorId = getUserByReq(req)?.id


    const transaction = await sequelize.transaction();



    try {

      const b = { ...req?.body, affiliateId: req?.body?.affiliateId }
      const data = validate(createDeviceAffiliateSchema, b, res);

      if (!data.ok) {
        return
      }

      const reqBody = req?.body;
      const { affiliateId, potAssignmentId, percent } = reqBody || reqBody

      /* fetching all affiliates of the device  */

      const thisAffiliates = await serviceDeviceAffiliate.findOne({ affiliateId, potAssignmentId })//if this user is already an affiliate of this device
      // console.log(1);

      if (thisAffiliates.ok) {

        return responserUtils(res, 400, {
          success: false,
          message: 'this user already added',
          data: thisAffiliates.data
        })

      }

      // const allAffiliates = await serviceDeviceAffiliate.getAllBy(potAssignmentId)

      // const total = allAffiliates?.data?.reduce((sum: number, item: IDeviceAffiliate) => sum + item.percent!, 0);

      const total = await (await totalPercent(potAssignmentId)).total
      if (total >= 100 || (parseInt(percent || '0') + total) > 100) {

        return responserUtils(res, 400, {
          success: false,
          message: 'resources not enough'
        })

      }

      //check if affiliateId is owner





      //check if user has  affiliate pot
      var clientsPot = await serviceDeviceEarningPot.findOne({ userId: affiliateId, recType: "affiliate" })

      if (!clientsPot.ok) {
        clientsPot = await serviceDeviceEarningPot.create({ recType: 'affiliate', userId: affiliateId }, transaction)
      }

      if (clientsPot.ok) {

        const createdAffiliate = await serviceDeviceAffiliate.create({ ...reqBody, creatorId, potId: clientsPot.data.id }, transaction)

        if (createdAffiliate.ok) {
          console.log(3);

          await transaction.commit()

          return responserUtils(res, 200, {
            success: true,
            message: clientsPot.message,
            data: createdAffiliate.data
          })

        } else {

          throw new Error(createdAffiliate?.message);

        }


      } else {

        throw new Error(clientsPot?.message);

      }

    } catch (error: any) {
      // console.log(error);

      await transaction.rollback()


      return responserUtils(res, 400, {
        success: false,
        message: error.message || 'we regret to inform fail'
      })

    }
  },

  async update(req: Request, res: Response) {
    console.log(req.body);

    try {

      const reqBody = req?.body;
      const { id, affiliateId, potAssignmentId, percent } = reqBody || {}

      /* fetching all affiliates of the device  */

      const total = await (await totalPercent(potAssignmentId)).total

      if (total >= 100 || (parseInt(percent || '0') + total) > 100) {

        return responserUtils(res, 400, {
          success: false,
          message: 'resources not enough'
        })

      } else {

        const allAffiliates = await serviceDeviceAffiliate.update(id, reqBody);

        return responserUtils(res, 200, {
          success: true,
          message: allAffiliates.message,
          data: allAffiliates.data
        })

      }



    } catch (error) {


      return responserUtils(res, 500, {
        success: false,
        // message: error
      })
    }
  },


  async delete(req: Request, res: Response) {
    // console.log('info',typeof req?.params.id);

    try {

      const id = parseInt(req?.params.id || '0')


      const deletedDevice = await serviceDeviceAffiliate.delete(id);

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