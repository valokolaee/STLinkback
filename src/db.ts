// src/db.ts
import { Sequelize } from 'sequelize';
import initModels from './models';
import dbConfig from './config/db.config';

const sequelize = new Sequelize(dbConfig);
sequelize.query("SET lc_time_names = 'en_US'");

// sequelize.sync({ force: true })
//     .then((e) => { console.log(e) })
//     .catch((e) => { console.log(e) });

// sequelize.afterConnect((connection) => {
//     connection.query("SET lc_time_names = 'en_US'");
//     connection.query("SET SESSION time_zone = '+00:00'");
// });

sequelize.query("SET lc_time_names = 'en_US'");
sequelize.query("SET SESSION time_zone = '+00:00'");
sequelize.query("SET NAMES utf8mb4");
const models = initModels(sequelize);

export { sequelize, models };