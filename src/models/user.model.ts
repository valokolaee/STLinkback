// src/models/user.model.ts
import { Model } from 'sequelize';

export default class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public passwordHash!: string;
  public phone!: string | null;
  public firstName!: string | null;
  public lastName!: string | null;
  public roleId!: number;
  public profileImageUrl!: string | null;
  public logoUrl!: string | null;
  public isActive!: boolean;
  public emailVerified!: boolean;
  public phoneVerified!: boolean;
  public lastLogin!: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date | null;

  public readonly role?: any;
  public readonly sessions?: any[];
  public readonly miningDevices?: any[];
  public readonly miningWallets?: any[];
  public readonly withdrawalRequests?: any[];

  public static initModel(sequelize: any): typeof User {
    return User.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: 'VARCHAR(255)',
          allowNull: false,
          unique: true,
        },
        email: {
          type: 'VARCHAR(255)',
          allowNull: false,
          unique: true,
        },
        passwordHash: {
          type: 'TEXT',
          allowNull: false,
          field: 'password_hash',
        },
        phone: {
          type: 'VARCHAR(20)',
          allowNull: true,
        },
        firstName: {
          type: 'VARCHAR(100)',
          allowNull: true,
          field: 'first_name',
        },
        lastName: {
          type: 'VARCHAR(100)',
          allowNull: true,
          field: 'last_name',
        },
        roleId: {
          type: 'INT',
          allowNull: false,
          field: 'role_id',
        },
        profileImageUrl: {
          type: 'VARCHAR(255)',
          allowNull: true,
          field: 'profile_image_url',
        },
        logoUrl: {
          type: 'VARCHAR(255)',
          allowNull: true,
          field: 'logo_url',
        },
        isActive: {
          type: 'BOOLEAN',
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        emailVerified: {
          type: 'BOOLEAN',
          allowNull: false,
          defaultValue: false,
          field: 'email_verified',
        },
        phoneVerified: {
          type: 'BOOLEAN',
          allowNull: false,
          defaultValue: false,
          field: 'phone_verified',
        },
        lastLogin: {
          type: 'DATETIME',
          allowNull: true,
          field: 'last_login',
        },
        createdAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        updatedAt: {
          type: 'DATETIME',
          allowNull: true,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    User.hasMany(models.UserSession, {
      foreignKey: 'userId',
      as: 'sessions',
    });

    User.hasMany(models.MiningDevice, {
      foreignKey: 'userId',
      as: 'miningDevices',
    });

    User.hasMany(models.MiningWallet, {
      foreignKey: 'userId',
      as: 'miningWallets',
    });

    User.hasMany(models.WithdrawalRequest, {
      foreignKey: 'userId',
      as: 'withdrawalRequests',
    });

    User.hasMany(models.DeviceAlert, {
      foreignKey: 'resolvedBy',
      as: 'resolvedAlerts',
    });

    User.hasMany(models.WithdrawalRequest, {
      foreignKey: 'processedBy',
      as: 'processedWithdrawals',
    });
  }
}



export interface IUser extends Partial<User>{}