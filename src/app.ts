import cors from 'cors';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirList } from './config/constants';
import corsOptions from './config/cors.options';
import { resetDatabase } from './db/db.init';
import { errorHandler } from './middleware/error.middleware';
import clientRouts from './routes/clientRoutes';
import databaseRoutes from './routes/database.routes';
import imagesRoutes from './routes/images.rout';
import mxRoutes from './routes/mxRoutes';
import panelRouts from './routes/panelRoutes';
import { sequelize } from './db/db';
// import './cron/cleanup.cron';


const https = require('https');
const fs = require('fs');


const app = express();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../src/public');

// Middlewares
app.use(cors(
  corsOptions
));
app.options('*', cors(corsOptions));

// Parse JSON body before any other middleware
app.use(express.json());

// Now use the logger (it will have access to req.body)

// app.use(logger); TODO logger stopped

// API Routes
app.use('/api/db', databaseRoutes);
app.use('/uploads', imagesRoutes);

app.use('/api', clientRouts);
app.use('/panel', panelRouts);
app.use('/mx', mxRoutes);




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

const PORT = 3002;



const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};


https.createServer(options, app).listen(PORT, async () => {
  try {

    // await resetDatabase();

    await sequelize.authenticate();

    console.log('Database connection established successfully.');
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Backend URL: https://w.bankon.click`);

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

}

);


export default app;