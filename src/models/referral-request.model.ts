// src/models/ReferralRequest.ts
import { Model } from 'sequelize';

export default class ReferralRequest extends Model {
  public id!: number;
  public userId!: number;
  public referrerCode!: string;
  public status!: 'pending' | 'approved' | 'rejected';
  public createdAt!: Date;
  public processedAt!: Date | null;
  public processedBy!: number | null;

  public readonly user?: any;
  public readonly processedByUser?: any;

  public static initModel(sequelize: any): typeof ReferralRequest {
    return ReferralRequest.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: 'INT',
          allowNull: false,
        },
        referrerCode: {
          type: 'VARCHAR(255)',
          allowNull: false,
        },
        status: {
          type: 'ENUM("pending", "approved", "rejected")',
          allowNull: false,
          defaultValue: 'pending',
        },
        createdAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        processedAt: {
          type: 'DATETIME',
          allowNull: true,
        },
        processedBy: {
          type: 'INT',
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'ReferralRequest',
        tableName: 'referral_requests',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    ReferralRequest.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    ReferralRequest.belongsTo(models.User, {
      foreignKey: 'processedBy',
      as: 'processedByUser',
    });
  }
}