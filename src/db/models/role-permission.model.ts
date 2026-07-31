// src/models/role-permission.model.ts
import { BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';

export default class RolePermission extends Model {
  public id!: number;
  public roleId!: number;
  public permissionId!: number;
  public softDeleted!: boolean;
  public createdAt!: Date;
  public recType!: string;

  public readonly role?: any;
  public readonly permission?: any;

  public static initModel(sequelize: any): typeof RolePermission {
    return RolePermission.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        recType: {
          type: STRING(20),
        },
        roleId: {
          type: INTEGER,
          allowNull: false,
          field: 'role_id',
        },
        permissionId: {
          type: INTEGER,
          allowNull: false,
          field: 'permission_id',
        },
        softDeleted: {
          type: BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        createdAt: {
          type: DATE,
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