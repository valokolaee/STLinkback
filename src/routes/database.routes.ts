// src/routes/database.routes.ts
import express from 'express';
import { DatabaseController } from '../controllers/database.controller';

const router = express.Router();

router.get('/tables', DatabaseController.getTables);
router.get('/:table', DatabaseController.getTableData);
router.post('/:table', express.json(), DatabaseController.insertData);

export default router;