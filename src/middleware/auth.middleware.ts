// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import { models } from '../db';
import responserUtils from '../utils/responser.utils';
import Role, { IRole } from '../models/role.model';
import genericService from '../services/generic.service';
import initialRolesList, { agentRoles, customerRoles } from '../utils/initialRolesList';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // console.log('path', req.path);
  // console.log('originalUrl', req.originalUrl);
  // console.log('url', req.url);
  // console.log('baseUrl', req.baseUrl);

  try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }


    const token = authHeader.split(' ')[1];
    // console.log('token', token);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    // console.log(decoded);

    // Find user
    const user = await models.User.findByPk(decoded.id, {
      include: [{ model: models.Role, as: 'role' }]
    });


    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // console.log(user.roleId);
    const r = await Role.findByPk(user.roleId);
    // const r = await Role.findByPk(1)
    // r?.update({ name: 'customer' })
    const roleName = r?.name;
    const baseUrl = req.baseUrl.toString().split('/');

    const api = baseUrl.length > 0 ? baseUrl[1] : '';

    // console.log(api, roleName);


    var _rolls: IRole[] = [];
    // console.log(_rolls);


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



    // console.log(roleName, api, _permitted);

    // const _permitted = _rolls.some(obj => obj.name === 'Bob');


    // const customerPermitted = api === 'api' && roleName === 'customer';
    // const userPermitted = api === 'api' && roleName === 'customer';
    //  const _rolls: IRole[] =initialRolesList

    // for (let index = 0; index < agentRoles.length; index++) {
    //   const role = await models.Role.create(agentRoles[index])
    // }
    // console.log((await Role.findAll()));

    // check if user has permission to access the route
    // genericService(models.User).update({
    //   id: user.id, roleId: 2
    // });
    // responserUtils(res, 400, {});
    // return res.status(401).json({
    //   success: false,
    //   error: 'User not found'
    // });


    // Attach user to request

    (req as any).user = user;

    next();

  } catch (error: any) {

    // console.log(error); 

    if (error.name === 'JsonWebTokenError') {
      return responserUtils(res, 401, {
        success: false,
        message: 'Invalid token format; please login'
      })

    }

    if (error.name === 'TokenExpiredError') {
      return responserUtils(res, 401, {
        success: false,
        message: 'Token expired; please login'
      })
    }

    return responserUtils(res, 401, {
      success: false,
      message: 'Invalid token; please login'
    })

  }
};