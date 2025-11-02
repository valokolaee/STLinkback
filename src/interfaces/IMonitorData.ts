
import { IDeviceAlert } from '../models/device-alert.model';
import { IDeviceMetric } from '../models/device-metric.model';
import { IMiningSession } from '../models/mining-session.model';
import { IMiningWallet } from '../models/mining-wallet.model';






export interface IMonitorData {
  alert?: IDeviceAlert;
  metric?: IDeviceMetric;
  wallet?: IMiningWallet;
  session?: IMiningSession;
}

