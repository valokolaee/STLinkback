import { BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';
import User from './user.model';
import Role from './role.model';

export default class Agent extends Model {

  public id!: number;
  public userId!: number;
  public roleId!: number;
  public createdAt!: Date;
  public softDeleted!: boolean;
  public recType!: string;


  public readonly extraPermissions?: Permissions;
  public readonly user?: User;
  public readonly role?: Role;

  public static initModel(sequelize: any): typeof Agent {
    return Agent.init(
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
          unique: true

        },
        roleId: {
          type: INTEGER,
          allowNull: false,
          field: 'role_id',
        },
        createdAt: {
          type: DATE,// 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        softDeleted: {
          type: BOOLEAN,// 'BOOLEAN',
          allowNull: true,
          defaultValue: false
        },


      },
      {
        sequelize,
        modelName: 'Agent',
        tableName: 'agents',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {

 


    // Agent.belongsTo(User, {
    //   foreignKey: 'user_id',
    //   as: 'user'
    // });

    Agent.belongsTo(Role, {
      foreignKey: 'role_id',
      as: 'role'

    })


  }
}



export interface IAgent extends Partial<Agent> {
}