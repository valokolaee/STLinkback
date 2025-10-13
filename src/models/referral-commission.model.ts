// src/models/ReferralCommission.ts
import { Model } from 'sequelize';

export default class ReferralCommission extends Model {
  public id!: number;
  public relationshipId!: number;
  public amount!: number;
  public currency!: 'USD' | 'EUR' | 'IRR';
  public status!: 'pending' | 'paid' | 'cancelled';
  public createdAt!: Date;
  public updatedAt!: Date | null;

  public readonly relationship?: any;

  public static initModel(sequelize: any): typeof ReferralCommission {
    return ReferralCommission.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        relationshipId: {
          type: 'INT',
          allowNull: false,
        },
        amount: {
          type: 'DECIMAL(15,2)',
          allowNull: false,
        },
        currency: {
          type: 'VARCHAR(3)',
          allowNull: false,
          defaultValue: 'USD',
        },
        status: {
          type: 'ENUM("pending", "paid", "cancelled")',
          allowNull: false,
          defaultValue: 'pending',
        },
        createdAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: 'DATETIME',
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'ReferralCommission',
        tableName: 'referral_commissions',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    ReferralCommission.belongsTo(models.ReferralRelationship, {
      foreignKey: 'relationshipId',
      as: 'relationship',
    });
  }
}