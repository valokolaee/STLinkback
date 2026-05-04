// src/middleware/auth.middleware.ts
import { Request, Response } from 'express';
import Role, { IRole } from '../models/role.model';
import { IUser } from '../models/user.model';
import { agentRoles, customerRoles } from './initialRolesList';
import responserUtils from './responser.utils';

export default async (req: Request, res: Response, user: IUser) => {

  try {
    const r = await Role.findByPk(user.roleId);

    const roleName = r?.name;
    const baseUrl = req.baseUrl.toString().split('/');

    const api = baseUrl.length > 0 ? baseUrl[1] : '';

    var _rolls: IRole[] = [];

    if (api === 'api') {
      _rolls = customerRoles
    } else if (api === 'panel') {
      _rolls = agentRoles;
    } else {

      responserUtils(res, 401, {
        success: false,
        message: 'Invalid access route'
      });
      return;
    }
    


    const _permitted = _rolls.some(obj => obj.name === roleName);
    if (!_permitted) {
      responserUtils(res, 403, {
        success: false,
        message: 'You do not have permission to access this resource'
      });
      return;
    }

  } catch (error: any) {

  }
};