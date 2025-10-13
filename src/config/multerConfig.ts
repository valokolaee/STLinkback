import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import getUserByReq from '../utils/getUserByReq';
import IRequest from '../types/IRequest';
import IUser from '../types/IUser';
import { TAllowedMimes, TImageFor } from './constants';

// Configure storage
const storage = (imageFor?: TImageFor) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/${imageFor}`);
  },
  filename: (req: IRequest, file, cb) => {
    let _filename: string = ''
    let _objectID = -1
    switch (imageFor) {
      case 'avatar':
      case 'logo':
        _objectID = getUserByReq(req)?.id
        _filename = `${imageFor}_${_objectID}`

        break;

      default:
        break;
    }



    // console.log('hostname', req.baseUrl);



    // Generate unique filename with original extension
    const uniqueName = `${_filename}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (allowedMimes: TAllowedMimes[]) => (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {


  const am = allowedMimes as string[]
  if (am.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. ${am.toString()} are allowed.`));
  }
};

// Configure multer
export const upload = (imageFor: TImageFor, allowedMimes: TAllowedMimes[]) => multer({
  storage: storage(imageFor),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter(allowedMimes)
});

// Multiple files upload configuration
export const uploadMultiple = multer({
  storage: storage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5 // Maximum 5 files
  },
  fileFilter: fileFilter([])
});


