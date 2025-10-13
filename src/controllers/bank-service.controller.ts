// src/controllers/bank-service.controller.ts
import { Request, Response } from 'express';
import { BankServiceService } from '../services/bank-service.service';

export class BankServiceController {
  static async getBankServices(req: Request, res: Response) {
    try {
      const { bankId } = req.params;
      const bankIdNum = parseInt(bankId, 10);

      if (isNaN(bankIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bank ID',
        });
      }

      const services = await BankServiceService.getBankServices(bankIdNum);
      
      return res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error: any) {
      console.error('Error in getBankServices:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch bank services',
        error: error.message,
      });
    }
  }

  static async createBankService(req: Request, res: Response) {
    try {
      const { bankId } = req.params;
      const bankIdNum = parseInt(bankId, 10);
      const userId = (req as any).user?.id;

      if (isNaN(bankIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bank ID',
        });
      }

      const { key, value } = req.body;
      if (!key || !value) {
        return res.status(400).json({
          success: false,
          message: 'Both key and value are required',
        });
      }

      const newService = await BankServiceService.createBankService({
        bankId: bankIdNum,
        key,
        value,
        userId,
      });

      return res.status(201).json({
        success: true,
        message: 'Bank service created successfully',
        data: newService,
      });
    } catch (error: any) {
      console.error('Error in createBankService:', error);
      
      if (error.message === 'Bank not found') {
        return res.status(404).json({
          success: false,
          message: 'Bank not found',
        });
      }
      
      if (error.message === 'Access denied') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to modify this bank',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Failed to create bank service',
        error: error.message,
      });
    }
  }

  static async updateBankService(req: Request, res: Response) {
    try {
      const { bankId, serviceId } = req.params;
      const bankIdNum = parseInt(bankId, 10);
      const serviceIdNum = parseInt(serviceId, 10);
      const userId = (req as any).user?.id;

      if (isNaN(bankIdNum) || isNaN(serviceIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bank ID or service ID',
        });
      }

      const { key, value } = req.body;
      if (!key && !value) {
        return res.status(400).json({
          success: false,
          message: 'At least one of key or value must be provided',
        });
      }

      const updatedService = await BankServiceService.updateBankService({
        bankId: bankIdNum,
        serviceId: serviceIdNum,
        key,
        value,
        userId,
      });

      if (!updatedService) {
        return res.status(404).json({
          success: false,
          message: 'Bank service not found or you do not have permission to update it',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Bank service updated successfully',
        data: updatedService,
      });
    } catch (error: any) {
      console.error('Error in updateBankService:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update bank service',
        error: error.message,
      });
    }
  }

  static async deleteBankService(req: Request, res: Response) {
    try {
      const { bankId, serviceId } = req.params;
      const bankIdNum = parseInt(bankId, 10);
      const serviceIdNum = parseInt(serviceId, 10);
      const userId = (req as any).user?.id;

      if (isNaN(bankIdNum) || isNaN(serviceIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bank ID or service ID',
        });
      }

      const isDeleted = await BankServiceService.deleteBankService({
        bankId: bankIdNum,
        serviceId: serviceIdNum,
        userId,
      });

      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: 'Bank service not found or you do not have permission to delete it',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Bank service deleted successfully',
      });
    } catch (error: any) {
      console.error('Error in deleteBankService:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete bank service',
        error: error.message,
      });
    }
  }
}