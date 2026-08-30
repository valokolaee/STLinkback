import express from 'express';
import tstRoutes from './tst.routs';
import usersRoutes from './users.routs';
import authRoutes from './auth.routes';
import miningDeviceRoutes from './mining-device.routes';
import withdrawalRequestRoutes from './withdrawal-request.routes';


const panel = express();

panel.use('/pan', tstRoutes);

panel.use('/users', usersRoutes);

panel.use('/auth', authRoutes);

panel.use('/mining-devices', miningDeviceRoutes);

panel.use('/withdrawal-request', withdrawalRequestRoutes);

export default panel;