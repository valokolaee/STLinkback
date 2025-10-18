// src/models/device-specification.model.ts
import { Model } from 'sequelize';

export default class DeviceSpecification extends Model {
  public id!: number;
  public deviceId!: number;
  public processorType!: string | null;
  public processorSpeed!: number | null;
  public memorySize!: number | null;
  public memoryType!: string | null;
  public storageSize!: number | null;
  public powerConsumption!: number | null;
  public fanCount!: number | null;
  public hashRate!: number | null;
  public algorithm!: string | null;
  public softDeleted!: boolean;
  public createdAt!: Date;

  public readonly device?: any;

  public static initModel(sequelize: any): typeof DeviceSpecification {
    return DeviceSpecification.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        deviceId: {
          type: 'INT',
          allowNull: false,
          field: 'device_id',
        },
        processorType: {
          type: 'VARCHAR(100)',
          allowNull: true,
          field: 'processor_type',
        },
        processorSpeed: {
          type: 'DECIMAL(8,2)',
          allowNull: true,
          field: 'processor_speed',
        },
        memorySize: {
          type: 'INT',
          allowNull: true,
          field: 'memory_size',
        },
        memoryType: {
          type: 'VARCHAR(50)',
          allowNull: true,
          field: 'memory_type',
        },
        storageSize: {
          type: 'INT',
          allowNull: true,
          field: 'storage_size',
        },
        powerConsumption: {
          type: 'DECIMAL(8,2)',
          allowNull: true,
          field: 'power_consumption',
        },
        fanCount: {
          type: 'INT',
          allowNull: true,
          field: 'fan_count',
        },
        hashRate: {
          type: 'DECIMAL(12,4)',
          allowNull: true,
          field: 'hash_rate',
        },
        algorithm: {
          type: 'VARCHAR(100)',
          allowNull: true,
        },
        softDeleted: {
          type: 'BOOLEAN',
          allowNull: true,
          defaultValue: false
        },
        createdAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
      },
      {
        sequelize,
        modelName: 'DeviceSpecification',
        tableName: 'device_specifications',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    DeviceSpecification.belongsTo(models.MiningDevice, {
      foreignKey: 'deviceId',
      as: 'device',
    });
  }
}