
import { IDeviceAlert } from '../models/device-alert.model';
import { IDeviceEarning } from '../models/device-earning.model';
import { IDeviceMetric } from '../models/device-metric.model';
import { IMiningSession } from '../models/mining-session.model';
import { IMiningWallet } from '../models/mining-wallet.model';






export interface IMonitorData {
  alerts?: IDeviceAlert[];
  metrics?: IDeviceMetric[];
  wallet?: IMiningWallet;
  session?: IMiningSession;
  lastEarnings?:IDeviceEarning[]

}

