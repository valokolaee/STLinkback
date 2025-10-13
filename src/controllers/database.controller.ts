// src/controllers/database.controller.ts
import { Request, Response } from 'express';
import { models } from '../models';
import { validateTableData } from '../utils/validate-table-data.utils';

type TableNames = keyof typeof models;

export class DatabaseController {
  static async getTables(req: Request, res: Response): Promise<void> {
    try {
      const tableNames = Object.keys(models).filter(
        (key) => key !== 'sequelize' && key !== 'Sequelize'
      );
      res.json(tableNames);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTableData(req: Request, res: Response): Promise<void> {
    try {
      const { table } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!models[table as TableNames]) {
        res.status(404).json({ error: 'Table not found' });
        return;
      }

      const Model = models[table as TableNames];
      const data = await Model.findAll({ limit });
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async insertData(req: Request, res: Response): Promise<void> {
    try {
      const { table } = req.params;
      const { data } = req.body;

      if (!models[table as TableNames]) {
        res.status(404).json({ error: 'Table not found' });
        return;
      }

      const validationError = validateTableData(table, data);
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      const Model = models[table as TableNames];
      const result = await Model.create(data);

      res.json({ success: true, id: result.getDataValue('id') });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}