// src/models/Rank.ts
import { Model } from 'sequelize';

export default class Rank extends Model {
  public id!: number;
  public name!: string;
  public minScore!: number;
  public maxScore!: number | null;
  public benefits!: object | null;
  public isActive!: boolean;
  public image!: string | null;

  public static initModel(sequelize: any): typeof Rank {
    return Rank.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: 'VARCHAR(255)',
          allowNull: false,
          unique: true,
        },
        minScore: {
          type: 'INT',
          allowNull: false,
          defaultValue: 0,
        },
        maxScore: {
          type: 'INT',
          allowNull: true,
        },
        benefits: {
          type: 'JSON',
          allowNull: true,
        },
        isActive: {
          type: 'BOOLEAN',
          allowNull: false,
          defaultValue: true,
        },
        image: {
          type: 'TEXT',
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Rank',
        tableName: 'rank',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    Rank.hasMany(models.User, {
      foreignKey: 'rankId',
      as: 'users',
    });
  }
}