// src/models/pool.model.ts (????? ???)
import { Model } from 'sequelize';

export default class Pool extends Model {
  public id!: number;
  public name!: string;
  public userId!: number; // ????? ??
  public logo!: string;
  public level!: string;
  public desc!: string | null;
  public reward!: string | null;
  public status!: string | null;
  public capitalInvested!: number | null;
  public valueJson!: object | null;
  public csvUrl!: string | null;
  public updatedAt!: Date;

  public static initModel(sequelize: any): typeof Pool {
    return Pool.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: 'VARCHAR(255)',
          allowNull: false,
        },
        userId: {
          type: 'INT',
          allowNull: false,
          field: 'user_id',
        },
        logo: {
          type: 'VARCHAR(255)',
          allowNull: false,
        },
        level: {
          type: 'VARCHAR(255)',
          allowNull: false,
        },
        desc: {
          type: 'TEXT',
          allowNull: true,
        },
        reward: {
          type: 'VARCHAR(255)',
          allowNull: true,
        },
        status: {
          type: 'VARCHAR(255)',
          allowNull: true,
        },
        capitalInvested: {
          type: 'INT',
          allowNull: true,
          field: 'capital_invested',
        },
        valueJson: {
          type: 'JSON',
          allowNull: true,
          field: 'value_json',
        },
        csvUrl: {
          type: 'VARCHAR(255)',
          allowNull: true,
          field: 'csv_url',
        },
        updatedAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at',
        },
      },
      {
        sequelize,
        modelName: 'Pool',
        tableName: 'pools',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    Pool.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner',
    });

    Pool.hasMany(models.PoolService, {
      foreignKey: 'poolId',
      as: 'services',
    });

    Pool.hasMany(models.Bank, {
      foreignKey: 'poolId',
      as: 'banks',
    });
  }
}