// src/controllers/device-report.controller.ts

import { Request, Response } from 'express';
import { validate } from '../utils/validator.utils';
import deviceReportService from '../services/device-report.service';
import responser from '../utils/responser.utils';
import { deviceEarningReportSchema } from '../dtos/dto';

export default class DeviceReportController {
  static async go(req: Request, res: Response) {
    return responser(res, 200, {
      success: false,
      message: 'Failed to record data',
    });
  }

  static async reportEarning(req: Request, res: Response) {
    // console.log(req.body);

    const validated = validate(deviceEarningReportSchema, req.body, res);
    if (!validated.ok) return;

    const result = await deviceReportService.recordEarning(validated.data);

    if (!result.ok) {
      return responser(res, 400, {
        success: false,
        message: 'Failed to record data',
      });
    }

    return responser(res, 201, {
      success: true,
      message: 'Data recorded successfully',
    });
  }
}
