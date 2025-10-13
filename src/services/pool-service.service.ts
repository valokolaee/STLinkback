// src/services/pool-service.service.ts
import { models } from '../db';

interface CreatePoolServiceData {
  poolId: number;
  key: string;
  value: string;
  userId: number;
}

interface UpdatePoolServiceData {
  poolId: number;
  serviceId: number;
  key?: string;
  value?: string;
  userId: number;
}

interface DeletePoolServiceData {
  poolId: number;
  serviceId: number;
  userId: number;
}

export class PoolServiceService {
  static async getPoolServices(poolId: number) {
    try {
      // First, let's check if the pool exists.
      const pool = await models.Pool.findByPk(poolId);
      if (!pool) {
        throw new Error('Pool not found');
      }

      const services = await models.PoolService.findAll({
        where: { poolId },
        order: [['id', 'ASC']],
      });

      return services.map(service => service.get({ plain: true }));
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  static async createPoolService(data: CreatePoolServiceData) {
    try {
      const { poolId, key, value, userId } = data;

      // Checking that the pool exists and belongs to this user
      const pool = await models.Pool.findByPk(poolId);
      if (!pool) {
        throw new Error('Pool not found');
      }

      if (pool.userId !== userId) {
        throw new Error('Access denied');
      }

      const service = await models.PoolService.create({
        poolId,
        key,
        value,
      });

      return service.get({ plain: true });
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  static async updatePoolService(data: UpdatePoolServiceData) {
    try {
      const { poolId, serviceId, key, value, userId } = data;

      // Checking that the service exists and belongs to this pool and user
      const service = await models.PoolService.findOne({
        where: { id: serviceId, poolId },
        include: [{
          model: models.Pool,
          as: 'pool',
          attributes: ['userId']
        }]
      });

      if (!service) {
        return null;
      }

      if (service.pool.userId !== userId) {
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

  static async deletePoolService(data: DeletePoolServiceData) {
    try {
      const { poolId, serviceId, userId } = data;

      // Checking that the service exists and belongs to this pool and user
      const service = await models.PoolService.findOne({
        where: { id: serviceId, poolId },
        include: [{
          model: models.Pool,
          as: 'pool',
          attributes: ['userId']
        }]
      });

      if (!service) {
        return false;
      }

      if (service.pool.userId !== userId) {
        return false;
      }

      await service.destroy();
      return true;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }
}