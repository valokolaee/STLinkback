"use strict";

module.exports = {
  async up(queryInterface: any, sequelize: any) {
 
    await queryInterface.createWithdrawalRequestSchema(
      {
        id: {
          type: 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: 'INT',
          allowNull: false,
          field: 'user_id',
        },
        amount: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
        },
        currency: {
          type: 'VARCHAR(10)',
          allowNull: false,
          defaultValue: 'BTC',
        },
        walletAddress: {
          type: 'VARCHAR(255)',
          allowNull: false,
          field: 'wallet_address',
        },
        transactionHash: {
          type: 'VARCHAR(255)',
          allowNull: true,
          unique: true,
          field: 'transaction_hash',
        },
        status: {
          type: 'ENUM("pending", "processing", "completed", "failed", "cancelled")',
          allowNull: false,
          defaultValue: 'pending',
        },
        networkFee: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'network_fee',
        },
        serviceFee: {
          type: 'DECIMAL(15,8)',
          allowNull: false,
          defaultValue: 0.00000000,
          field: 'service_fee',
        },
        requestedAt: {
          type: 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'requested_at',
        },
        processedAt: {
          type: 'DATETIME',
          allowNull: true,
          field: 'processed_at',
        },
        softDeleted: {
          type: 'BOOLEAN',
          allowNull: true,
          defaultValue: false
        },
        processedBy: {
          type: 'INT',
          allowNull: true,
          field: 'processed_by',
        },
      },
      {
        sequelize,
        modelName: 'WithdrawalRequest',
        tableName: 'withdrawal_requests',
        timestamps: false,
        indexes: [
          {
            fields: ['user_id']
          },
          {
            fields: ['status', 'requested_at']
          }
        ]
      }
    )
    
  },

  async down(queryInterface: any, sequelize: any) {

    
  },
};
