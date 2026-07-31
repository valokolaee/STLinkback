import bcrypt from 'bcryptjs';
import { models, sequelize } from '../db/db';
import Role, { IRole } from '../db/models/role.model';
import initialRolesList from './initialRolesList';
import Agent from '../db/models/agent.model';
import User from '../db/models/user.model';
import genericService from '../services/generic.service';




export default async () => {
  try {

    const _roles: IRole[] = initialRolesList;

    for (let index = 0; index < _roles.length; index++) {
      const roleData = _roles[index];

      const existingRole = await models.Role.findOne({
        where: { name: roleData.name }
      });

      if (!!existingRole) {

      } else {
        const role = await models.Role.create(roleData);

      }

    }


  } catch (error) {
    console.error('Error initializing roles:', error);
  }



  try {

    const existingRole = await Role.findOne({ where: { name: 'admin' } });

    const existingAdmin = await User.findOne({ where: { username: 'sec' } });


    if (!!!existingAdmin) {
      const transaction = await sequelize.transaction()

      try {


        const _adminUser = await User.create({ username: 'sec', email: 'sec@michael.mom', passwordHash: await bcrypt.hash('@sec@', 10), }, { transaction });

        const _adminAgent = await Agent.create({ roleId: existingRole ? existingRole.id : 1, userId: _adminUser.id }, { transaction });

        await _adminAgent.update({ id: _adminUser.id, agentId: _adminAgent.id }, { transaction })

        await transaction.commit()

        console.log('Admin user created');
      } catch (error) {
        await transaction.rollback();
        console.log('Admin user NOT created');

        throw error;
      }

    } else {
    }
  } catch (error) {

    console.log(error);

  }



}