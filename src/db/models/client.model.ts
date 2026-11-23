import { BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';
import DeviceEarningPot from './device-earning-pot.model';
import MiningDevice from './mining-device.model';
import MiningSession from './mining-session.model';
import User from './user.model';
import WithdrawalRequest from './withdrawal-request.model';


export default class Client extends Model {

  public id!: number;
  public userId!: number;
  public totalIncome!: number;
  public totalAvailableBalance!: number;
  public ranking!: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'VIP';
  //TODO public activeStatus!: 'active' | 'suspended' 
  public createdAt!: Date;
  public softDeleted!: boolean;
  public visibility !: boolean;
  public recType!: string;





  public readonly user?: User;
  public readonly sessions?: MiningSession[];
  public readonly miningDevices?: MiningDevice[];
  public readonly miningWallets?: DeviceEarningPot[];
  public readonly withdrawalRequests?: WithdrawalRequest[];

  public static initModel(sequelize: any): typeof Client {
    return Client.init(
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
          field: 'user_id',
          unique: true,
          allowNull: false

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
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
        modelName: 'Client',
        tableName: 'clients',
        timestamps: false,
      }
    );
  }


  public static associate(models: any) {




    Client.hasMany(models.MiningDevice, {
      foreignKey: 'userId',
      as: 'miningDevices',
    });




    Client.hasMany(DeviceEarningPot, {
      foreignKey: 'userId',
      as: 'miningWallets',
    });

    Client.hasMany(models.WithdrawalRequest, {
      foreignKey: 'userId',
      as: 'withdrawalRequests',
    });

    Client.hasMany(models.DeviceAlert, {
      foreignKey: 'resolvedBy',
      as: 'resolvedAlerts',
    });

    Client.hasMany(models.WithdrawalRequest, {
      foreignKey: 'processedBy',
      as: 'processedWithdrawals',
    });

  }
}



export type IClient = Partial<Client> & {
  // defaultWallet?: IUserWallet;

}



