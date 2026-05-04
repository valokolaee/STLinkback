import express from 'express';
import authRoutes from './auth.routes';
import deviceEarningsRoutes from './device-earning.routes';
import miningDeviceReportRoutes from './device-report.routes';
import miningDeviceRoutes from './mining-device.routes';
import miningWalletRoutes from './mining-wallet.routes';
import userWalletRoutes from './user-wallet.routes';
import userRoutes from './user.routes';
import withdrawalRequestRoutes from './withdrawal-request.routes';
import deviceAlertRoutes from './device-alert.routes';
import deviceSpecificationRoutes from './device-specification.routes';
import miningSessionRoutes from './mining-session.routes';
import monitor from './monitor.routes';
import permissionRoutes from './permission.routes';
import rolePermissionRoutes from './role-permission.routes';
import roleRoutes from './role.routes';
import userSessionRoutes from './user-session.routes';


const customer = express();

customer.use('/auth', authRoutes);
customer.use('/user-session', userSessionRoutes);
customer.use('/users', userRoutes);

customer.use('/mining-devicesReport', miningDeviceReportRoutes);
customer.use('/mining-devices', miningDeviceRoutes);

customer.use('/mining-wallet', miningWalletRoutes);
customer.use('/user-wallet', userWalletRoutes);
customer.use('/mining-session', miningSessionRoutes);
customer.use('/device-earnings', deviceEarningsRoutes);

customer.use('/withdrawal-request', withdrawalRequestRoutes);

customer.use('/device-alert', deviceAlertRoutes);
customer.use('/device-specification', deviceSpecificationRoutes);

customer.use('/role', roleRoutes);
customer.use('/permission', permissionRoutes);
customer.use('/role-permission', rolePermissionRoutes);

customer.use('/monitor', monitor);



export default customer;