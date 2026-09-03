// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import { models } from '../db/db';
import responserUtils from '../utils/responser.utils';
import Role, { IRole } from '../db/models/role.model';
import genericService from '../services/generic.service';
import initialRolesList, { agentRoles, customerRoles } from '../utils/initialRolesList';
import Agent from '../db/models/agent.model';
import User, { IUser } from '../db/models/user.model';
import Customer from '../db/models/customer.model';
import { log } from 'console';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {



  try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }


    const token = authHeader.split(' ')[1];

    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };




    // console.log(decoded);

    // Find user
    const user: IUser = await User.findByPk(decoded.id, {
      include: [
        {
          model: Agent,
          as: 'agent'
        },
        {
          model: Customer,
          as: 'customer'
        },
      ],


      raw: true,  // Returns plain object, no Sequelize methods
      nest: true  // Nests the customer object properly
    }) as IUser;

    if (!user) {

      return responserUtils(res, 401, {
        message: 'User not found',
        success: false,
      })


      
    }




    const baseUrl = req.baseUrl.toString().split('/');

    const apiRout = baseUrl.length > 0 ? baseUrl[1] : '';

    const _isCustomer = user.customer?.id! > 0;
    const _isApi = apiRout === 'api';

    const _isAgent = user.agent?.id! > 0;
    const _isPanel = apiRout === 'panel'

    // log(apiRout, _isCustomer, _isApi, _isAgent, _isPanel)

    if (!((_isCustomer && _isApi) || (_isAgent && _isPanel))) {

      responserUtils(res, 403, {
        success: false,
        message: 'Access Denied'
      });
      return;

    }


    // Attach user to request

    (req as any).user = user;

    next();

  } catch (error: any) {

 
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