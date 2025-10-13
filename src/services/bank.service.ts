// src/services/bank.service.ts
import { models } from '../db';

interface CreateBankData {
  name: string;
  profit: string;
  userId: number;
  logo?: string;
  level?: string;
  desc?: string;
  has_loan?: boolean;
  value_json?: any;
  csv_url?: string;
}

interface UpdateBankData {
  name?: string;
  profit?: string;
  logo?: string;
  level?: string;
  desc?: string;
  has_loan?: boolean;
  value_json?: any;
  csv_url?: string;
}

export class BankService {
  static async getAllBanks() {
    try {
      const banks = await models.Bank.findAll({
        include: [{ model: models.User, as: 'owner', attributes: ['username'] }]
      });
      return banks.map(bank => bank.get({ plain: true }));
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  static async getBankById(id: number) {
    try {
      const bank = await models.Bank.findByPk(id, {
        include: [{ model: models.User, as: 'owner', attributes: ['username'] }]
      });
      return bank ? bank.get({ plain: true }) : null;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  static async createBank(data: CreateBankData) { 
    try {
      const { userId, ...bankData } = data; 
      
      const bank = await models.Bank.create({
        ...bankData,
        userId: userId, 
        updated_at: new Date(),
      });

      return bank.get({ plain: true });
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }
  // 

  static async updateBank(id: number, data: UpdateBankData, userId?: number) {
    try {
      const bank = await models.Bank.findByPk(id);
      
      if (!bank) {
        return null;
      }
  
      // if (userId && bank.userId !== userId) {
      //   return null;
      // }
  
      await bank.update({
        ...data,
        updated_at: new Date(),
      });
  
      return bank.get({ plain: true });
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }
  static async deleteBank(id: number, userId?: number) {
    try {
      const bank = await models.Bank.findByPk(id);
      
      if (!bank) {
        return false;
      }

      if (userId && bank.userId !== userId) {
        return false;
      }

      await bank.destroy();
      return true;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }
}