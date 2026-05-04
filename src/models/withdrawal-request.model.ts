// src/models/withdrawal-request.model.ts
import { DataTypes, Model } from 'sequelize';

export default class WithdrawalRequest extends Model {
  public id!: number;
  public userId!: number;
  public amount!: number;
  public currency!: string;
  public miningWalletAddress!: string;
  public userWalletAddress!: string;
  public transactionHash!: string | null;
  public status!: 'pending' | 'processing' | 'completed' | 'rejected' | 'approved' | 'failed' | 'cancelled';
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
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'user_id',
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        currency: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: 'USDT',
        },
        miningWalletAddress: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'mining_wallet_address',
        },
        userWalletAddress: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'user_wallet_address',
        },
        transactionHash: {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: true,
          field: 'transaction_hash',
        },
        status: {
          type: DataTypes.ENUM("pending", "processing", "completed", "rejected", "approved", "failed", "cancelled"),
          allowNull: false,
          defaultValue: 'pending',
        },
        networkFee: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0.0000,
          field: 'network_fee',
        },
        serviceFee: {
          type: DataTypes.DECIMAL,
          allowNull: false,
          defaultValue: 0.00000,
          field: 'service_fee',
        },
        requestedAt: {
          type: DataTypes.DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'requested_at',
        },
        processedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'processed_at',
        },
        softDeleted: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        processedBy: {
          type: DataTypes.INTEGER,
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
      foreignKey: 'user_id',
      as: 'user',
    });

    WithdrawalRequest.belongsTo(models.User, {
      foreignKey: 'processed_by',
      as: 'processedByUser',
    });
  }
}


export interface IWithdrawalRequest extends Partial<WithdrawalRequest> {
  userWalletNickname?: string
  deviceName?: string
}
