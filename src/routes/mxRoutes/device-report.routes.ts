//src/routes/device-report.routes.ts

import { Router } from 'express';
import DeviceReportController from '../../controllers/device-report.controller';


const router = Router();

router.get('/report-earning', DeviceReportController.go);
router.post('/report-earning', DeviceReportController.reportEarning);

export default router;