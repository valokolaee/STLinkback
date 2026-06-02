// src/models/permission.model.ts
import { BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';

export default class Permission extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public module!: string;
  public action!: string;
  public softDeleted!: boolean;
  public createdAt!: Date;

  public readonly roles?: any[];

  public static initModel(sequelize: any): typeof Permission {
    return Permission.init(
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
        module: {
          type: STRING(100),
          allowNull: false,
        },
        action: {
          type: STRING(100),
          allowNull: false,
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
  }
}