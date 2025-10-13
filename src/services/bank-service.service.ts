// src/services/bank-service.service.ts
import { models } from '../db';

interface CreateBankServiceData {
  bankId: number;
  key: string;
  value: string;
  userId: number;
}

interface UpdateBankServiceData {
  bankId: number;
  serviceId: number;
  key?: string;
  value?: string;
  userId: number;
}

interface DeleteBankServiceData {
  bankId: number;
  serviceId: number;
  userId: number;
}

export class BankServiceService {
  static async getBankServices(bankId: number) {
    try {
      const bank = await models.Bank.findByPk(bankId);
      if (!bank) {
        throw new Error('Bank not found');
      }

      const services = await models.BankService.findAll({
        where: { bankId },
        order: [['id', 'ASC']],
      });

      return services.map(service => service.get({ plain: true }));
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  static async createBankService(data: CreateBankServiceData) { 
    try {
      const { bankId, key, value, userId } = data; 

      const bank = await models.Bank.findByPk(bankId);
      if (!bank) {
        throw new Error('Bank not found');
      }

      if (bank.userId !== userId) {
        throw new Error('Access denied');
      }

      const service = await models.BankService.create({
        bankId,
        key,
        value,
      });

      return service.get({ plain: true });
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  static async updateBankService(data: UpdateBankServiceData) {
    try {
      const { bankId, serviceId, key, value, userId } = data;

      const service = await models.BankService.findOne({
        where: { id: serviceId, bankId },
        include: [{
          model: models.Bank,
          as: 'bank',
          attributes: ['userId']
        }]
      });

      if (!service) {
        return null;
      }

      if (service.bank.userId !== userId) {
        return null;
      }

      await service.update({
        ...(key !== undefined && { key }),
        ...(value !== undefined && { value }),
      });

      return service.get({ plain: true });
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  static async deleteBankService(data: DeleteBankServiceData) {
    try {
      const { bankId, serviceId, userId } = data;

      const service = await models.BankService.findOne({
        where: { id: serviceId, bankId },
        include: [{
          model: models.Bank,
          as: 'bank',
          attributes: ['userId']
        }]
      });

      if (!service) {
        return false;
      }

      if (service.bank.userId !== userId) {
        return false;
      }

      await service.destroy();
      return true;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }
}