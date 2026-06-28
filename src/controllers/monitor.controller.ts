import { Request, Response } from 'express';
import { models } from '../db';
import { createMiningWalletSchema, createWithdrawalRequestSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
import { validate } from '../utils/validator.utils';
import getUserByReqUtils from '../utils/getUserByReq.utils';
import { IDeviceAlert } from '../models/device-alert.model';
import IServiceResult from '../interfaces/IServiceResult';
import MiningWallet, { IMiningWallet } from '../models/mining-wallet.model';
import MiningDevice, { IMiningDevice } from '../models/mining-device.model';
import { IDeviceMetric } from '../models/device-metric.model';
import { IMiningSession } from '../models/mining-session.model';
import { IWithdrawalRequest } from '../models/withdrawal-request.model';
import { IDeviceEarning } from '../models/device-earning.model';
import responserUtils from '../utils/responser.utils';
import { log } from 'console';




const serviceRolePermission = genericService(models.RolePermission)

const serviceDeviceEarning = genericService(models.DeviceEarning)

export default {

  async getAll(req: Request, res: Response) {
    try {

      const items = await serviceRolePermission.getAll();


      if (items.ok) {
        return responserUtils(res, 200, { success: true, data: items.data })
      } else {
        return responserUtils(res, 404, { success: false, })
      }


    } catch (error) {

      return responserUtils(res, 500, { success: false, }, error)

    }
  },



  async getAllBy(req: Request, res: Response) {
    try {

      const device: IMiningDevice = req?.body;
      const { id: deviceId, imei: walletAddress } = device || {}

      const _deviceInfo: IMiningDevice = await MiningDevice.findByPk(deviceId, {
        include: [
          {
            model: MiningWallet,
            as: 'wallet',
          }
        ],
        raw: true,  // Returns plain object, no Sequelize methods
        nest: true  // Nests the customer object properly
      }) as IMiningDevice






      const _alerts: IServiceResult<IDeviceAlert[]> = await genericService(models.DeviceAlert).getAllBy({ deviceId }, [['createdAt', 'desc']]);
      var _alert = null;
      if (_alerts?.data!?.length > 0) {
        _alert = _alerts.data!;

      }

      const _metrics: IServiceResult<IDeviceMetric[]> = await genericService(models.DeviceMetric).getAllBy({ deviceId }, [['recordedAt', 'desc']], 10);

      var _metric = null;
      if (_metrics?.data!?.length > 0) {
        _metric = _metrics?.data!;
      }

      const _sessions: IServiceResult<IMiningSession[]> = await genericService(models.MiningSession).getAllBy({ deviceId }, [['createdAt', 'desc']]);

      var _currentSession: IMiningSession = {}
      if (_metrics?.data!?.length > 0) {
        _currentSession = _sessions?.data![0];
      }


      // const _deviceWallet: IServiceResult<IMiningWallet> = await genericService(models.MiningWallet).findOne({ walletAddress });
      const items: IServiceResult<IDeviceEarning[]> = await serviceDeviceEarning.getAllBy({ deviceId }, [['calculatedAt', 'desc']], 10);


      const monitorData = {
        alerts: _alert,
        metrics: _metric,
        wallet: _deviceInfo!?.wallet,
        session: _currentSession,
        lastEarnings: items.data
      }



      if (!!_deviceInfo) {
        return responserUtils(res, 200, { success: true, data: monitorData })
      } else {
        return responserUtils(res, 404, { success: false, })
      }

    } catch (error) {

      return responserUtils(res, 500, { success: false, }, error)

    }
  },



}