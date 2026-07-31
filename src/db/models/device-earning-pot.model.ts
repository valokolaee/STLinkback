import { BOOLEAN, DATE, DECIMAL, INTEGER, Model, STRING } from 'sequelize';
import { MONEY_TYPE } from './constants/MONEY_DECIMAL';
import User, { IUser } from './user.model';
import MiningDevice from './mining-device.model';
import DevicePotAssignment, { IDevicePotAssignment } from './device-pot-assignment';

export default class DeviceEarningPot extends Model {
  public id!: number;
  public userId!: number;
  public totalEarnings!: string;
  public withdrawnAmount!: string;
  public availableBalance!: string;
  // public pendingBalance!: string;
  public currency!: string;
  public softDeleted!: boolean;
  public lastUpdated!: Date;
  public recType!: string;

  public readonly user?: any;

  public static initModel(sequelize: any): typeof DeviceEarningPot {
    return DeviceEarningPot.init(
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
          references: {
            model: 'users',
            key: 'id',
          },
        },
        totalEarnings: {
          type: MONEY_TYPE,
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'total_earnings',
        },
        withdrawnAmount: {
          type: MONEY_TYPE,
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'withdrawn_amount',
        },
        availableBalance: {
          type: MONEY_TYPE,
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'available_balance',
        },
        // pendingBalance: {
        //   type: MONEY_TYPE,
        //   allowNull: false,
        //   defaultValue: 0.00000000,
        //   field: 'pending_balance',
        // },
        currency: {
          type: STRING(10),
          allowNull: false,
          defaultValue: 'USDT',
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
        modelName: 'DeviceEarningPot',
        tableName: 'device_earning_pots',
        timestamps: false,
        // indexes: [
        //   {
        //     unique: true,
        //     fields: ['walletAddress']
        //   }
        // ]
      }
    );
  }

  public static associate(models: any) {

    DeviceEarningPot.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });

    DeviceEarningPot.belongsTo(User, {
      foreignKey: 'userId',
      as: 'owner',
    });

    DeviceEarningPot.hasOne(DevicePotAssignment, {
      foreignKey: 'potId',
      as: 'potAssignment',
    });


  }
}


export interface IDeviceEarningPot extends Partial<DeviceEarningPot> {
  owner?: IUser;
  potAssignment: IDevicePotAssignment;
 }