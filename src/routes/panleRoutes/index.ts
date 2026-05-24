import express from 'express';
import tstRoutes from './tst.routs';
import authRoutes from './auth.routes';


const panel = express();

panel.use('/pan', tstRoutes);

panel.use('/auth', authRoutes);


export default panel;