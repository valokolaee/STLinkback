// src/models/RolePermission.ts
import { Model } from 'sequelize';

export default class RolePermission extends Model {
  public id!: number;
  public roleId!: number;
  public permissionId!: number;

  public static initModel(sequelize: any): typeof RolePermission {
    return RolePermission.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        roleId: {
          type: 'INT',
          allowNull: false,
        },
        permissionId: {
          type: 'INT',
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'RolePermission',
        tableName: 'role_permissions',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    RolePermission.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    RolePermission.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });
  }
}