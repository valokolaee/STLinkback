// src/db.ts
import { Sequelize } from 'sequelize';
import initModels from './models';
import dbConfig from './config/db.config';

const sequelize = new Sequelize(dbConfig);
// sequelize.sync({   force: true })
// .then((e) => { console.log(e) }).catch((e) => { console.log(e) });

const models = initModels(sequelize);

export { sequelize, models };