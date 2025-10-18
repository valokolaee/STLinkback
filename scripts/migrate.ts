import { Sequelize } from "sequelize";
import dbConfig from "../src/config/db.config.ts";
import { SequelizeStorage, Umzug } from "umzug";
import path from "path";



const sequelize = new Sequelize(dbConfig);

const umzug = new Umzug({
  migrations: {
    glob: '/Volumes/second/proj/kazemian/STLink/STLinkback/migrations',
    resolve: ({ name, path, context }) => {
      const migration = require(path!);
      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    }
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: 'migration_meta'
  }),
  logger: console,
  // migrations: {
  //   path: "/Volumes/second/proj/kazemian/STLink/STLinkback/migrations/migrations.js",

  //   params: [sequelize.getQueryInterface(), Sequelize],
  // },
  // storage: new SequelizeStorage({
  //   sequelize,
  //   modelName: "migration_meta", // Optional: custom table name
  // }),
  // context: sequelize.getQueryInterface(),
  // logger: console,

  // migrations: {
  //   path: '/Volumes/second/proj/kazemian/STLink/STLinkback/migrations/migrations.js',
  //   // path: path.join(__dirname, '../migrations'),
  //   params: [sequelize.getQueryInterface(), Sequelize],
  // },
  // storage: 'sequelize',
  // storageOptions: {
  //   sequelize: sequelize
  // }
});

const runMigrations = async () => {
  try {
    const migrations = await umzug.up();
    console.log('Migrations completed:', migrations.length);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();