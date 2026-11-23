import { models } from '../db/db';
import serviceResponser from '../utils/serviceResponser.utils';


export default {



  async getOneByAddress(walletAddress: string) {

    try {
      const devices = await models.DeviceEarningPot.findOne({ where: { walletAddress } })

      return serviceResponser({
        ok: true,
        data: devices
      })
    } catch (error) {

      return serviceResponser({
        ok: true,
        data: error
      })
    }

  }


}