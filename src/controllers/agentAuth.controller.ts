// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { IAgent } from '../models/agent.model';
import { IRole } from '../models/role.model';
import agentAuthService from '../services/agentAuth.service';
import getUserByReq from '../utils/getUserByReq.utils';
import { agentRoles, customerRoles } from '../utils/initialRolesList';
import responserUtils from '../utils/responser.utils';

export default class {


  static async login(req: Request, res: Response) {

    console.log(req.baseUrl);

    try {


      const data = req.body;

      const result = await agentAuthService.login(data);


      const _user = { ...result.user, token: result.accessToken, passwordHash: undefined, };


      // console.log('result', _user);
      const r = _user?.agent?.role


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



      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: _user

      });
    } catch (error: any) {
      console.log(error);

      responserUtils(res, 400, {
        success: false,
        message: 'Authentication failed',
      }, error);
      // return res.status(404).json({
      //   success: false,
      //   message: 'user not found',
      // });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const user: IAgent = getUserByReq(req,);
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