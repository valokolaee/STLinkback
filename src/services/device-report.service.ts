//src/services/device-report.service.ts

import { models } from '../db';
import serviceResponser from '../utils/serviceResponser.utils';
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

    const device = await models.MiningDevice.findOne({
      where: { imei, status: 'active', softDeleted: false },
    });

    if (!device) {
      return serviceResponser({ ok: false, }, 'Device not found or inactive');
    }

    const wallet = await models.MiningWallet.findByPk(device.walletId);
    if (!wallet) {
      return serviceResponser({ ok: false, }, 'Associated wallet not found');
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

    if (ipAddress) {
      await device.update({ ipAddress });
    }

    try {
      // Save earning
      await models.DeviceEarning.create({
        deviceId: device.id,
        userId: device.userId,
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

      // Real-time wallet update
      await onEarningRecordedService.updateWallet(wallet.id, amount, session);

      return serviceResponser({ ok: true });
    } catch (error: any) {
      return serviceResponser({ ok: false }, error);
    }
  }
}

export default new DeviceReportService();