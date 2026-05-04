
import { DataTypes, Model } from 'sequelize';
import UserWallet from './user-wallet.model';
import WithdrawalRequest from './withdrawal-request.model';
import Agent from './agent.model';

export default class Transaction extends Model {
  public id!: number;

  public fromWalletId!: number;
  public toWalletId!: number;
  public withdrawId!: number;

  public amount!: number;
  public currency!: string;
  public approverAgentId?: number | null;

  public createdAt!: Date;
  public softDeleted!: boolean;



  public readonly fromWallet!: UserWallet;
  public readonly toWallet!: UserWallet;
  public readonly withdraw!: WithdrawalRequest;

  public readonly approverAgent?: Agent;


  public static initModel(sequelize: any): typeof Transaction {
    return Transaction.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        approverAgentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'approver_agent_id',
        },
        amount: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
        currency: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: 'USDT',
        },
        fromWalletId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'from_wallet_id',
        },
        toWalletId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'to_wallet_id',
        },
        withdrawId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'withdrawal_request_id',
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'requested_at',
        },

      },
      {
        sequelize,
        modelName: 'Transaction',
        tableName: 'transaction',
        timestamps: false,
        // indexes: [
        //   {
        //     // fields: ['user_id']
        //   },
        //   {
        //     fields: ['status', 'requested_at']
        //   }
        // ]
      }
    );
  }

  public static associate(models: any) {
    Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Transaction.belongsTo(models.User, {
      foreignKey: 'processedBy',
      as: 'processedByUser',
    });
  }
}


export interface IWithdrawalRequest extends Partial<Transaction> {
  userWalletNickname?: string
  deviceName?: string
}
