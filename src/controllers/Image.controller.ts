// controllers/ImageController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
export interface ImageInfo {
  filename: string;
  path: string;
  url: string;
  size?: number;
  created?: Date;
  modified?: Date;
}

export interface PaginatedResponse {
  success: boolean;
  pagination: {
    current: number;
    limit: number;
    total: number;
    pages: number;
  };
  images: ImageInfo[];
}

export interface ApiResponse {
  success: boolean;
  count?: number;
  images: ImageInfo[];
  error?: string;
}

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
// const defaultFolder = '../../uploads';
const defaultFolder = process.env.defaultFolder || ''
// const defaultFolder = '/Volumes/second/proj/kazemian/nd/uploads';

export class ImageController {


  // Get all images from a folder
  static async getImages(req: Request, res: Response): Promise<void> {
 
    try {
      const folderPath = (req.query.folder as string) || defaultFolder;
      const absolutePath = path.resolve(folderPath);

      // Security check: prevent directory traversal
      if (!isValidPath(absolutePath)) {
        res.status(400).json({ error: 'Invalid folder path', success: false });
        return;
      }

      // Check if folder exists
      if (!fs.existsSync(absolutePath)) {
        res.status(404).json({ error: 'Folder not found', success: false });
        return;
      }

      // Read directory and filter image files
      const files = fs.readdirSync(absolutePath);

      const images: ImageInfo[] = files
        .filter(file => isImageFile(file))
        .map(file => ({
          filename: file,
          path: `/images/${file}`,
          url: `${req.protocol}://${req.get('host')}/images/${file}`
        }));

      const response: ApiResponse = {
        success: true,
        count: images.length,
        images: images
      };

      res.json(response);

    } catch (error) {
      console.error('Error reading images:', error);
      res.status(500).json({ error: 'Internal server error', success: false });
    }
  }

  // Get single image by filename
  static async getImage(req: Request, res: Response): Promise<void> {
    // console.log(req.url);
    
    try {

      const filename = req.params.filename;
      const folderPath = (req.url.split('?')[0] as string) || defaultFolder;
      const absolutePath = path.resolve(folderPath);
      // const imagePath = path.join(folderPath, filename);
      const imagePath = path.join(defaultFolder, folderPath,);

      // console.log(imagePath);

      // Security checks
      if (!isValidPath(imagePath)) {
        res.status(400).json({ error: imagePath, success: false });
        return;
      }

      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        res.status(404).json({ error: 'Image not found', success: false });
        return;
      }

      // Check if it's an image file
      if (!isImageFile(filename)) {
        res.status(400).json({ error: 'File is not an image', success: false });
        return;
      }

      // Send the image file
      res.sendFile(imagePath);

    } catch (error) {
      console.error('Error serving image:', error);
      res.status(500).json({ error: 'Internal server error', success: false });
    }
  }

  // Get images with pagination
  static async getImagesPaginated(req: Request, res: Response): Promise<void> {
    try {
      const folderPath = (req.query.folder as string) || defaultFolder;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const absolutePath = path.resolve(folderPath);

      // Security check
      if (!isValidPath(absolutePath)) {
        res.status(400).json({ error: 'Invalid folder path', success: false });
        return;
      }

      if (!fs.existsSync(absolutePath)) {
        res.status(404).json({ error: 'Folder not found', success: false });
        return;
      }

      // Read and filter images
      const files = fs.readdirSync(absolutePath);

      const allImages: ImageInfo[] = files
        .filter(file => isImageFile(file))
        .map(file => {
          const filePath = path.join(absolutePath, file);
          const stats = fs.statSync(filePath);

          return {
            filename: file,
            path: `/images/${file}`,
            url: `${req.protocol}://${req.get('host')}/images/${file}`,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        })
        .sort((a, b) => new Date(b.created!).getTime() - new Date(a.created!).getTime());

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const images = allImages.slice(startIndex, endIndex);

      const response: PaginatedResponse = {
        success: true,
        pagination: {
          current: page,
          limit: limit,
          total: allImages.length,
          pages: Math.ceil(allImages.length / limit)
        },
        images: images
      };

      res.json(response);

    } catch (error) {
      console.error('Error reading images:', error);
      res.status(500).json({ error: 'Internal server error', success: false });
    }
  }


}



// Helper method to validate file path
const isValidPath = (filePath: string): boolean => {
  return filePath.startsWith(process.cwd());
}

// Helper method to check if file is an image
const isImageFile = (filename: string): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}