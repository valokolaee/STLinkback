import { BOOLEAN, DATE, DECIMAL, INTEGER, Model, STRING } from 'sequelize';
import { MONEY_DECIMAL, MONEY_TYPE } from './constants/MONEY_DECIMAL';

export default class DeviceEarning extends Model {
  public id!: number;
  public deviceId!: number;
  public userId!: number;

  public miningSessionId!: number | null;
  public amount!: string;
  public currency!: string;
  public earningDate!: Date;
  public calculatedAt!: Date;
  public isSettled!: boolean;
  public transactionHash!: string | null;
  public exchangeRate!: number | null;
  public softDeleted!: boolean;
  public recType!: string;

  public readonly device?: any;
  public readonly miningSession?: any;

  public static initModel(sequelize: any): typeof DeviceEarning {
    return DeviceEarning.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        recType: {
          type: STRING(20),
        },
        deviceId: {
          type: INTEGER,
          allowNull: false,
          field: 'device_id',
        },
        userId: {
          type: INTEGER,
          allowNull: false,
          field: 'user_id',
        },
        miningSessionId: {
          type: INTEGER,
          allowNull: true,
          field: 'mining_session_id',
        },
        amount: {
          type: MONEY_TYPE,
          allowNull: false,
          defaultValue: 0.00000000,
        },
        currency: {
          type: STRING,
          allowNull: false,
          defaultValue: 'USDT',
        },
        earningDate: {
          type: DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'earning_date',
        },
        calculatedAt: {
          type: DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'calculated_at',
        },
        isSettled: {
          type: BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_settled',
        },
        transactionHash: {
          type: STRING,
          allowNull: true,
          unique: true,
          field: 'transaction_hash',
        },
        exchangeRate: {
          type: MONEY_TYPE,
          allowNull: true,
          field: 'exchange_rate',
        },
        softDeleted: {
          type: BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
      },
      {
        sequelize,
        modelName: 'DeviceEarning',
        tableName: 'device_earnings',
        timestamps: false,
        indexes: [
          {
            fields: ['device_id', 'earning_date']
          },
          {
            fields: ['user_id', 'earning_date']
          },
          {
            fields: ['is_settled', 'earning_date']
          }
        ]
      }
    );
  }

  public static associate(models: any) {
    DeviceEarning.belongsTo(models.MiningDevice, {
      foreignKey: 'deviceId',
      as: 'device',
    });

    DeviceEarning.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    DeviceEarning.belongsTo(models.MiningSession, {
      foreignKey: 'miningSessionId',
      as: 'miningSession',
    });
  }
}





export interface IDeviceEarning extends Partial<DeviceEarning> { }