// src/models/mining-device.model.ts
import { BIGINT, BOOLEAN, DATE, DECIMAL, ENUM, INTEGER, Model, STRING } from 'sequelize';
import DeviceEarningPot, { IDeviceEarningPot } from './device-earning-pot.model';
import { MONEY_TYPE } from './constants/MONEY_DECIMAL';
import DevicePotAssignment, { IDevicePotAssignment } from './device-pot-assignment';

export default class MiningDevice extends Model {
  public id!: number;
  public creatorId!: number;//creator Id
  public currentPotId!: number;//creator Id
  public deviceName!: string;
  public imei!: string;
  public deviceModel!: string;
  public serialNumber!: string | null;
  public startDate!: Date;//created date of device in system
  public totalUptimeSeconds!: number;
  public totalRevenue!: number;
  public status!: 'active' | 'inactive' | 'maintenance' | 'offline' | 'error';
  public ipAddress!: string | null;
  public firmwareVersion!: string | null;
  public location!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date | null;
  public softDeleted!: boolean;
  public recType!: string;

  public readonly user?: any;
  public readonly specifications?: any;
  public readonly metrics?: any[];
  public readonly sessions?: any[];
  public readonly earnings?: any[];
  public readonly alerts?: any[];

  public static initModel(sequelize: any): typeof MiningDevice {
    return MiningDevice.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        recType: {
          type: STRING(20),
        },

        creatorId: {
          type: INTEGER,
          allowNull: false,
        },

        currentPotId: {
          type: INTEGER,
          allowNull: true,
        },

        deviceName: {
          type: STRING(255),
          allowNull: false,
          field: 'device_name',
        },
        imei: {
          type: STRING(30),
          allowNull: false,
          unique: true,

        },
        deviceModel: {
          type: STRING(100),
          allowNull: false,
          field: 'device_model',
        },
        serialNumber: {
          type: STRING(100),
          allowNull: true,
          unique: true,
          field: 'serial_number',
        },
        startDate: {
          type: DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'start_date',
        },
        totalUptimeSeconds: {
          type: BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'total_uptime_seconds',
        },
        totalRevenue: {
          type: MONEY_TYPE,
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'total_revenue',
        },
        status: {
          type: ENUM("active", "inactive", "maintenance", "offline", "error"),
          allowNull: false,
          defaultValue: 'active',
        },
        ipAddress: {
          type: STRING(45),
          allowNull: true,
          field: 'ip_address',
        },
        firmwareVersion: {
          type: STRING(50),
          allowNull: true,
          field: 'firmware_version',
        },
        location: {
          type: STRING(255),
          allowNull: true,
        },
        softDeleted: {
          type: BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        createdAt: {
          type: DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },

        updatedAt: {
          type: DATE,
          allowNull: true,
          field: 'updated_at',
        },
      },

      {
        sequelize,
        modelName: 'MiningDevice',
        tableName: 'mining_devices',
        timestamps: false,
        indexes: [{
          unique: true,
          fields: ['creatorId', 'device_name'],

        }]
      }
    );
  }

  public static associate(models: any) {

    MiningDevice.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'user',
    });

    MiningDevice.belongsTo(DeviceEarningPot, {
      foreignKey: 'currentPotId',
      as: 'currentPot',
    });


    MiningDevice.hasMany(DevicePotAssignment, {
      foreignKey: 'deviceId',
      as: 'assignments',
    });

    MiningDevice.hasOne(models.DeviceSpecification, {
      foreignKey: 'deviceId',
      as: 'specifications',
    });

    MiningDevice.hasMany(models.DeviceMetric, {
      foreignKey: 'deviceId',
      as: 'metrics',
    });

    MiningDevice.hasMany(models.MiningSession, {
      foreignKey: 'deviceId',
      as: 'sessions',
    });

    MiningDevice.hasMany(models.DeviceEarning, {
      foreignKey: 'deviceId',
      as: 'earnings',
    });

    MiningDevice.hasMany(models.DeviceAlert, {
      foreignKey: 'deviceId',
      as: 'alerts',
    });




  }
}



export interface IMiningDevice extends Partial<MiningDevice> {
  assignment?: IDevicePotAssignment[]
  currentPot?: IDeviceEarningPot;

}