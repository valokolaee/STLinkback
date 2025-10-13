// src/models/pool.service.ts
import { Model } from 'sequelize';

export default class PoolService extends Model {
  public id!: number;
  public poolId!: number; 
  public key!: string;
  public value!: string;

  public static initModel(sequelize: any): typeof PoolService {
    return PoolService.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        poolId: {
          type: 'INT',
          allowNull: false,
          // maybe in db.schema: 'poolId' 
          field: 'pool_id', 
        },
        key: {
          type: 'VARCHAR(255)',
          allowNull: false,
        },
        value: {
          type: 'VARCHAR(255)',
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'PoolService',
        tableName: 'pools_service',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {

    PoolService.belongsTo(models.Pool, {
      foreignKey: 'poolId', 
      as: 'pool',
    });
  }
}
