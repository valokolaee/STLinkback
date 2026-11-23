// src/middleware/auth.middleware.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import Agent from '../db/models/agent.model';
import Client from '../db/models/client.model';
import User, { IUser } from '../db/models/user.model';
import responserUtils from '../utils/responser.utils';

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
          model: Client,
          as: 'client'
        },
      ],


      raw: true,  // Returns plain object, no Sequelize methods
      nest: true  // Nests the client object properly
    }) as IUser;

    if (!user) {

      return responserUtils(res, 401, {
        message: 'User not found',
        success: false,
      })



    }




    const baseUrl = req.baseUrl.toString().split('/');

    const apiRout = baseUrl.length > 0 ? baseUrl[1] : '';

    const _isClient = user.client?.id! > 0;
    const _isApi = apiRout === 'api';

    const _isAgent = user.agent?.id! > 0;
    const _isPanel = apiRout === 'panel'


    
    if (!((_isClient && _isApi) || (_isAgent && _isPanel))) {

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