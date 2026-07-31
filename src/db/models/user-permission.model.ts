// src/models/role-permission.model.ts
import {  BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';

export default class UserPermission extends Model {
  public id!: number;
  public userId!: number;
  public permissionId!: number;
  public softDeleted!: boolean;
  public createdAt!: Date;
  public recType!: string;

  public readonly permission?: any;

  public static initModel(sequelize: any): typeof UserPermission {
    return UserPermission.init(
      {
        id: {
          type:INTEGER, // 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        recType: {
          type: STRING(20),
        },
        userId: {
          type: INTEGER, // 'INT',
          allowNull: false,
          field: 'role_id',
        },
        permissionId: {
          type: INTEGER, // 'INT',
          allowNull: false,
          field: 'permission_id',
        },
        softDeleted: {
          type: BOOLEAN, // 'BOOLEAN',
          allowNull: true,
          defaultValue: false
        },
        createdAt: {
          type: DATE, // 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
      },
      {
        sequelize,
        modelName: 'UserPermission',
        tableName: 'user_permissions',
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
    UserPermission.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    UserPermission.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });
  }
}