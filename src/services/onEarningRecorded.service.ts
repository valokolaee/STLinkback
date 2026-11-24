//src/services/onEarningRecorded.service.ts

import DeviceEarningPot from '../db/models/device-earning-pot.model';
import MiningDevice from '../db/models/mining-device.model';
import MiningSession, { IMiningSession } from '../db/models/mining-session.model';
import { safeParseFloat } from '../utils/math.utils';
import deviceService from './device.service';
import distributer from './distributer';

class OnEarningRecordedService {
  async updateWallet(pot: DeviceEarningPot, device: MiningDevice, amount: number, session: MiningSession, ipAddress?: string) {

    if (!pot) throw new Error('Wallet not found');

    const newSessionEarnings = safeParseFloat(session.earnings) + safeParseFloat(amount);


    await session.update({
      sessionEnd: new Date(),
      earnings: newSessionEarnings,
    } as IMiningSession)


    await deviceService.update({
      id: device.id,
      ipAddress,
      updatedAt: new Date()
    });



    // TODO distribute earnings

    distributer(pot, amount)



  }
}

export default new OnEarningRecordedService();