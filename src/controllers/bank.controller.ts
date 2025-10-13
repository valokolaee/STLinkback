// src/controllers/bank.controller.ts
import { Request, Response } from 'express';
import { BankService } from '../services/bank.service';

export class BankController {

  static async getAllBanks(req: Request, res: Response) {
    try {
      const banks = await BankService.getAllBanks();
      return res.status(200).json({
        success: true,
         data:banks,
      });
    } catch (error: any) {
      console.error('Error in getAllBanks:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch banks',
        error: error.message,
      });
    }
  }

  static async getBankById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bankId = parseInt(id, 10);

      if (isNaN(bankId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bank ID',
        });
      }

      const bank = await BankService.getBankById(bankId);
      if (!bank) {
        return res.status(404).json({
          success: false,
          message: 'Bank not found',
        });
      }

      return res.status(200).json({
        success: true,
         bank,
      });
    } catch (error: any) {
      console.error('Error in getBankById:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch bank',
        error: error.message,
      });
    }
  }

  static async createBank(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const newBank = await BankService.createBank({ ...req.body, userId });
      return res.status(201).json({
        success: true,
        message: 'Bank created successfully',
         newBank,
      });
    } catch (error: any) {
      console.error('Error in createBank:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create bank',
        error: error.message,
      });
    }
  }

  static async updateBank(req: Request, res: Response) {
    // console.log(req);
    
    try {
      // const { id } = req.params;
      const id = req?.body?.id;

      const bankId = parseInt(id, 10);
      const userId = (req as any).user?.id;

      if (isNaN(bankId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bank ID',
        });
      }

      const updatedBank = await BankService.updateBank(bankId, req.body, userId);
      
      if (!updatedBank) {
        return res.status(404).json({
          success: false,
          message: 'Bank not found or you do not have permission to update it',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Bank updated successfully',
         updatedBank,
      });
    } catch (error: any) {
      console.error('Error in updateBank:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update bank',
        error: error.message,
      });
    }
  }

  static async deleteBank(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bankId = parseInt(id, 10);
      const userId = (req as any).user?.id;

      if (isNaN(bankId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bank ID',
        });
      }

      const isDeleted = await BankService.deleteBank(bankId, userId);
      
      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: 'Bank not found or you do not have permission to delete it',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Bank deleted successfully',
      });
    } catch (error: any) {
      console.error('Error in deleteBank:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete bank',
        error: error.message,
      });
    }
  }
}