import { models } from '../db';
import { IMiningDevice } from '../models/mining-device.model';
import serviceResponser from '../utils/serviceResponser.utils';
import genericService from './generic.service';

 
export default class <T> {





  static async getAll() {

    try {
      const devices = await models.MiningDevice.findAll();

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
      const devices = await models.MiningDevice.findByPk(id)

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


  static async getAllBy(userId: number) {

    try {
      const devices = await models.MiningDevice.findAll({ where: { userId } });

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

  static async create(device: IMiningDevice) {


    try {
      const _device = await models.MiningDevice.create(device);

      return serviceResponser({
        ok: true,
        data: _device
      })

    } catch (error) {
      return serviceResponser({ ok: false, data: error })

    }

  }

  static async update(device: IMiningDevice) {
    try {
      const _device = await models.MiningDevice.update(device, {
        where: { id: device.id }
      });

      return serviceResponser({
        ok: true,
        data: _device
      })

    } catch (error) {
      return serviceResponser({ ok: false, data: error })

    }

  }
  static async delete(id: number) {
    try {
      // const numberOfDeleted = await models.MiningDevice.destroy({ where: { id }, });
      // console.log(numberOfDeleted);
      const numberOfDeleted = await this.update({ id, softDeleted: true })


      return serviceResponser({
        ok: true,
        data: numberOfDeleted

      })

    } catch (error) {
      return serviceResponser({ ok: false, data: error })

    }

  }


}