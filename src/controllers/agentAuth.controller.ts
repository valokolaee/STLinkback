// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { IAgent } from '../db/models/agent.model';
import { IRole } from '../db/models/role.model';
import agentAuthService from '../services/authAgent.service';
import getUserByReq from '../utils/getUserByReq.utils';
import { agentRoles, clientRoles } from '../utils/initialRolesList';
import responserUtils from '../utils/responser.utils';
import { IUser } from '../db/models/user.model';

export default class {


  static async login(req: Request, res: Response) {

    console.log(req.baseUrl);

    try {


      const data = req.body;

      const result = await agentAuthService.login(data);


      const _user :IUser = { ...result.user, token: result.accessToken, passwordHash: undefined, };


      const r = _user?.agent?.role
      console.log('result', r);


      const roleName = _user?.agent?.role?.name;
      const baseUrl = req.baseUrl.toString().split('/');

      const api = baseUrl.length > 0 ? baseUrl[1] : '';

      // console.log(api, roleName);


      var _rolls: IRole[] = [];
      // console.log(_rolls);


      if (api === 'api') {
        _rolls = clientRoles
      } else if (api === 'panel') {
        _rolls = agentRoles;
      } else {

        return responserUtils(res, 401, {
          success: false,
          message: 'Invalid access route'
        });

      }


      const _permitted = _rolls.some(obj => obj.name === roleName);
      if (!_permitted) {
        return responserUtils(res, 403, {
          success: false,
          message: 'You do not have permission to access this resource'
        });
      }



      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: _user

      });
    } catch (error: any) {
      console.log(error);

      return responserUtils(res, 400, {
        success: false,
        message: 'Authentication failed',
      }, error);


    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const user: IUser = getUserByReq(req,)!;
      if (!!!user) {
        return
      }


      return res.status(200).json({
        success: true,
        data: user
      });


    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
      });
    }
  }

}