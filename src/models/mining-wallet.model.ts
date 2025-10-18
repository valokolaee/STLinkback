// src/models/mining-wallet.model.ts
import { Model } from 'sequelize';

export default class MiningWallet extends Model {
  public id!: number;
  public userId!: number;
  public totalEarnings!: number;
  public withdrawnAmount!: number;
  public availableBalance!: number;
  public pendingBalance!: number;
  public currency!: string;
  public walletAddress!: string | null;
  public softDeleted!: boolean;
  public lastUpdated!: Date;

  public readonly user?: any;

  public static initModel(sequelize: any): typeof MiningWallet {
    return MiningWallet.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: 'INT',
          allowNull: false,
          field: 'user_id',
        },
        totalEarnings: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'total_earnings',
        },
        withdrawnAmount: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'withdrawn_amount',
        },
        availableBalance: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'available_balance',
        },
        pendingBalance: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'pending_balance',
        },
        currency: {
          type: 'VARCHAR(10)',
          allowNull: false,
          defaultValue: 'BTC',
        },
        walletAddress: {
          type: 'VARCHAR(255)',
          allowNull: true,
          unique: true,
          field: 'wallet_address',
        },
        softDeleted: {
          type: 'BOOLEAN',
          allowNull: true,
          defaultValue: false
        },
        lastUpdated: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'last_updated',
        },
      },
      {
        sequelize,
        modelName: 'MiningWallet',
        tableName: 'mining_wallets',
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['walletAddress']
          }
        ]
      }
    );
  }

  public static associate(models: any) {
    MiningWallet.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}


export interface IMiningWallet extends MiningWallet{}