// src/models/role-permission.model.ts
import { Model } from 'sequelize';

export default class RolePermission extends Model {
  public id!: number;
  public roleId!: number;
  public permissionId!: number;
  public softDeleted!: boolean;
  public createdAt!: Date;

  public readonly role?: any;
  public readonly permission?: any;

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
          field: 'role_id',
        },
        permissionId: {
          type: 'INT',
          allowNull: false,
          field: 'permission_id',
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
        modelName: 'RolePermission',
        tableName: 'role_permissions',
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['role_id', 'permission_id']
          }
        ]
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