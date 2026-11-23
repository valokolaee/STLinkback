import { models } from '../db/db';
import DeviceEarning, { IDeviceEarning } from '../db/models/device-earning.model';
import serviceResponser from '../utils/serviceResponser.utils';

export default class {

  static async getAll() {

    try {
      const devices = await DeviceEarning.findAll();

      return serviceResponser({
        ok: true,
        data: devices
      })
    } catch (error) {

      return serviceResponser({
        ok: true,
        data: error
      })
    }



  }

  static async getOne(id: number) {

    try {
      const devices = await models.DeviceEarning.findByPk(id)

      return serviceResponser({
        ok: true,
        data: devices
      })
    } catch (error) {

      return serviceResponser({
        ok: true,
        data: error
      })
    }

  }


  static async getAllBy(deviceId: number) {

    try {
      const devices = await models.DeviceEarning.findAll({ where: { deviceId } });

      return serviceResponser({
        ok: true,
        data: devices
      })
    } catch (error) {

      return serviceResponser({
        ok: true,
        data: error
      })
    }



  }



  static async create(device: IDeviceEarning) {


    try {
      const _device = await models.DeviceEarning.create(device);

      return serviceResponser({
        ok: true,
        data: _device
      })

    } catch (error) {
      return serviceResponser({ ok: false, data: error })

    }

  }


}