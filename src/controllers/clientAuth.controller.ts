// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { IUser } from '../db/models/user.model';
import { registerSchema } from '../dtos/dto';
import IServiceResult from '../interfaces/IServiceResult';
import authService from '../services/authClient.service';
import getUserByReq from '../utils/getUserByReq.utils';
import responserUtils from '../utils/responser.utils';
import { validate } from '../utils/validator.utils';
 import { log } from 'console';

export default class {
  static async register(req: Request, res: Response) {
    try {


      const data = validate(registerSchema, req.body, res);
      console.log(data);
      if (!data.ok) {
        return
      }



      const result = await authService.register(data);


      if (result!.ok) {
        const _res = await authService.login(result.data)//this.login(result.data, res)
        // console.log('_res', _res);

        return responserUtils(res, 200,
          {
            success: true,
            message: '',
            data: _res!.data
          })

      } else {
        return responserUtils(res, result!.data?.code, result!.data?.msg)
      }


    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async login(req: Request, res: Response) {


    try {

      const data = req?.body;
      console.log('req.body', req?.body);

      const _user: IServiceResult<IUser> = await authService.login(data);

      log(_user)
      if (!_user.ok || !_user.data?.client?.id) {

        return responserUtils(res, 401, {
          success: false,
          message: 'Access denied'
        });

      } else {

        return responserUtils(res, 200, {
          success: true,
          message: 'Login successful',
          data: _user.data
        })

      }



    } catch (error: any) {
      return responserUtils(res, 400, {
        success: false,
        message: 'user not found',
      }, error);

    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const user = getUserByReq(req,);
      if (!!!user) {
        return
      }
      // const role = user.role ? user.role.name : null;

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