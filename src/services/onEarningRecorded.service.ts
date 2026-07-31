//src/services/onEarningRecorded.service.ts

import { DATE, Model, ModelStatic } from 'sequelize';
import { models } from '../db/db';
import MiningSession, { IMiningSession } from '../db/models/mining-session.model';
import { safeParseFloat } from '../utils/math.utils';
import genericService from './generic.service';
import DeviceEarningPot, { IDeviceEarningPot } from '../db/models/device-earning-pot.model';
import MiningDevice, { IMiningDevice } from '../db/models/mining-device.model';

class OnEarningRecordedService {
  async updateWallet(pot: DeviceEarningPot, device: MiningDevice, amount: number, session: MiningSession) {

    if (!pot) throw new Error('Wallet not found');

    const newAvailableBalance = safeParseFloat(pot.availableBalance) + safeParseFloat(amount);
    const newTotalEarnings = safeParseFloat(pot.totalEarnings) + safeParseFloat(amount);
    const newSessionEarnings = safeParseFloat(session.earnings) + safeParseFloat(amount);




    await device.update({
      updatedAt: new Date()
    } as IMiningDevice)

    await session.update({
      sessionEnd: new Date(),
      earnings: newSessionEarnings,
    } as IMiningSession)


    await pot.update({
      availableBalance: newAvailableBalance,
      totalEarnings: newTotalEarnings,
      lastUpdated: new Date(),
    });



  }
}

export default new OnEarningRecordedService();