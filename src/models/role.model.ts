// src/models/Role.ts
import { Model } from 'sequelize';

export default class Role extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;

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