// src/models/role-permission.model.ts
import { DataTypes, Model } from 'sequelize';

export default class UserPermission extends Model {
  public id!: number;
  public userId!: number;
  public permissionId!: number;
  public softDeleted!: boolean;
  public createdAt!: Date;

  public readonly permission?: any;

  public static initModel(sequelize: any): typeof UserPermission {
    return UserPermission.init(
      {
        id: {
          type:DataTypes.INTEGER, // 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER, // 'INT',
          allowNull: false,
          field: 'role_id',
        },
        permissionId: {
          type: DataTypes.INTEGER, // 'INT',
          allowNull: false,
          field: 'permission_id',
        },
        softDeleted: {
          type: DataTypes.BOOLEAN, // 'BOOLEAN',
          allowNull: true,
          defaultValue: false
        },
        createdAt: {
          type: DataTypes.DATE, // 'DATETIME',
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