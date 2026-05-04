import cors from 'cors';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import corsOptions from './config/cors.options';
import { sequelize } from './db';

import databaseRoutes from './routes/database.routes';
import imagesRoutes from './routes/images.rout';




import { dirList } from './config/constants';
import { errorHandler } from './middleware/error.middleware';
import customerRouts from './routes/customerRouts';
import panelRouts from './routes/panleRouts';
import initializeRolesUtils from './utils/initializeRoles.utils';



const https = require('https');
const fs = require('fs');



const app = express();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../src/public');

// Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Parse JSON body before any other middleware
app.use(express.json());

// Now use the logger (it will have access to req.body)

// app.use(logger); TODO logger stopped

// API Routes
app.use('/api/db', databaseRoutes);
app.use('/uploads', imagesRoutes);

app.use('/api', customerRouts);
app.use('/panel', panelRouts);

// app.use('/api/auth', authRoutes);
// app.use('/api/user-session', userSessionRoutes);
// app.use('/api/users', userRoutes);

// app.use('/api/mining-devicesReport', miningDeviceReportRoutes);
// app.use('/api/mining-devices', miningDeviceRoutes);

// app.use('/api/mining-wallet', miningWalletRoutes);
// app.use('/api/user-wallet', userWalletRoutes);
// app.use('/api/mining-session', miningSessionRoutes);
// app.use('/api/device-earnings', deviceEarningsRoutes);

// app.use('/api/withdrawal-request', withdrawalRequestRoutes);

// app.use('/api/device-alert', deviceAlertRoutes);
// app.use('/api/device-specification', deviceSpecificationRoutes);

// app.use('/api/role', roleRoutes);
// app.use('/api/permission', permissionRoutes);
// app.use('/api/role-permission', rolePermissionRoutes);

// app.use('/api/monitor', monitor);
// app.use('/panel/monitor', monitor);


// Serve static files
app.use(express.static(publicPath));

// SPA Fallback - all non-API routes serve index.html
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});



// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        error: 'File size must be less than 10MB'
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files',
        error: 'Maximum 5 files allowed'
      });
    }
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});



/*creating dirs */
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
dirList.forEach((el) => {
  const avatarDir = uploadsDir.concat('/', el)
  if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
  }

})



// Error handling middleware
app.use(errorHandler);

// Start Server
// const PORT = process.env.PORT || 3002;
const PORT = 3002;
// app.listen(PORT, async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection established successfully.');
//     console.log(`Server is running on http://localhost:${PORT}`);
//     console.log(`Backend URL: https://w.bankon.click`);
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// });



const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Backend URL: https://w.bankon.click`);

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


  await initializeRolesUtils();

}

);


export default app;