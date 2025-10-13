// src/migrations/1-create-roles-table.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig';

export const up = async () => {
  await sequelize.getQueryInterface().createTable('roles', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: false,
    updatedAt: false,
  });
};

export const down = async () => {
  await sequelize.getQueryInterface().dropTable('roles');
};