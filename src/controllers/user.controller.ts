// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { avatarSt, logoSt } from '../config/constants';
import { UploadResponse } from '../interfaces/upload';
import { UserService } from '../services/user.service';
import getUserByReq from '../utils/getUserByReq.utils';

export class UserController {
  /**
   * آپدیت عکس پروفایل کاربر
   */
  static async updateProfileImage(req: Request, res: Response) {
    try {
      // const { userId } = req.params;
      const userId = getUserByReq(req).id;

      const { profileImage } = req.body;

      if (!profileImage) {
        return res.status(400).json({
          success: false,
          message: 'Profile image path is required'
        });
      }

      const success = await UserService.updateProfileImage(userId!, profileImage);

      if (success) {
        res.json({
          success: true,
          message: 'Profile image updated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found or update failed'
        });
      }

    } catch (error) {
      console.error('Error in updateProfileImage:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  /**
   * گرفتن اطلاعات کاربر
   */
  static async getUserProfile(req: Request, res: Response) {

    try {
      const userId = getUserByReq(req).id;

      if (userId === undefined) {
        res.status(400).json({
          success: false,
          message: 'bad request'
        });
      }
      const user = await UserService.getUserById(userId!);

      if (user) {
        res.json({
          success: true,
          user
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

    } catch (error) {
      console.error('Error in getUserProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * گرفتن اطلاعات کاربر
   */
  static async getUserInvestments(req: Request, res: Response) {

    try {

      const userId = getUserByReq(req).id;

      if (userId === undefined) {
        res.status(400).json({
          success: false,
          message: 'bad request'
        });
      }

      const user = await UserService.getUserInvestmentsById(userId!);


      if (user) {
        res.json({
          success: true,
          message: 'not ready',
          user
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

    } catch (error) {
      console.error('Error in getUserInvestments:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * گرفتن اطلاعات کاربر
   */
  static async getUserReferrals(req: Request, res: Response) {
    // res.send('getUserInvestments ok');
    try {
      const userId = getUserByReq(req).id;

      if (userId === undefined) {
        res.status(400).json({
          success: false,
          message: 'bad request'
        });
      }
      const user = await UserService.getUserReferralsById(userId!);

      if (user) {
        res.json({
          success: true,
          user
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

    } catch (error) {
      console.error('Error in getUserInvestments:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * گرفتن اطلاعات کاربر
   */
  static async getUserLoans(req: Request, res: Response) {
    // res.send('getUserInvestments ok');
    try {
      const userId = getUserByReq(req).id;

      if (userId === undefined) {
        res.status(400).json({
          success: false,
          message: 'bad request'
        });
      }
      const user = await UserService.getUserLoansById(userId!);

      if (user) {
        res.json({
          success: true,
          user
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

    } catch (error) {
      console.error('Error in getUserInvestments:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  /**
   * گرفتن اطلاعات کاربر
   */
  static async getBankAffiliations(req: Request, res: Response) {
    // res.send('getUserInvestments ok');
    try {
      const userId = getUserByReq(req).id;

      if (userId === undefined) {
        res.status(400).json({
          success: false,
          message: 'bad request'
        });
      }
      const user = await UserService.getBankAffiliations(userId!);

      if (user) {
        res.json({
          success: true,
          user
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

    } catch (error) {
      console.error('Error in getUserInvestments:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Single file upload
  static updateUserAvatar = async (req: Request, res: Response): Promise<void> => {
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
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${avatarSt}/${filename}`;
      const success = await UserService.updateUser(userId!, { profileImage: fileUrl });

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


  // Single file upload
  static updateUserLogo = async (req: Request, res: Response): Promise<void> => {
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
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${logoSt}/${filename}`;
      const success = await UserService.updateUser(userId!, { logoUrl: fileUrl });

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



  /**
   * آپدیت اطلاعات کاربر
   */
  static async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = getUserByReq(req)!.id;
      const updateData = req.body;

      const success = await UserService.updateUser(userId!, updateData);

      if (success) {
        res.json({
          success: true,
          message: 'User profile updated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found or update failed'
        });
      }

    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}