import express from 'express';
import miningDeviceReportRoutes from './device-report.routes';


const customer = express();

customer.use('/mining-devicesReport', miningDeviceReportRoutes);




export default customer;