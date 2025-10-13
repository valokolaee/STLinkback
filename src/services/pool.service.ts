// src/services/pool.service.ts
import { models } from '../db';

interface CreatePoolData {
  name: string;
  logo: string;
  level: string;
  desc?: string;
  reward?: string;
  status?: string;
  capital_invested?: number;
  value_json?: any;
  csv_url?: string;
  userId: number;
}

interface UpdatePoolData {
  name?: string;
  logo?: string;
  level?: string;
  desc?: string;
  reward?: string;
  status?: string;
  capital_invested?: number;
  value_json?: any;
  csv_url?: string;
}

export class PoolService {
  static async getAllPools() {
    try {
      const pools = await models.Pool.findAll({
        include: [{ model: models.User, as: 'owner', attributes: ['username'] }]
      });
      return pools.map(pool => pool.get({ plain: true }));
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  static async getPoolById(id: number) {
    try {
      const pool = await models.Pool.findByPk(id, {
        include: [{ model: models.User, as: 'owner', attributes: ['username'] }]
      });
      return pool ? pool.get({ plain: true }) : null;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  static async createPool(data: CreatePoolData) {
    try {
      if (!data.userId) {
        throw new Error('userId is required');
      }

      const pool = await models.Pool.create({
        name: data.name,
        userId: data.userId,
        logo: data.logo,
        level: data.level,
        desc: data.desc,
        reward: data.reward,
        status: data.status,
        capital_invested: data.capital_invested,
        value_json: data.value_json,
        csv_url: data.csv_url,
        updated_at: new Date(),
      });

      return pool.get({ plain: true });
    } catch (error) {
      console.error('PoolService create error:', error);
      throw new Error(`Database error: ${error}`);
    }
  }

  static async updatePool(id: number, data: UpdatePoolData, userId?: number) {
    try {
      const pool = await models.Pool.findByPk(id);
      
      if (!pool) {
        return null;
      }

      if (userId && pool.userId !== userId) {
        return null;
      }

      await pool.update({
        ...data,
        updated_at: new Date(),
      });

      return pool.get({ plain: true });
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  static async deletePool(id: number, userId?: number) {
    try {
      const pool = await models.Pool.findByPk(id);
      
      if (!pool) {
        return false;
      }

      if (userId && pool.userId !== userId) {
        return false;
      }

      await pool.destroy();
      return true;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }
}