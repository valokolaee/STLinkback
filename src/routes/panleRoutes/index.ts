import express from 'express';
import tstRoutes from './tst.routs';
import usersRoutes from './users.routs';
import authRoutes from './auth.routes';
import miningDeviceRoutes from './mining-device.routes';


const panel = express();

panel.use('/pan', tstRoutes);

panel.use('/users', usersRoutes);

panel.use('/auth', authRoutes);

panel.use('/mining-devices', miningDeviceRoutes);

export default panel;