import { BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';
import MiningDevice, { IMiningDevice } from './mining-device.model';
import DeviceEarningPot, { IDeviceEarningPot } from './device-earning-pot.model';
import User, { IUser } from './user.model';
import DevicePotAssignment from './device-pot-assignment';
// DeviceAffiliateAssignment
export default class DeviceAffiliate extends Model {

  public id!: number;
  public potId!: number;//this the  affiliate's pot and device's

  public affiliateId!: number;
  public percent!: number;
  public potAssignmentId!: number;

  public description!: string | null;
  public recType!: string;
  public softDeleted!: boolean;
  public assignedAt!: Date;
  public unassignedAt!: Date;
  public createdAt!: Date;
  public creatorId!: number;//creator Id: the agent who created this device at the first place


  public static initModel(sequelize: any): typeof DeviceAffiliate {

    return DeviceAffiliate.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        recType: {
          type: STRING(20),
        },
        potAssignmentId: {
          type: INTEGER,
          allowNull: false,
          field: 'pot_assignment_id',
          references: {
            model: 'device_pot_assignments',
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

        affiliateId: {
          type: INTEGER,
          allowNull: false,
          field: 'affiliate_id',
          references: {
            model: 'users',
            key: 'id',
          },
        },

        percent: {
          type: INTEGER,
          allowNull: false,
          field: 'percent',
          validate: {
            min: 0,
            max: 100,
            isInt: true
          }
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
        modelName: 'DeviceAffiliate',
        tableName: 'device_affiliate',
        timestamps: false,

        indexes: [

          {
            fields: ['pot_assignment_id'],
          },
          {
            fields: ['affiliate_id'],
          },


        ],
      });


  }

  public static associate(models: any) {

    DeviceAffiliate.belongsTo(User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });

    DeviceAffiliate.belongsTo(DevicePotAssignment, {
      foreignKey: 'potAssignmentId',
      as: 'device',
    });

    DeviceAffiliate.belongsTo(DeviceEarningPot, {
      foreignKey: 'potId',
      as: 'pot',
    });
    DeviceAffiliate.belongsTo(User, {
      foreignKey: 'affiliateId',
      as: 'affiliate',
    });

  }
}



export interface IDeviceAffiliate extends Partial<DeviceAffiliate> {
  pot?: IDeviceEarningPot
  device?: IMiningDevice
  affiliate: IUser
}