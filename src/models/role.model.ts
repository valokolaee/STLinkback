// src/models/role.model.ts
import { Model } from 'sequelize';

export default class Role extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public level!: number;
  public isSystem!: boolean;
  public softDeleted!: boolean;
  public createdAt!: Date;

  public readonly users?: any[];
  public readonly permissions?: any[];

  public static initModel(sequelize: any): typeof Role {
    return Role.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: 'VARCHAR(255)',
          allowNull: false,
          unique: true,
        },
        description: {
          type: 'TEXT',
          allowNull: true,
        },
        level: {
          type: 'INT',
          allowNull: false,
          defaultValue: 0,
        },
        isSystem: {
          type: 'BOOLEAN',
          allowNull: false,
          defaultValue: false,
          field: 'is_system',
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
        modelName: 'Role',
        tableName: 'roles',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users',
    });

    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions',
    });
  }
}



export interface IRole extends Partial<Role>{}