
import { DATE, DECIMAL, INTEGER, Model, STRING } from 'sequelize';
import UserWallet, { IUserWallet } from './user-wallet.model';
import WithdrawalRequest from './withdrawal-request.model';
import Agent from './agent.model';
import DeviceEarningPot, { IDeviceEarningPot } from './device-earning-pot.model';
import { MONEY_TYPE } from './constants/MONEY_DECIMAL';
import User from './user.model';

export default class Transaction extends Model {
  public id!: number;

  public fromWalletId!: number;
  public fromWalletType!: string; //tells what table should we join

  public fromDevicePotId!: number;
  public fromDevicePotType!: string;

  public toWalletId!: number;
  public toWalletType!: string;

  public withdrawId!: number;

  public amount!: string;
  public currency!: string;
  public recType!: string;

  public approverAgentId?: number  ;

  public createdAt!: Date;

  


  public readonly fromDevicePot!: DeviceEarningPot;

  public readonly fromUserWallet!: UserWallet;


  public readonly toWallet!: UserWallet;

  public readonly withdraw!: WithdrawalRequest;

  public readonly approverAgent?: User;


  public static initModel(sequelize: any): typeof Transaction {

    return Transaction.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        approverAgentId: {
          type: INTEGER,
          field: 'approver_agent_id',
        },
        amount: {
          type: MONEY_TYPE,
          allowNull: false,
        },
        currency: {
          type: STRING(255),
          allowNull: false,
          defaultValue: 'USDT',
        },
        recType: {
          type: STRING(20),
        },




        fromWalletId: {
          type: INTEGER,
          field: 'from_wallet_id',
        },

        fromWalletType: {
          type: STRING,
          field: 'from_wallet_type',
        },




        fromDevicePotId: {
          type: INTEGER,
          field: 'from_device_pot_id',
        },

        fromDevicePotType: {
          type: STRING,
          field: 'from_device_pot_type',
        },




        toWalletId: {
          type: INTEGER,
          allowNull: true,
          field: 'to_wallet_id',
        },

        toWalletType: {
          type: STRING,
          allowNull: true,
          field: 'to_wallet_type',
        },



        
        withdrawId: {
          type: INTEGER,
          allowNull: true,
          defaultValue:null,
           field: 'withdrawal_request_id',
        },


        
        createdAt: {
          type: DATE,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          // field: 'requested_at',
        },

      },
      {
        sequelize,
        modelName: 'Transaction',
        tableName: 'transaction',
        timestamps: false,
      }
    );
  }



  public static associate(models: any) {

    Transaction.belongsTo(User, {
      foreignKey: 'approverAgentId',
      as: 'approverAgent',
    });

    Transaction.belongsTo(DeviceEarningPot, {
      foreignKey: 'fromDevicePotId',
      as: 'fromDevicePot'
    })

    Transaction.belongsTo(UserWallet, {
      foreignKey: 'fromWalletId',
      as: 'fromUserWallet'
    })
    Transaction.belongsTo(UserWallet, {
      foreignKey: 'toWalletId',
      as: 'toUserWallet'
    })

    Transaction.belongsTo(WithdrawalRequest, {
      foreignKey: 'withdrawId',
      as: 'withdraw',
    });
  }
}


export interface ITransaction extends Partial<Transaction> {


  
}
