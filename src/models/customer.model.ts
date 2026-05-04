import { DataTypes, Model } from 'sequelize';
import User from './user.model';
import MiningSession from './mining-session.model';
import MiningWallet from './mining-wallet.model';
import WithdrawalRequest from './withdrawal-request.model';
import MiningDevice from './mining-device.model';

export default class Customer extends Model {

  public id!: number;
  public userId!: number;
  public defaultWalletId!: number;
  public totalIncome!: number;
  public totalAvailableBalance!: number;
  public ranking!: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'VIP';
  public createdAt!: Date;
  public softDeleted!: boolean;
  public visibility !: boolean;





  public readonly user?: User;
  public readonly sessions?: MiningSession[];
  public readonly miningDevices?: MiningDevice[];
  public readonly miningWallets?: MiningWallet[];
  public readonly withdrawalRequests?: WithdrawalRequest[];

  public static initModel(sequelize: any): typeof Customer {
    return Customer.init(
      {

        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        userId: {
          type: DataTypes.INTEGER,
          field: 'user_id',
        },

        defaultWalletId: {
          type: DataTypes.INTEGER,
          field: 'default_wallet_id',
        },

        totalIncome: {
          type: DataTypes.INTEGER,
          field: 'total_income',
        },

        totalAvailableBalance: {
          type: DataTypes.INTEGER,
          field: 'total_available_balance',
        },

        ranking: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'ranking',
        },

        createdAt: {
          type: DataTypes.DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },

        softDeleted: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        visibility: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true
        },


      },
      {
        sequelize,
        modelName: 'Customer',
        tableName: 'customers',
        timestamps: false,
      }
    );
  }


  public static associate(models: any) {


    User.hasOne(Customer, {
      foreignKey: 'userId',
      as: 'customer',
    });

    Customer.hasMany(models.MiningDevice, {
      foreignKey: 'userId',
      as: 'miningDevices',
    });

    Customer.hasMany(models.MiningWallet, {
      foreignKey: 'userId',
      as: 'miningWallets',
    });

    Customer.hasMany(models.WithdrawalRequest, {
      foreignKey: 'userId',
      as: 'withdrawalRequests',
    });

    Customer.hasMany(models.DeviceAlert, {
      foreignKey: 'resolvedBy',
      as: 'resolvedAlerts',
    });

    Customer.hasMany(models.WithdrawalRequest, {
      foreignKey: 'processedBy',
      as: 'processedWithdrawals',
    });

  }
}



export interface ICustomer extends Partial<Customer> {
}