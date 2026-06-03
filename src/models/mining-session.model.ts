// src/models/mining-session.model.ts
import { BOOLEAN, DATE, DECIMAL, ENUM, INTEGER, Model } from 'sequelize';

export default class MiningSession extends Model {
  public id!: number;
  public deviceId!: number;
  public sessionStart!: Date;
  public sessionEnd!: Date | null;
  public durationSeconds!: number;
  public earnings!: number;
  public status!: 'running' | 'completed' | 'interrupted' | 'failed';
  public avgHashRate!: number | null;
  public energyConsumed!: number | null;//TODO these 2 should be omitted 
  public softDeleted!: boolean;
  public createdAt!: Date;

  public readonly device?: any;
  public readonly earningsRecords?: any[];

  public static initModel(sequelize: any): typeof MiningSession {
    return MiningSession.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        deviceId: {
          type: INTEGER,
          allowNull: false,
          field: 'device_id',
        },
        sessionStart: {
          type: DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'session_start',
        },
        sessionEnd: {
          type: DATE,
          allowNull: true,
          field: 'session_end',
        },
        durationSeconds: {
          type: INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'duration_seconds',
        },
        earnings: {
          type: DECIMAL(15, 8),
          allowNull: false,
          defaultValue: 0.00000000,
        },
        status: {
          type: ENUM("running", "completed", "interrupted", "failed"),
          allowNull: false,
          defaultValue: 'running',
        },
        avgHashRate: {
          type: DECIMAL(12, 4),
          allowNull: true,
          field: 'avg_hash_rate',
        },
        energyConsumed: {
          type: DECIMAL(10, 4),
          allowNull: true,
          field: 'energy_consumed',
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
      },
      {
        sequelize,
        modelName: 'MiningSession',
        tableName: 'mining_sessions',
        timestamps: false,
        indexes: [
          {
            fields: ['device_id', 'session_start']
          }
        ]
      }
    );
  }

  public static associate(models: any) {
    MiningSession.belongsTo(models.MiningDevice, {
      foreignKey: 'deviceId',
      as: 'device',
    });

    MiningSession.hasMany(models.DeviceEarning, {
      foreignKey: 'miningSessionId',
      as: 'earningsRecords',
    });
  }
}


export interface IMiningSession extends Partial<MiningSession> {

}