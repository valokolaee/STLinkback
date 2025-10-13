// src/models/referral-relationship.model.ts
import { Model } from 'sequelize';

export default class ReferralRelationship extends Model {
  public id!: number;
  public referrerId!: number; 
  public refereeId!: number; 
  public levelPyramid!: number;
  public isActive!: boolean;
  public createdAt!: Date;

  public static initModel(sequelize: any): typeof ReferralRelationship {
    return ReferralRelationship.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        referrerId: {
          type: 'INT',
          allowNull: false,
          field: 'referrer'
        },
        refereeId: {
          type: 'INT',
          allowNull: false,
          field: 'referee' 
        },
        levelPyramid: {
          type: 'INT',
          allowNull: false,
          defaultValue: 1,
          field: 'level_pyramid',
        },
        isActive: {
          type: 'BOOLEAN',
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        createdAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
      },
      {
        sequelize,
        modelName: 'ReferralRelationship',
        tableName: 'referral_relationships',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {
    ReferralRelationship.belongsTo(models.User, {
      foreignKey: 'referrerId',
      as: 'referrerUser', 
    });

    ReferralRelationship.belongsTo(models.User, {
      foreignKey: 'refereeId', 
      as: 'refereeUser', 
    });

    ReferralRelationship.hasMany(models.ReferralCommission, {
      foreignKey: 'relationshipId',
      as: 'commissions',
    });
  }
}