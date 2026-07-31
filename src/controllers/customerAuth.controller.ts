// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { registerSchema } from '../dtos/dto';
import User, { IUser } from '../db/models/user.model';
import authService from '../services/auth.service';
import getUserByReq from '../utils/getUserByReq.utils';
import { validate } from '../utils/validator.utils';
import Role, { IRole } from '../db/models/role.model';
import responserUtils from '../utils/responser.utils';
import initialRolesList, { agentRoles, customer, customerRoles } from '../utils/initialRolesList';
import Customer, { ICustomer } from '../db/models/customer.model';
import { log } from 'console';
import genericService from '../services/generic.service';
import IServiceResult from '../interfaces/IServiceResult';

export default class {
  static async register(req: Request, res: Response) {
    try {


      const data = validate(registerSchema, req.body, res);
      console.log(data);
      if (!data.ok) {
        return
      }



      const result = await authService.register(data);

      console.log(result);


      if (result!.ok) {
        const _res = await authService.login(result.data)//this.login(result.data, res)
        console.log('_res', _res);

        return responserUtils(res, 200,
          {
            success: true,
            message: '',
            data:
              _res!.data
          }
        )
      } else {
        return responserUtils(res, result!.data?.code, result!.data?.msg)
      }

      // console.log(result);

      // if (typeof result === 'string') {
      //   return res.status(200).json({
      //     success: false,
      //     message: result,
      //   });

      // } else {
      //   _user = { ...result.data, token: result.data.accessToken, passwordHash: undefined };
      // }


      // const _customerAgent = await Customer.create({ userId: _user?.id })

      // await genericService(User).update({ id: _user.id, customerId: _customerAgent.id })



      // return res.status(201).json({
      //   success: true,
      //   message: 'User registered successfully',
      //   data: _user,
      // });




    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async login(req: Request, res: Response) {

    // console.log(req.baseUrl);

    try {

      // const data = validate<Record<string, any>>(loginSchema, req.body);

      const data = req?.body;
      console.log('req.body', req?.body);

      const _user: IServiceResult<IUser> = await authService.login(data);

      // log(_user)

      // const _user: ICustomer = { ...result.user, token: result.accessToken, passwordHash: undefined };


      // const r = customer;// await Role.findByPk(_user.roleId);


      // const roleName = r?.name;
      // const baseUrl = req.baseUrl.toString().split('/');

      // const api = baseUrl?.length > 0 ? baseUrl[1] : '';

      // console.log(api, roleName);


      // var _rolls: IRole[] = [];
      // console.log(_rolls);


      // if (_user!?.data!.customer!?.id! < 1) {
      if (!_user.ok) {

        responserUtils(res, 401, {
          success: false,
          message: 'Access denied'
        });

      } else {

        responserUtils(res, 200, {
          success: true,
          message: 'Login successful',
          data: _user.data
        })


        // return res.status(200).json({
        //   success: true,
        //   message: 'Login successful',
        //   data: _user
        // });

      }

      // else {
      //   responserUtils(res, 200, {
      //     success: false,
      //     message: 'Invalid access route'
      //   });
      //   return;
      // }


      // const _permitted = _rolls.some(obj => obj.name === roleName);
      // if (!_permitted) {
      //   responserUtils(res, 403, {
      //     success: false,
      //     message: 'You do not have permission to access this resource'
      //   });
      //   return;
      // }







    } catch (error: any) {
      responserUtils(res, 400, {
        success: false,
        message: 'user not found',
      }, error);
      // return res.status(404).json({
      //   success: false,
      //   message: 'user not found',
      // });
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