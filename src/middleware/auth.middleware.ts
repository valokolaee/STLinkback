// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';
import { models } from '../db';
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
    // console.log('token', token);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    // console.log(decoded);

    // Find user
    const user = await models.User.findByPk(decoded.id, {
      include: [{ model: models.Role, as: 'role' }]
    });

    // console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

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