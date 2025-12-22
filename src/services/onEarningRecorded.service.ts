//src/services/onEarningRecorded.service.ts

import { DATE, Model, ModelStatic } from 'sequelize';
import { models } from '../db';
import MiningSession, { IMiningSession } from '../models/mining-session.model';
import { safeParseFloat } from '../utils/math.utils';
import genericService from './generic.service';
import MiningWallet, { IMiningWallet } from '../models/mining-wallet.model';
import MiningDevice, { IMiningDevice } from '../models/mining-device.model';

class OnEarningRecordedService {
  async updateWallet(wallet: MiningWallet, device: MiningDevice, amount: number, session: MiningSession) {
    // const wallet = await models.MiningWallet.findByPk(walletId);
    if (!wallet) throw new Error('Wallet not found');

    const newAvailableBalance = safeParseFloat(wallet.availableBalance) + safeParseFloat(amount);
    const newTotalEarnings = safeParseFloat(wallet.totalEarnings) + safeParseFloat(amount);
    const newSessionEarnings = safeParseFloat(session.earnings) + safeParseFloat(amount);




    await device.update({
      updatedAt: new Date()
    } as IMiningDevice)

    await session.update({
      sessionEnd: new Date(),
      earnings: newSessionEarnings,
    } as IMiningSession)


    await wallet.update({
      availableBalance: newAvailableBalance,
      totalEarnings: newTotalEarnings,
      lastUpdated: new Date(),
    });



  }
}

export default new OnEarningRecordedService();