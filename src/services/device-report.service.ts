//src/services/device-report.service.ts

import totalPercent from '../controllers/mining-device-affiliate.controller/totalPercent';
import { models } from '../db/db';
import DeviceEarningPot, { IDeviceEarningPot } from '../db/models/device-earning-pot.model';
import DevicePotAssignment from '../db/models/device-pot-assignment';
import MiningDevice, { IMiningDevice } from '../db/models/mining-device.model';
import serviceResponser from '../utils/serviceResponser.utils';
import deviceService from './device.service';
import onEarningRecordedService from './onEarningRecorded.service';

class DeviceReportService {
  async recordEarning(data: {
    imei: string;
    amount: number;
    currency: string;
    ipAddress?: string;
    timestamp?: Date;
    cpuUsage: number;
    memoryUsage: number;
    gpuUsage?: number | null;
    processingSpeed: number;
    fanSpeedRpm: number;
    temperature: number;
    powerConsumption: number;
    hashRate: number;
    networkLatency?: number | null;
  }) {
    const {
      imei,
      amount,
      currency,
      ipAddress,
      timestamp = new Date(),
      cpuUsage,
      memoryUsage,
      gpuUsage,
      processingSpeed,
      fanSpeedRpm,
      temperature,
      powerConsumption,
      hashRate,
      networkLatency,
    } = data;

    try {

      const device = await MiningDevice.findOne({
        where: { imei, softDeleted: false },
        include: [
          {
            model: DeviceEarningPot,
            as: 'currentPot',
            include: [
              {
                model: DevicePotAssignment,
                as: 'potAssignment'
              }
            ]
          }
        ],
        raw: true,
        nest: true,
      });


      if (!device) {
        return serviceResponser({ ok: false, }, 'Device not found or inactive');
      }

      const pot = (device as IMiningDevice).currentPot
      // await DeviceEarningPot.findByPk(device.currentPotId, { include: [{ model: DevicePotAssignment, as: 'potAssignment' }], raw: true, });


      // const affiliates = await totalPercent((pot as IDeviceEarningPot)!?.potAssignment!?.id!)
      // console.log('affiliates', affiliates);

      if (!pot) {
        return serviceResponser({ ok: false, }, 'Associated pot not found');
      }

      let session = await models.MiningSession.findOne({
        where: { deviceId: device.id, status: 'running' },
      });



      if (!session) {
        session = await models.MiningSession.create({
          deviceId: device.id,
          status: 'running',
          sessionStart: new Date(),
        });
      }


      // Save earning
      await models.DeviceEarning.create({
        deviceId: device.id,
        userId: 1,
        miningSessionId: session.id,
        amount,
        currency,
        earningDate: timestamp,
        calculatedAt: new Date(),
        isSettled: false,
      });

      // Save metrics
      await models.DeviceMetric.create({
        deviceId: device.id,
        cpuUsage,
        memoryUsage,
        gpuUsage: gpuUsage ?? 0.00,
        processingSpeed,
        fanSpeedRpm,
        temperature,
        powerConsumption,
        hashRate,
        networkLatency: networkLatency ?? null,
        recordedAt: timestamp,
      });

      // Real-time pot update
      await onEarningRecordedService.updateWallet(pot as DeviceEarningPot, device, amount, session, ipAddress);

      return serviceResponser({ ok: true });
    } catch (error: any) {
      return serviceResponser({ ok: false }, error);
    }
  }
}

export default new DeviceReportService();