// src/models/withdrawal-request.model.ts
import { BOOLEAN, DATE, DECIMAL, DOUBLE, ENUM, INTEGER, Model, NUMBER, STRING } from 'sequelize';
import { MONEY_TYPE } from './constants/MONEY_DECIMAL';
import UserWallet from './user-wallet.model';

export default class WithdrawalRequest extends Model {
  public id!: number;
  public userId!: number;
  public amount!: string;
  public currency!: string;
  public userWalletId!: string;
  public externalWalletAddress!: string;
  public transactionHash!: string | null;
  public status!: 'pending' | 'processing' | 'completed' | 'rejected' | 'approved' | 'failed' | 'cancelled';
  public networkFee!: number;
  public serviceFee!: number;
  public requestedAt!: Date;
  public processedAt!: Date | null;
  public softDeleted!: boolean;
  public processedBy!: number | null;
  public recType!: string;

  public readonly user?: any;
  public readonly processedByUser?: any;

  public static initModel(sequelize: any): typeof WithdrawalRequest {
    return WithdrawalRequest.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        recType: {
          type: STRING(20),
        },
        userId: {
          type: INTEGER,
          allowNull: false,
          field: 'user_id',
        },
        amount: {
          type: MONEY_TYPE,
          allowNull: false,
        },
        currency: {
          type: STRING(255),
          allowNull: false,
          defaultValue: 'USDT',
        },

        externalWalletAddress: {
          type: STRING(255),
          allowNull: false,
          field: 'external_wallet_address',
        },

        userWalletId: {
          type: NUMBER,
          allowNull: false,
          field: 'user_wallet_address',
        },
        transactionHash: {
          type: STRING(255),
          allowNull: true,
          unique: true,
          field: 'transaction_hash',
        },
        status: {
          type: ENUM("pending", "processing", "completed", "rejected", "approved", "failed", "cancelled"),
          allowNull: false,
          defaultValue: 'pending',
        },
        networkFee: {
          type: DOUBLE,
          allowNull: false,
          defaultValue: 0.0000,
          field: 'network_fee',
        },
        serviceFee: {
          type: MONEY_TYPE,
          allowNull: false,
          defaultValue: 0.00000,
          field: 'service_fee',
        },
        requestedAt: {
          type: DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'requested_at',
        },
        processedAt: {
          type: DATE,
          allowNull: true,
          field: 'processed_at',
        },
        softDeleted: {
          type: BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        processedBy: {
          type: INTEGER,
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

    WithdrawalRequest.belongsTo(UserWallet, {
      foreignKey: 'user_wallet_address',
      as: 'userWallet',
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
