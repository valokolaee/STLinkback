import { models } from '../db/db';
import { IMiningDevice } from '../db/models/mining-device.model';
import serviceResponser from '../utils/serviceResponser.utils';
import genericService from './generic.service';


export default {



  async getOneByAddress(walletAddress: string) {

    try {

      const devices = await models.UserWallet.findOne({ where: { walletAddress } })

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