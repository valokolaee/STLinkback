// src/types/upload.ts
// import { Request } from 'express';

import { Request } from "express";

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

export interface UploadRequest    {
  file?: UploadedFile;
  files?: UploadedFile[];
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
    filePath: string;
  };
  error?: string;
}

export interface FileInfo {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url: string;
  filePath: string;
  uploadedAt: Date;
}