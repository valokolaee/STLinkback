// src/models/index.ts
import Agent from './agent.model.js';
import Customer from './customer.model.js';
import DeviceAlert from './device-alert.model.js';
import DeviceEarning from './device-earning.model.js';
import DeviceMetric from './device-metric.model.js';
import DeviceSpecification from './device-specification.model.js';
import MiningDevice from './mining-device.model.js';
import MiningSession from './mining-session.model.js';
import MiningWallet from './mining-wallet.model.js';
import Permission from './permission.model.js';
import RolePermission from './role-permission.model.js';
import Role from './role.model.js';
import Setting from './setting.model.js';
import Transaction from './transaction.model.js';
import UserPermission from './user-permission.model.js';
import UserSession from './user-session.model.js';
import UserWallet from './user-wallet.model.js';
import User from './user.model.js';
import WithdrawalRequest from './withdrawal-request.model.js';

const initModels = (sequelize: any) => {
  const models = {
    User: User.initModel(sequelize),

    Role: Role.initModel(sequelize),
    Permission: Permission.initModel(sequelize),
    RolePermission: RolePermission.initModel(sequelize),
    UserSession: UserSession.initModel(sequelize),
    MiningDevice: MiningDevice.initModel(sequelize),
    DeviceSpecification: DeviceSpecification.initModel(sequelize),
    WithdrawalRequest: WithdrawalRequest.initModel(sequelize),
    DeviceMetric: DeviceMetric.initModel(sequelize),
    DeviceAlert: DeviceAlert.initModel(sequelize),
    MiningSession: MiningSession.initModel(sequelize),
    DeviceEarning: DeviceEarning.initModel(sequelize),
    MiningWallet: MiningWallet.initModel(sequelize),
    UserWallet: UserWallet.initModel(sequelize),
    
    Agent: Agent.initModel(sequelize),
    Customer: Customer.initModel(sequelize),
    Setting: Setting.initModel(sequelize),
    Transaction: Transaction.initModel(sequelize),
    UserPermission: UserPermission.initModel(sequelize),
  
  };

  Object.values(models).forEach((model: any) => {
    if (model.associate) {
      model.associate(models);
    }
  });





  return models;
};

export default initModels;