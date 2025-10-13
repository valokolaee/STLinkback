// src/models/user.model.ts
import { Model } from 'sequelize';

export default class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public passwordHash!: string;
  public roleId!: number;
  public clientType!: 'individual' | 'financial_entities' | 'business';
  public referralCode!: string | null;
  public referrer!: number | null;
  public rankId!: number | null;
  public logoUrl!: string | null;
  public profileImage!: string | null;
  public csvUrl!: string | null;
  public createdAt!: Date;

  public readonly role?: any;
  public readonly rank?: any;
  public readonly referredUsers?: any[];
  public readonly pools?: any[];
  public readonly banks?: any[];

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
        roleId: {
          type: 'INT',
          allowNull: false,
          field: 'role_id',
        },
        clientType: {
          type: 'ENUM("individual", "financial_entities", "business")',
          allowNull: false,
          field: 'client_type',
        },
        referralCode: {
          type: 'VARCHAR(255)',
          allowNull: true,
          unique: true,
          field: 'referral_code',
        },
        referrer: {
          type: 'INT',
          allowNull: true,
          field: 'referred_by',
        },
        rankId: {
          type: 'INT',
          allowNull: true,
          field: 'rank_id',
        },
        logoUrl: {
          type: 'VARCHAR(255)',
          allowNull: true,
          field: 'logo_url',
        },
        profileImage: {
          type: 'VARCHAR(255)',
          allowNull: true,
          field: 'profile_image',
        },
        csvUrl: {
          type: 'VARCHAR(255)',
          allowNull: true,
          field: 'csv_url',
        },
        createdAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
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

    User.belongsTo(models.Rank, {
      foreignKey: 'rankId',
      as: 'rank',
    });

    User.hasMany(models.ReferralRelationship, {
      foreignKey: 'referrer',
      as: 'referredUsers',
    });

    User.hasMany(models.Pool, {
      foreignKey: 'userId',
      as: 'pools',
    });

    User.hasMany(models.Bank, {
      foreignKey: 'userId',
      as: 'banks',
    });

    User.belongsToMany(models.Permission, {
      through: models.UserPermission,
      foreignKey: 'userId',
      otherKey: 'permissionId',
      as: 'permissions',
    });
  }
}
