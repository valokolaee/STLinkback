import { Request, Response } from 'express';
import { models } from '../db';
import { createMiningWalletSchema, createWithdrawalRequestSchema } from '../dtos/dto';
import genericService from '../services/generic.service';
import responser from '../utils/responser.utils';
import { validate } from '../utils/validator.utils';
import getUserByReqUtils from '../utils/getUserByReq.utils';
import { IDeviceAlert } from '../models/device-alert.model';
import IServiceResult from '../interfaces/IServiceResult';
import { IMiningWallet } from '../models/mining-wallet.model';
import { IMiningDevice } from '../models/mining-device.model';
import { IDeviceMetric } from '../models/device-metric.model';
import { IMiningSession } from '../models/mining-session.model';




const service = genericService(models.RolePermission)


export default {

  async getAll(req: Request, res: Response) {
    try {

      const items = await service.getAll();


      if (items.ok) {
        responser(res, 200, { success: true, data: items.data })
      } else {
        responser(res, 404, { success: false, })
      }


    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },



  async getAllBy(req: Request, res: Response) {
    try {

      const device: IMiningDevice = req?.body;
      const { id: deviceId, imei: walletAddress } = device || {}

      const _alerts: IServiceResult<IDeviceAlert[]> = await genericService(models.DeviceAlert).getAllBy({ deviceId }, [['createdAt', 'desc']]);
      var _alert = null;
      if (_alerts?.data!?.length > 0) {
        _alert = _alerts.data![0];

      }

      const _metrics: IServiceResult<IDeviceMetric[]> = await genericService(models.DeviceMetric).getAllBy({ deviceId }, [['recordedAt', 'desc']]);

      var _metric = null;
      if (_metrics?.data!?.length > 0) {
        _metric = _metrics?.data![0];
      }

      const _sessions: IServiceResult<IMiningSession[]> = await genericService(models.MiningSession).getAllBy({ deviceId }, [['createdAt', 'desc']]);

      var _currentSession: IMiningSession = {}
      if (_metrics?.data!?.length > 0) {
        _currentSession = _sessions?.data![0];
      }

      // console.log(_sessions);

      const _deviceWallet: IServiceResult<IMiningWallet> = await genericService(models.MiningWallet).findOne({ walletAddress });



      const monitorData = {
        alert: _alert,
        metric: _metric,
        wallet: _deviceWallet.data,
        session: _currentSession
      }



      if (_deviceWallet.ok) {
        responser(res, 200, { success: true, data: monitorData })
      } else {
        responser(res, 404, { success: false, })
      }

    } catch (error) {

      responser(res, 500, { success: false, }, error)

    }
  },



}