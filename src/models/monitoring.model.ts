// src/models/user.model.ts
import { Model } from 'sequelize';

export default class Monitoring extends Model {
  public id!: number;

  public startTime!: Date|null;
  public workingDays!: number;  
  public totalRevenue!: number;
  public localUptime!: number;
  public connectedPeers!: number;
  public maxObserved!: number;
  public maxUnvalidated!: number;
  public lastBestTip!: number;
  public delegatorCount!: number;
  public stackingKeyPairs!: number;
  public blocksProduced!: number;
  public slotsWon !: number;
  public farmHashRate!: number;
  public walletBalance!: number;
 
  public miner1Algo!: string;
  public miner2Algo!: string;

  public snarkFeePerBlock!: number;
  public lastSnarkWorkReceived!: number;
  public transactionFeePerBlock!: number;
  public lastTransactionReceived!: number;

   
  public static initModel(sequelize: any): typeof Monitoring {
    return Monitoring.init(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },

        startTime: {
          type: 'DATETIME',
          allowNull: true,
         },
        workingDays: {
          type: 'INT',
          allowNull: true,
          unique: true,
        },
        totalRevenue: {
          type: 'INT',
          allowNull: true,
         },
        localUptime: {
          type: 'INT',
          allowNull: true,
        },
        connectedPeers: {
          type: 'INT',
          allowNull: true,
        },
        maxObserved: {
          type: 'INT',
          allowNull: true,
          unique: true,
          field: 'referral_code',
        },
        maxUnvalidated: {
          type: 'INT',
          allowNull: true,
        },
        lastBestTip: {
          type: 'INT',
          allowNull: true,
        },
        delegatorCount: {
          type: 'INT',
          allowNull: true,
        },
        stackingKeyPairs: {
          type: 'INT',
          allowNull: true,
        },
        blocksProduced: {
          type: 'INT',
          allowNull: true,
        },
        slotsWon: {
          type: 'INT',
          allowNull: true,
        },
        farmHashRate: {
          type: 'INT',
          allowNull: true,
        },
        walletBalance: {
          type: 'INT',
          allowNull: true,
        },
        miner1Algo: {
          type: 'VARCHAR(50)',
          allowNull: true,
        },
        miner2Algo: {
          type: 'VARCHAR(50)',
          allowNull: true,
        },


        snarkFeePerBlock: {
          type: 'INT',
          allowNull: true,
        },
        lastSnarkWorkReceived: {
          type: 'INT',
          allowNull: true,
        },
        transactionFeePerBlock: {
          type: 'INT',
          allowNull: true,
        },
        lastTransactionReceived: {
          type: 'INT',
          allowNull: true,
        },
 
      },
      {
        sequelize,
        modelName: 'Monitoring',
        tableName: 'monitorings',
        timestamps: true,
      }
    );
  }

  public static associate(models: any) {
    
    
  }
}
