// src/models/Permission.ts
import { Model } from 'sequelize';

export default class Permission extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;

  public static initModel(sequelize: any): typeof Permission {
    return Permission.init(
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
        modelName: 'Permission',
        tableName: 'permissions',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'roles',
    });

    Permission.belongsToMany(models.User, {
      through: models.UserPermission, 
      foreignKey: 'permissionId',
      otherKey: 'userId',
      as: 'users',
    });
  }
}