// src/migrations/2-create-users-table.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig';

export const up = async () => {
  await sequelize.getQueryInterface().createTable('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    client_type: {
      type: DataTypes.ENUM('individual', 'financial_entities', 'business'),
      allowNull: false,
    },
    referral_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    referred_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'referral_code',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    rank_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    logo_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    csv_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  });
};

export const down = async () => {
  await sequelize.getQueryInterface().dropTable('users');
};