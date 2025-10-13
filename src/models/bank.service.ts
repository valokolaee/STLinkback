// src/models/bank.service.ts
import { Model } from 'sequelize';

export default class BankService extends Model {
  public id!: number;
  public bankId!: number;
  public key!: string;
  public value!: string;

  public static initModel(sequelize: any): typeof BankService {
    return BankService.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        bankId: {
          type: 'INT',
          allowNull: false,
          field: 'bankId', // maybe in db.schema: bank.id
        },
        key: {
          type: 'VARCHAR(255)',
          allowNull: false,
        },
        value: {
          type: 'VARCHAR(255)',
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'BankService',
        tableName: 'banks_service',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    BankService.belongsTo(models.Bank, {
      foreignKey: 'bankId',
      as: 'bank',
    });
  }
}