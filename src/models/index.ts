// src/models/index.ts
import User from './user.model';
import Role from './role.model';
import Rank from './rank.model';
import Permission from './permission.model';
import RolePermission from './role-permission.model';
import UserPermission from './user-permission.model';
import ReferralRelationship from './referral-relationship.model';
import ReferralCommission from './referral-commission.model';
import ReferralRequest from './referral-request.model';
import Pool from './pool.model';
import PoolService from './pool.service';
import Bank from './bank.model';
import BankService from './bank.service';

/**
 * Initializes all models with the provided Sequelize instance.
 * Sets up associations between models based on their defined `associate` method.
 */
const initModels = (sequelize: any) => {
  const models = {
    User: User.initModel(sequelize),
    Role: Role.initModel(sequelize),
    Rank: Rank.initModel(sequelize),
    Permission: Permission.initModel(sequelize),
    RolePermission: RolePermission.initModel(sequelize),
    UserPermission: UserPermission.initModel(sequelize),
    ReferralRelationship: ReferralRelationship.initModel(sequelize),
    ReferralCommission: ReferralCommission.initModel(sequelize),
    ReferralRequest: ReferralRequest.initModel(sequelize),
    Pool: Pool.initModel(sequelize),
    PoolService: PoolService.initModel(sequelize),
    Bank: Bank.initModel(sequelize),
    BankService: BankService.initModel(sequelize),
  };

  // Setup associations
  Object.values(models).forEach((model: any) => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
};

export default initModels;