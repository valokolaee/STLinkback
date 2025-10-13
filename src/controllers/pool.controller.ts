// src/controllers/pool.controller.ts
import { Request, Response } from 'express';
import { PoolService } from '../services/pool.service';
import getUserByReq from '../utils/getUserByReq';

export class PoolController {
  static async getAllPools(req: Request, res: Response) {
    try {
      const pools = await PoolService.getAllPools();
      return res.status(200).json({
        success: true,
        data: pools,
      });
    } catch (error: any) {
      console.error('Error in getAllPools:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch pools',
        error: error.message,
      });
    }
  }

  static async getPoolById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const poolId = parseInt(id, 10);

      if (isNaN(poolId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pool ID',
        });
      }

      const pool = await PoolService.getPoolById(poolId);
      if (!pool) {
        return res.status(404).json({
          success: false,
          message: 'Pool not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: pool,
      });
    } catch (error: any) {
      console.error('Error in getPoolById:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch pool',
        error: error.message,
      });
    }
  }

  static async createPool(req: Request, res: Response) {
    try {

      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const newPool = await PoolService.createPool({ ...req.body, userId });
      return res.status(201).json({
        success: true,
        message: 'Pool created successfully',
        data: newPool,
      });
    } catch (error: any) {
      console.error('Error in createPool:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create pool',
        error: error.message,
      });
    }
  }

  static async updatePool(req: Request, res: Response) {
    try {
      
      const  id  = req?.body?.id;
      const poolId =  parseInt(id.toString(), 10);
      const userId = getUserByReq(req).id
      const pool = await PoolService.getPoolById(poolId);
      // console.log(req.body,pool);

      if (isNaN(poolId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pool ID',
        });
      }

      const updatedPool = await PoolService.updatePool(poolId, req.body, userId);
      
      if (!updatedPool) {
        return res.status(404).json({
          success: false,
          message: 'Pool not found or you do not have permission to update it',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Pool updated successfully',
        data: updatedPool,
      });
    } catch (error: any) {
      console.error('Error in updatePool:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update pool',
        error: error.message,
      });
    }
  }

  static async deletePool(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const poolId = parseInt(id, 10);
      const userId = (req as any).user?.id;

      if (isNaN(poolId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pool ID',
        });
      }

      const isDeleted = await PoolService.deletePool(poolId, userId);
      
      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: 'Pool not found or you do not have permission to delete it',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Pool deleted successfully',
      });
    } catch (error: any) {
      console.error('Error in deletePool:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete pool',
        error: error.message,
      });
    }
  }
}