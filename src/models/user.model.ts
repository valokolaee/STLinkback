// src/models/user.model.ts
import { BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize';
import Agent, { IAgent } from './agent.model';
import { ICustomer } from './customer.model';

export default class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public passwordHash!: string;
  public phone!: string | null;
  public firstName!: string | null;
  public lastName!: string | null;
  public profileImageUrl!: string | null;
  public logoUrl!: string | null;
  public isActive!: boolean;
  public emailVerified!: boolean;
  public phoneVerified!: boolean;
  public lastLogin!: Date | null;
  public createdAt!: Date;
  public softDeleted!: boolean;
  public updatedAt!: Date | null;




  public static initModel(sequelize: any): typeof User {
    return User.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: STRING(255),
          allowNull: false,
          unique: true,
        },
        email: {
          type: STRING(255),
          allowNull: false,
          unique: true,
        },
        passwordHash: {
          type: STRING,
          allowNull: false,
          field: 'password_hash',
        },
        phone: {
          type: STRING(20),
          allowNull: true,
        },
        firstName: {
          type: STRING(100),
          allowNull: true,
          field: 'first_name',
        },
        lastName: {
          type: STRING(100),
          allowNull: true,
          field: 'last_name',
        },

        profileImageUrl: {
          type: STRING(255),
          allowNull: true,
          field: 'profile_image_url',
        },
        logoUrl: {
          type: STRING(255),
          allowNull: true,
          field: 'logo_url',
        },
        isActive: {
          type: BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        emailVerified: {
          type: BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'email_verified',
        },
        phoneVerified: {
          type: BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'phone_verified',
        },
        lastLogin: {
          type: DATE,
          allowNull: true,
          field: 'la`st_login',
        },
        createdAt: {
          type: DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        softDeleted: {
          type: BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        updatedAt: {
          type: DATE,
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

    // User.hasOne(Agent, {
    //   foreignKey: 'userId',
    //   as: 'agent',
    // });




  }
}



export interface IUser extends Partial<User> {
  token?: string;
  customer?: ICustomer;
  agent?: IAgent;
}