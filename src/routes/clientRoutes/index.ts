import express from 'express';
import authRoutes from './auth.routes';
import deviceAlertRoutes from './device-alert.routes';
import deviceEarningsRoutes from './device-earning.routes';
import deviceSpecificationRoutes from './device-specification.routes';
import miningDeviceRoutes from './mining-device.routes';
import miningSessionRoutes from './mining-session.routes';
import miningWalletRoutes from './mining-wallet.routes';
import monitor from './monitor.routes';
import roleRoutes from './role.routes';
import transactionsRoutes from './transactions.routes';
import userSessionRoutes from './user-session.routes';
import userWalletRoutes from './user-wallet.routes';
import userRoutes from './user.routes';
import withdrawalRequestRoutes from './withdrawal-request.routes';


const client = express();

client.use('/auth', authRoutes);
client.use('/user-session', userSessionRoutes);
client.use('/users', userRoutes);

 
client.use('/mining-wallet', miningWalletRoutes);
client.use('/user-wallet', userWalletRoutes);
client.use('/mining-session', miningSessionRoutes);
client.use('/device-earnings', deviceEarningsRoutes);

client.use('/withdrawal-request', withdrawalRequestRoutes);

client.use('/device-alert', deviceAlertRoutes);
client.use('/device-specification', deviceSpecificationRoutes);

client.use('/role', roleRoutes);
 
client.use('/monitor', monitor);
client.use('/mining-devices', miningDeviceRoutes);
client.use('/transactions', transactionsRoutes);



export default client;