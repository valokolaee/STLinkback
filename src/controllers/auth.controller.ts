// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { registerSchema } from '../dtos/dto';
import { IUser } from '../models/user.model';
import authService from '../services/auth.service';
import getUserByReq from '../utils/getUserByReq.utils';
import { validate } from '../utils/validator.utils';

export default class {
  static async register(req: Request, res: Response) {
    try {

      var _user: Partial<IUser> = {}

      const data = validate(registerSchema, req.body, res);
      console.log(data);
      if (!data.ok) {
        return
      }
      const result = await authService.register(data);
      console.log(result);

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
      const result = await authService.login(data);

      const _user: IUser = { ...result.user, token: result.accessToken } as IUser;


      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: _user

      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: 'user not found',
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

}