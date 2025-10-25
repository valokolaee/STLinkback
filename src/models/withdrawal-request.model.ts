// src/models/withdrawal-request.model.ts
import { Model } from 'sequelize';

export default class WithdrawalRequest extends Model {
  public id!: number;
  public userId!: number;
  public amount!: number;
  public currency!: string;
  public miningWalletAddress!: string;
  public userWalletAddress!: string;
  public transactionHash!: string | null;
  public status!: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  public networkFee!: number;
  public serviceFee!: number;
  public requestedAt!: Date;
  public processedAt!: Date | null;
  public softDeleted!: boolean;
  public processedBy!: number | null;

  public readonly user?: any;
  public readonly processedByUser?: any;

  public static initModel(sequelize: any): typeof WithdrawalRequest {
    return WithdrawalRequest.init(
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
        amount: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
        },
        currency: {
          type: 'VARCHAR(10)',
          allowNull: false,
          defaultValue: 'BTC',
        },
        miningWalletAddress: {
          type: 'VARCHAR(255)',
          allowNull: false,
          field: 'mining_wallet_address',
        },
        userWalletAddress: {
          type: 'VARCHAR(255)',
          allowNull: false,
          field: 'user_wallet_address',
        },
        transactionHash: {
          type: 'VARCHAR(255)',
          allowNull: true,
          unique: true,
          field: 'transaction_hash',
        },
        status: {
          type: 'ENUM("pending", "processing", "completed", "failed", "cancelled")',
          allowNull: false,
          defaultValue: 'pending',
        },
        networkFee: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'network_fee',
        },
        serviceFee: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'service_fee',
        },
        requestedAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'requested_at',
        },
        processedAt: {
          type: 'DATETIME',
          allowNull: true,
          field: 'processed_at',
        },
        softDeleted: {
          type: 'BOOLEAN',
          allowNull: true,
          defaultValue: false
        },
        processedBy: {
          type: 'INT',
          allowNull: true,
          field: 'processed_by',
        },
      },
      {
        sequelize,
        modelName: 'WithdrawalRequest',
        tableName: 'withdrawal_requests',
        timestamps: false,
        indexes: [
          {
            fields: ['user_id']
          },
          {
            fields: ['status', 'requested_at']
          }
        ]
      }
    );
  }

  public static associate(models: any) {
    WithdrawalRequest.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    WithdrawalRequest.belongsTo(models.User, {
      foreignKey: 'processedBy',
      as: 'processedByUser',
    });
  }
}


export interface IWithdrawalRequest extends WithdrawalRequest { }
