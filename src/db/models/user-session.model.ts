// src/models/user-session.model.ts
import { BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';

export default class UserSession extends Model {
  public id!: number;
  public userId!: number;
  public token!: string;
  public ipAddress!: string | null;
  public userAgent!: string | null;
  public expiresAt!: Date;
  public isActive!: boolean;
  public softDeleted!: boolean;
  public createdAt!: Date;
  public recType!: string;

  public readonly user?: any;

  public static initModel(sequelize: any): typeof UserSession {
    return UserSession.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        recType: {
          type: STRING(20),
        },
        userId: {
          type: INTEGER,
          allowNull: false,
          field: 'user_id',
        },
        token: {
          type: STRING(255),
          allowNull: false,
          unique: true,
        },
        ipAddress: {
          type: STRING(45),
          allowNull: true,
          field: 'ip_address',
        },
        userAgent: {
          type: STRING,
          allowNull: true,
          field: 'user_agent',
        },
        expiresAt: {
          type: DATE,
          allowNull: false,
          field: 'expires_at',
        },
        isActive: {
          type: BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        softDeleted: {
          type: BOOLEAN,
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
        modelName: 'UserSession',
        tableName: 'user_sessions',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    UserSession.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}