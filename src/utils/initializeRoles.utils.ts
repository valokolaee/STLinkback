import bcrypt from 'bcryptjs';
import { models } from '../db';
import Role, { IRole } from '../models/role.model';
import initialRolesList from './initialRolesList';
import Agent from '../models/agent.model';
import User from '../models/user.model';




export default async () => {
  
  try {
    // console.log('Initializing roles...');
    const _roles: IRole[] = initialRolesList;

    for (let index = 0; index < _roles.length; index++) {
      const roleData = _roles[index];

      const existingRole = await models.Role.findOne({
        where: { name: roleData.name }
      });

      if (!!existingRole) {
        // console.log(`Role "${roleData.name}" already exists`);
      } else {
        const role = await models.Role.create(roleData);
        // console.log(`Created new role: ${role.name}`);
      }

    }

    // console.log('Roles initialization completed');
  } catch (error) {
    console.error('Error initializing roles:', error);
  }



  try {
    const existingRole = await Role.findOne({
      where: { name: 'admin' }
    });
    const existingAdmin = await User.findOne({
      where: { username: 'admin' }
    });

    // console.log('existingAdmin', existingAdmin);


    if (!!!existingAdmin) {

      const _adminUser = await User.create(
        {
          username: 'admin',
          email: 'admin@michael.com',
          passwordHash: await bcrypt.hash('michAeel@', 10),
          clientType: 'admin',
        }
      );

      const _adminAgent = await Agent.create(
        {
          roleId: existingRole ? existingRole.id : 1,
          userId: _adminUser.id

        }
      );

      console.log(_adminAgent);

      console.log('Admin user created');
    } else {
      // console.log('Admin user already exists');
    }
  } catch (error) {
    console.log(error);

  }



}