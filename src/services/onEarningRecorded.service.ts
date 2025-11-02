//src/services/onEarningRecorded.service.ts

import { models } from '../db';
import MiningSession, { IMiningSession } from '../models/mining-session.model';
import { safeParseFloat } from '../utils/math.utils';
import genericService from './generic.service';

class OnEarningRecordedService {
  async updateWallet(walletId: number, amount: number, session: MiningSession) {
    const wallet = await models.MiningWallet.findByPk(walletId);
    if (!wallet) throw new Error('Wallet not found');

    const newAvailableBalance = safeParseFloat(wallet.availableBalance) + safeParseFloat(amount);
    const newTotalEarnings = safeParseFloat(wallet.totalEarnings) + safeParseFloat(amount);
    const newSessionEarnings = safeParseFloat(session.earnings) + safeParseFloat(amount);



    

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