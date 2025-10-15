// src/models/device-alert.model.ts
import { Model } from 'sequelize';

export default class DeviceAlert extends Model {
  public id!: number;
  public deviceId!: number;
  public alertType!: 'high_temperature' | 'low_hash_rate' | 'offline' | 'high_power' | 'fan_failure' | 'maintenance_required' | 'error';
  public alertMessage!: string;
  public severity!: 'low' | 'medium' | 'high' | 'critical';
  public isResolved!: boolean;
  public resolvedAt!: Date | null;
  public resolvedBy!: number | null;
  public createdAt!: Date;

  public readonly device?: any;
  public readonly resolvedByUser?: any;

  public static initModel(sequelize: any): typeof DeviceAlert {
    return DeviceAlert.init(
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
        alertType: {
          type: 'ENUM("high_temperature", "low_hash_rate", "offline", "high_power", "fan_failure", "maintenance_required", "error")',
          allowNull: false,
          field: 'alert_type',
        },
        alertMessage: {
          type: 'TEXT',
          allowNull: false,
          field: 'alert_message',
        },
        severity: {
          type: 'ENUM("low", "medium", "high", "critical")',
          allowNull: false,
          defaultValue: 'medium',
        },
        isResolved: {
          type: 'BOOLEAN',
          allowNull: false,
          defaultValue: false,
          field: 'is_resolved',
        },
        resolvedAt: {
          type: 'DATETIME',
          allowNull: true,
          field: 'resolved_at',
        },
        resolvedBy: {
          type: 'INT',
          allowNull: true,
          field: 'resolved_by',
        },
        createdAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
      },
      {
        sequelize,
        modelName: 'DeviceAlert',
        tableName: 'device_alerts',
        timestamps: false,
        indexes: [
          {
            fields: ['device_id']
          },
          {
            fields: ['is_resolved', 'created_at']
          }
        ]
      }
    );
  }

  public static associate(models: any) {
    DeviceAlert.belongsTo(models.MiningDevice, {
      foreignKey: 'deviceId',
      as: 'device',
    });

    DeviceAlert.belongsTo(models.User, {
      foreignKey: 'resolvedBy',
      as: 'resolvedByUser',
    });
  }
}