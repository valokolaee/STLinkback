// src/controllers/pool-service.controller.ts
import { Request, Response } from 'express';
import { PoolServiceService } from '../services/pool-service.service';

export class PoolServiceController {
  static async getPoolServices(req: Request, res: Response) {
    try {
      const { poolId } = req.params;
      const poolIdNum = parseInt(poolId, 10);

      if (isNaN(poolIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pool ID',
        });
      }

      const services = await PoolServiceService.getPoolServices(poolIdNum);
      
      return res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error: any) {
      console.error('Error in getPoolServices:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch pool services',
        error: error.message,
      });
    }
  }

  static async createPoolService(req: Request, res: Response) {
    try {
      const { poolId } = req.params;
      const poolIdNum = parseInt(poolId, 10);
      const userId = (req as any).user?.id;

      if (isNaN(poolIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pool ID',
        });
      }

      const { key, value } = req.body;
      if (!key || !value) {
        return res.status(400).json({
          success: false,
          message: 'Both key and value are required',
        });
      }

      const newService = await PoolServiceService.createPoolService({
        poolId: poolIdNum,
        key,
        value,
        userId,
      });

      return res.status(201).json({
        success: true,
        message: 'Pool service created successfully',
        data: newService,
      });
    } catch (error: any) {
      console.error('Error in createPoolService:', error);
      
      if (error.message === 'Pool not found') {
        return res.status(404).json({
          success: false,
          message: 'Pool not found',
        });
      }
      
      if (error.message === 'Access denied') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to modify this pool',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Failed to create pool service',
        error: error.message,
      });
    }
  }

  static async updatePoolService(req: Request, res: Response) {
    try {
      const { poolId, serviceId } = req.params;
      const poolIdNum = parseInt(poolId, 10);
      const serviceIdNum = parseInt(serviceId, 10);
      const userId = (req as any).user?.id;

      if (isNaN(poolIdNum) || isNaN(serviceIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pool ID or service ID',
        });
      }

      const { key, value } = req.body;
      if (!key && !value) {
        return res.status(400).json({
          success: false,
          message: 'At least one of key or value must be provided',
        });
      }

      const updatedService = await PoolServiceService.updatePoolService({
        poolId: poolIdNum,
        serviceId: serviceIdNum,
        key,
        value,
        userId,
      });

      if (!updatedService) {
        return res.status(404).json({
          success: false,
          message: 'Pool service not found or you do not have permission to update it',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Pool service updated successfully',
        data: updatedService,
      });
    } catch (error: any) {
      console.error('Error in updatePoolService:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update pool service',
        error: error.message,
      });
    }
  }

  static async deletePoolService(req: Request, res: Response) {
    try {
      const { poolId, serviceId } = req.params;
      const poolIdNum = parseInt(poolId, 10);
      const serviceIdNum = parseInt(serviceId, 10);
      const userId = (req as any).user?.id;

      if (isNaN(poolIdNum) || isNaN(serviceIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pool ID or service ID',
        });
      }

      const isDeleted = await PoolServiceService.deletePoolService({
        poolId: poolIdNum,
        serviceId: serviceIdNum,
        userId,
      });

      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: 'Pool service not found or you do not have permission to delete it',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Pool service deleted successfully',
      });
    } catch (error: any) {
      console.error('Error in deletePoolService:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete pool service',
        error: error.message,
      });
    }
  }
}