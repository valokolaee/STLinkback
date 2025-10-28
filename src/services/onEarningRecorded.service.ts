//src/services/onEarningRecorded.service.ts

import { models } from '../db';
import MiningSession, { IMiningSession } from '../models/mining-session.model';
import genericService from './generic.service';

class OnEarningRecordedService {
  async updateWallet(walletId: number, amount: number,session: MiningSession) {
    const wallet = await models.MiningWallet.findByPk(walletId);
    if (!wallet) throw new Error('Wallet not found');

    const newAvailableBalance = (wallet.availableBalance || 0) + amount;
    const newTotalEarnings = (wallet.totalEarnings || 0) + amount;
    const newSessionEarnings = (session.earnings || 0) + amount;




    await genericService(models.MiningSession).update({
      id: session.id,
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