import express from 'express';
import miningDeviceReportRoutes from './device-report.routes';


const mxRoutes = express();

mxRoutes.use('/mining-devicesReport', miningDeviceReportRoutes);




export default mxRoutes;