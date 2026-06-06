import { BOOLEAN, DATE, DECIMAL, INTEGER, Model, STRING } from 'sequelize';
import Customer from './customer.model';

export default class UserWallet extends Model {
  public id!: number;
  public userId!: number;
  public totalEarnings!: number;
  public availableBalance!: number;
  public pendingBalance!: number;
  public withdrawnAmount!: number;
  public currency!: string;
  public walletAddress!: string ;
  public nickname!: string ;
  public softDeleted!: boolean;
  public lastUpdated!: Date;

  public readonly user?: any;

  public static initModel(sequelize: any): typeof UserWallet {
    return UserWallet.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: INTEGER,
          allowNull: false,
          field: 'user_id',
        },
        totalEarnings: {
          type: DECIMAL(15,8),
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'total_earnings',
        },
        withdrawnAmount: {
          type: DECIMAL(15,8),
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'withdrawn_amount',
        },
        availableBalance: {
          type: DECIMAL(15,8),
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'available_balance',
        },
        pendingBalance: {
          type: DECIMAL(15,8),
          allowNull: false,
          defaultValue: 0.0000,
          field: 'pending_balance',
        },
        currency: {
          type: STRING(10),
          allowNull: false,
          defaultValue: 'USDT',
        },
        walletAddress: {
          type: STRING(255),
          allowNull: true,
          unique: true,
          field: 'wallet_address',
        },
        nickname: {
          type: STRING(255),
          allowNull: true,
          unique: true,
          field: 'nickname',
        },
        softDeleted: {
          type: BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        lastUpdated: {
          type: DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'last_updated',
        },
      },
      {
        sequelize,
        modelName: 'UserWallet',
        tableName: 'user_wallets',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    UserWallet.belongsTo(Customer, {
      foreignKey: 'userId',
      as: 'customer',
    });
  }
}


export interface IUserWallet extends Partial <UserWallet> { }