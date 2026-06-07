import { BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';
import User, { IUser } from './user.model';
import MiningSession from './mining-session.model';
import MiningWallet from './mining-wallet.model';
import WithdrawalRequest from './withdrawal-request.model';
import MiningDevice from './mining-device.model';
import UserWallet, { IUserWallet } from './user-wallet.model';

export default class Customer extends Model {

  public id!: number;
  public userId!: number;
  public defaultWalletId!: number;
  public totalIncome!: number;
  public totalAvailableBalance!: number;
  public ranking!: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'VIP';
  //TODO public activeStatus!: 'active' | 'suspended' 
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
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        userId: {
          type: INTEGER,
          field: 'user_id',
        },

        defaultWalletId: {
          type: INTEGER,
          field: 'default_wallet_id',
        },

        totalIncome: {
          type: INTEGER,
          field: 'total_income',
        },

        totalAvailableBalance: {
          type: INTEGER,
          field: 'total_available_balance',
        },

        ranking: {
          type: STRING(255),
          defaultValue: 'None',
          // allowNull: false,
          field: 'ranking',
        },

        createdAt: {
          type: DATE,
          defaultValue: sequelize.literal('UTC_TIMESTAMP()'),
          field: 'created_at',
        },

        softDeleted: {
          type: BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        visibility: {
          type: BOOLEAN,
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

    // Customer.belongsTo(User, {
    //   foreignKey: 'user_id',
    //   as: 'customer'
    // });

    Customer.hasMany(models.MiningDevice, {
      foreignKey: 'userId',
      as: 'miningDevices',
    });

    Customer.hasOne(UserWallet, {
      foreignKey: 'id',
      as: 'defaultWallet',
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



export type ICustomer = Partial<Customer> & {
  // defaultWallet?: IUserWallet;

}



