// src/models/mining-device.model.ts
import { Model } from 'sequelize';

export default class MiningDevice extends Model {
  public id!: number;
  public userId!: number;
  public deviceName!: string;
  public imei!: string;
  public deviceModel!: string;
  public serialNumber!: string | null;
  public startDate!: Date;
  public totalUptimeSeconds!: number;
  public totalRevenue!: number;
  public status!: 'active' | 'inactive' | 'maintenance' | 'offline' | 'error';
  public ipAddress!: string | null;
  public firmwareVersion!: string | null;
  public location!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date | null;

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
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: 'INT',
          allowNull: false,
          field: 'user_id',
        },
        deviceName: {
          type: 'VARCHAR(255)',
          allowNull: false,
          field: 'device_name',
        },
        imei: {
          type: 'VARCHAR(15)',
          allowNull: false,
          unique: true,
        },
        deviceModel: {
          type: 'VARCHAR(100)',
          allowNull: false,
          field: 'device_model',
        },
        serialNumber: {
          type: 'VARCHAR(100)',
          allowNull: true,
          unique: true,
          field: 'serial_number',
        },
        startDate: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'start_date',
        },
        totalUptimeSeconds: {
          type: 'BIGINT',
          allowNull: false,
          defaultValue: 0,
          field: 'total_uptime_seconds',
        },
        totalRevenue: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'total_revenue',
        },
        status: {
          type: 'ENUM("active", "inactive", "maintenance", "offline", "error")',
          allowNull: false,
          defaultValue: 'active',
        },
        ipAddress: {
          type: 'VARCHAR(45)',
          allowNull: true,
          field: 'ip_address',
        },
        firmwareVersion: {
          type: 'VARCHAR(50)',
          allowNull: true,
          field: 'firmware_version',
        },
        location: {
          type: 'VARCHAR(255)',
          allowNull: true,
        },
        createdAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        updatedAt: {
          type: 'DATETIME',
          allowNull: true,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        modelName: 'MiningDevice',
        tableName: 'mining_devices',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    MiningDevice.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
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



export interface IMiningDevice extends Partial <MiningDevice>{}