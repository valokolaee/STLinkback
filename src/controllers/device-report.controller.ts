// src/controllers/device-report.controller.ts

import { Request, Response } from 'express';
import { validate } from '../utils/validator.utils';
import { deviceEarningReportSchema } from '../dtos/device.dto';
// import deviceReportService from '../services/device-report.service';
import responser from '../utils/responser.utils';
import deviceReportService from '../services/device-report.service';
import { log } from 'console';

function getClientIP(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '0.0.0.0'
  );
}


export default class DeviceReportController {
  static async go(req: Request, res: Response) { }
  static async reportEarning(req: Request, res: Response) {
    console.log(req.body);


    const validated = validate(deviceEarningReportSchema, req.body, res);
    if (!validated.ok) return;

    const clientIP = getClientIP(req);
    try {

      const result = await deviceReportService.recordEarning({
        ...req.body,
        
        clientIP,
      });

      if (!result.ok) {
        return responser(res, 400, {
          success: false,
          message: result.ok || 'Failed to record data',
        });
      }

      return responser(res, 201, {
        success: true,
        message: 'Data recorded successfully',
      });



    } catch (error) {
      log(error)
    }
  }




}