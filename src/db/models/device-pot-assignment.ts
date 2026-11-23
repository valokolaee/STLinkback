import { BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';
import MiningDevice, { IMiningDevice } from './mining-device.model';
import DeviceEarningPot, { IDeviceEarningPot } from './device-earning-pot.model';
import User from './user.model';

export default class DevicePotAssignment extends Model {

  public id!: number;
  public potId!: number;
  public deviceId!: number;
  public description!: string | null;
  public recType!: string;
  public softDeleted!: boolean;
  public assignedAt!: Date;
  public unassignedAt!: Date;
  public createdAt!: Date; 
  public creatorId!: number;//creator Id: the agent who created this device at the first place

  
  public static initModel(sequelize: any): typeof DevicePotAssignment {

    return DevicePotAssignment.init(
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
          references: {
            model: 'mining_devices',
            key: 'id',
          },
        },
        creatorId: {
          type: INTEGER,
          allowNull: false,
        },
        potId: {
          type: INTEGER,
          allowNull: false,
          field: 'pot_id',
          references: {
            model: 'device_earning_pots',
            key: 'id',
          },
        },

        assignedAt: {
          type: DATE,
          allowNull: false,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'assigned_at',
        },

        unassignedAt: {
          type: DATE,
          allowNull: true,
          field: 'unassigned_at',
        },

        description: {
          type: STRING(255),
          allowNull: true,
        },

        createdAt: {
          type: DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },

        softDeleted: {
          type: BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
      },
      
      {
        sequelize,
        modelName: 'DevicePotAssignment',
        tableName: 'device_pot_assignments',
        timestamps: false,

        indexes: [
          {
            fields: ['device_id'],
          },
          {
            fields: ['pot_id'],
          },
          {
            fields: ['assigned_at'],
          },
          {
            unique: true,
            fields: ['device_id', 'pot_id'],
          },
        ],
      });

  
  }

  public static associate(models: any) {
    DevicePotAssignment.belongsTo(User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });

    DevicePotAssignment.belongsTo(MiningDevice, {
      foreignKey: 'deviceId',
      as: 'device',
    });

    DevicePotAssignment.belongsTo(DeviceEarningPot, {
      foreignKey: 'potId',
      as: 'pot',
    });

  }
}



export interface IDevicePotAssignment extends Partial<DevicePotAssignment> {
  pot?: IDeviceEarningPot
  device?:IMiningDevice

 }