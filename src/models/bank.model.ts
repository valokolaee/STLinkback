// src/models/bank.model.ts
import { Model } from 'sequelize';

export default class Bank extends Model {
  public id!: number;
  public name!: string;
  public userId!: number; // Model property name
  public poolId!: number | null;
  public profit!: string;
  public level!: string | null;
  public desc!: string | null;
  public logo!: string | null;
  public hasLoan!: boolean | null;
  public valueJson!: object | null;
  public csvUrl!: string | null;
  public updatedAt!: Date;

  public static initModel(sequelize: any): typeof Bank {
    return Bank.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: 'VARCHAR(255)',
          allowNull: false,
        },
        // Crucial part: Map JS property 'userId' to DB column 'user_id'
        userId: {
          type: 'INT',
          allowNull: false,
          field: 'user_id', // This links the JS property to the correct DB column
        },
        poolId: {
          type: 'INT',
          allowNull: true,
          field: 'pool_id',
        },
        profit: {
          type: 'VARCHAR(255)',
          allowNull: false,
        },
        level: {
          type: 'VARCHAR(255)',
          allowNull: true,
        },
        desc: {
          type: 'TEXT',
          allowNull: true,
        },
        logo: {
          type: 'TEXT',
          allowNull: true,
        },
        hasLoan: {
          type: 'BOOLEAN',
          allowNull: true,
          field: 'has_loan',
        },
        valueJson: {
          type: 'JSON',
          allowNull: true,
          field: 'value_json',
        },
        csvUrl: {
          type: 'VARCHAR(255)',
          allowNull: true,
          field: 'csv_url',
        },
        updatedAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at',
        },
      },
      {
        sequelize,
        modelName: 'Bank',
        tableName: 'banks',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    Bank.belongsTo(models.User, {
      foreignKey: 'userId', 
      as: 'owner',
    });

    Bank.belongsTo(models.Pool, {
      foreignKey: 'poolId',
      as: 'pool',
    });

    Bank.hasMany(models.BankService, {
      foreignKey: 'bankId',
      as: 'services',
    });
  }
}