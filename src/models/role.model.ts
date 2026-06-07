// src/models/role.model.ts
import { BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';
import User from './user.model';
import Agent from './agent.model';

export default class Role extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public level!: number;
  public isSystem!: boolean;
  public softDeleted!: boolean;
  public createdAt!: Date;

  public readonly users?: Agent[];
  public readonly permissions?: Permissions[];

  public static initModel(sequelize: any): typeof Role {
    return Role.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: STRING(255),
          allowNull: false,
          unique: true,
        },
        description: {
          type: STRING,
          allowNull: true,
        },
        level: {
          type: INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        isSystem: {
          type: BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_system',
        },
        softDeleted: {
          type: BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        createdAt: {
          type: DATE,
          defaultValue: sequelize.literal('UTC_TIMESTAMP()'),
          field: 'created_at',
        },
      },
      {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    // Role.hasMany(models.User, {
    //   foreignKey: 'roleId',
    //   as: 'users',
    // });

    // Role.belongsTo(Agent, {

    // })
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions',
    });
  }
}



export interface IRole extends Partial<Role> { }