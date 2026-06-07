// src/models/device-metric.model.ts
import { BOOLEAN, DataTypes, DECIMAL, INTEGER, Model } from 'sequelize';

export default class DeviceMetric extends Model {
  public id!: number;
  public deviceId!: number;
  public cpuUsage!: number;
  public memoryUsage!: number;
  public gpuUsage!: number | null;
  public processingSpeed!: number;
  public fanSpeedRpm!: number;
  public temperature!: number;
  public powerConsumption!: number;
  public hashRate!: number;
  public networkLatency!: number | null;
  public recordedAt!: Date;
  public softDeleted!: boolean;

  public readonly device?: any;

  public static initModel(sequelize: any): typeof DeviceMetric {
    return DeviceMetric.init(
      {
        id: {
          type: INTEGER,// 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        deviceId: {
          type: INTEGER,//'INT',
          allowNull: false,
          field: 'device_id',
        },
        cpuUsage: {
          type: DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0.00,
          field: 'cpu_usage',
        },
        memoryUsage: {
          type: DECIMAL(5,2) ,
          allowNull: false,
          defaultValue: 0.00,
          field: 'memory_usage',
        },
        gpuUsage: {
          type: DECIMAL(5,2),
          allowNull: true,
          defaultValue: 0.00,
          field: 'gpu_usage',
        },
        processingSpeed: {
          type: DECIMAL(10,2),
          allowNull: false,
          defaultValue: 0.00,
          field: 'processing_speed',
        },
        fanSpeedRpm: {
          type: INTEGER,//'INT',
          allowNull: false,
          defaultValue: 0,
          field: 'fan_speed_rpm',
        },
        temperature: {
          type:DECIMAL(5,2),
          allowNull: false,
          defaultValue: 0.00,
        },
        powerConsumption: {
          type: DECIMAL(8,2) ,
          allowNull: false,
          defaultValue: 0.00,
          field: 'power_consumption',
        },
        hashRate: {
          type: DataTypes.DECIMAL(12,4),
          allowNull: false,
          defaultValue: 0.0000,
          field: 'hash_rate',
        },
        networkLatency: {
          type: DataTypes.DECIMAL(8,4),
          allowNull: true,
          field: 'network_latency',
        },
        recordedAt: {
          type: DataTypes.DATE ,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'recorded_at',
        },
        softDeleted: {
          type: BOOLEAN ,
          allowNull: true,
          defaultValue: false
        },
      },
      {
        sequelize,
        modelName: 'DeviceMetric',
        tableName: 'device_metrics',
        timestamps: false,
        indexes: [
          {
            fields: ['device_id', 'recorded_at']
          }
        ]
      }
    );
  }

  public static associate(models: any) {
    DeviceMetric.belongsTo(models.MiningDevice, {
      foreignKey: 'deviceId',
      as: 'device',
    });
  }
}



export interface IDeviceMetric extends DeviceMetric { }  