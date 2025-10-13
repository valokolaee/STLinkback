// src/models/UserPermission.ts
import { Model } from 'sequelize';

export default class UserPermission extends Model {
  public id!: number;
  public userId!: number;
  public permissionId!: number;

  public static initModel(sequelize: any): typeof UserPermission {
    return UserPermission.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
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
        modelName: 'UserPermission',
        tableName: 'user_permissions',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    UserPermission.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    UserPermission.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });
  }
}