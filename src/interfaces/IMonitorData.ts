
import { IDeviceAlert } from '../db/models/device-alert.model';
import { IDeviceEarning } from '../db/models/device-earning.model';
import { IDeviceMetric } from '../db/models/device-metric.model';
import { IMiningSession } from '../db/models/mining-session.model';
import { IDeviceEarningPot } from '../db/models/device-earning-pot.model';






export interface IMonitorData {
  alerts?: IDeviceAlert[];
  metrics?: IDeviceMetric[];
  wallet?: IDeviceEarningPot;
  session?: IMiningSession;
  lastEarnings?: IDeviceEarning[]

}

