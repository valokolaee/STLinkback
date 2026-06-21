// src/db.ts
import { Sequelize } from 'sequelize';
import initModels from './models';
import dbConfig from './config/db.config';
import initializeRolesUtils from './utils/initializeRoles.utils';

const sequelize = new Sequelize(dbConfig);
const models = initModels(sequelize);
// console.log('creating db');


sequelize.sync({
    // force: true,
})
    .then((e) => { initializeRolesUtils() })
    .catch((e) => { console.log(e) });


export { sequelize, models };