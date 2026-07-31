// src/cron/cleanup.cron.ts
import cron from 'node-cron';
import { Op } from 'sequelize';
import DeviceMetric from '../db/models/device-metric.model';
import DeviceEarning from '../db/models/device-earning.model';

const KEEP_LIMIT = 1000;

async function cleanUpTable(Model: any, tableName: string) {
  try {
    const thresholdRecord = await Model.findOne({
      order: [['id', 'DESC']],
      offset: KEEP_LIMIT,
    });

    if (!thresholdRecord) {
      console.log(`[Cron] ${tableName}: Less than ${KEEP_LIMIT} records. No cleanup needed.`);
      return;
    }

    const deletedCount = await Model.destroy({
      where: {
        id: {
          [Op.lte]: thresholdRecord.id,
        },
      },
    });

    console.log(`[Cron] ${tableName}: Successfully deleted ${deletedCount} old records.`);
  } catch (error) {
    console.error(`[Cron] Error cleaning up ${tableName}:`, error);
  }
}

cron.schedule('0 * * * *', async () => {
  console.log('[Cron] Starting hourly database cleanup...');

  await cleanUpTable(DeviceMetric, 'device_metrics');
  await cleanUpTable(DeviceEarning, 'device_earnings');

  console.log('[Cron] Hourly database cleanup finished.');
});
