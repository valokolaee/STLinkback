// src/db.ts
import { Sequelize } from 'sequelize';
import initModels from './models';
import dbConfig from './config/db.config';

const sequelize = new Sequelize(dbConfig);

const models = initModels(sequelize);

export { sequelize, models };