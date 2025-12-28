import express from 'express';
import tstRoutes from './tst.routs';


const panel = express();

panel.use('/pan', tstRoutes);
 


export default panel;