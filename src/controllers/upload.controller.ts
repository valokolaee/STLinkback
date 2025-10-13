// src/controllers/uploadController.ts
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { UploadResponse, FileInfo } from '../types/upload';
import { UserService } from '../services/user.service';
import getUserByReq from '../utils/getUserByReq';

export class UploadController {
  // Single file upload
  static uploadFile = async (req: Request, res: Response): Promise<void> => {
          const userId = getUserByReq(req)!.id;
    try {
      if (!req.file) {
        const response: UploadResponse = {
          success: false,
          message: 'No file uploaded',
          error: 'Please select a file to upload'
        };
        res.status(400).json(response);
        return;
      }

      const { filename, originalname, size, mimetype, path: filePath } = req.file;
// console.log(req.file);

      // Construct file URL
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
      const success = await UserService.updateUser(userId, {profileImage:fileUrl});

      const response: UploadResponse = {
        success: true,
        message: 'File uploaded successfully',
        data: {
          filename,
          originalName: originalname,
          size,
          mimetype,
          url: fileUrl,
          filePath
        }
      };

      res.status(200).json(response);
    } catch (error) {
      const response: UploadResponse = {
        success: false,
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      res.status(500).json(response);
    }
  };

  // Multiple files upload
  static uploadMultipleFiles = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        const response: UploadResponse = {
          success: false,
          message: 'No files uploaded',
          error: 'Please select files to upload'
        };
        res.status(400).json(response);
        return;
      }

      const uploadedFiles = (req.files as Express.Multer.File[]).map(file => {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        
        return {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          url: fileUrl,
          filePath: file.path
        };
      });

      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} files uploaded successfully`,
        data: uploadedFiles
      });
    } catch (error) {
      const response: UploadResponse = {
        success: false,
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      res.status(500).json(response);
    }
  };

  // Delete uploaded file
  static deleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, '../../uploads', filename);

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
        return;
      }

      fs.unlinkSync(filePath);

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Get list of uploaded files
  static getFiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const uploadsDir = path.join(__dirname, '../../uploads');
      
      if (!fs.existsSync(uploadsDir)) {
        res.json({
          success: true,
          data: []
        });
        return;
      }

      const files = fs.readdirSync(uploadsDir);
      const fileList: FileInfo[] = files.map(filename => {
        const filePath = path.join(uploadsDir, filename);
        const stats = fs.statSync(filePath);
        
        return {
          id: filename,
          filename,
          originalName: filename,
          size: stats.size,
          mimetype: 'unknown', // You might want to detect this
          url: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
          filePath,
          uploadedAt: stats.birthtime
        };
      });

      res.json({
        success: true,
        data: fileList
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get files',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}