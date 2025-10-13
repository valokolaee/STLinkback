// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import MailService from '../services/mailer.service';
import { registerSchema, loginSchema } from '../dtos/auth.dto';
import { validate } from '../utils/validator.utils';
import IRequest, { IResponse } from '../types/IRequest';
import getUserByReq from '../utils/getUserByReq';
import User from '../models/user.model';
import IUser from '../types/IUser';
import { date } from 'joi';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {

      var _user: Partial<IUser> = {}
      const data = validate<Record<string, any>>(registerSchema, req.body);
      const result = await AuthService.register(data);

      if (typeof result === 'string') {
        return res.status(200).json({
          success: false,
          message: result,
        });
      } else {

        _user = { ...result.user, token: result.accessToken, passwordHash: undefined };
      }

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: _user

      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async login(req: Request, res: Response) {
    // console.log(req.);
    
    try {
      // const data = validate<Record<string, any>>(loginSchema, req.body);
      const data = req.body;
      const result = await AuthService.login(data);

      const _user: IUser = { ...result.user, token: result.accessToken } as IUser;


      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: _user

      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const user = getUserByReq(req,);
      if (!!!user) {
        return
      }
      const role = user.role ? user.role.name : null;

      return res.status(200).json({
        success: true,
        data: user
        // data: {
        //   id: user.id,
        //   username: user.username,
        //   email: user.email,
        //   clientType: user.clientType,
        //   role,
        //   roleId: user.roleId,
        //   profileImage:user.profileImage
        // },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
      });
    }
  }


  static async sendMail(req: Request, res: Response) {
    try {

      MailService()

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',

      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}