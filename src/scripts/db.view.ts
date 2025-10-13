// scripts/db_view.ts
import { sequelize, models } from '../db';

(async () => {
  try {
    console.log('?? Connecting to database...');
    await sequelize.authenticate();
    console.log('? Connected to database.');

    const modelNames = Object.keys(models).filter(
      (key) => key !== 'sequelize' && key !== 'Sequelize'
    );

    for (const modelName of modelNames) {
      const Model = models[modelName];

      const count = await Model.count();
      console.log(`\n?? Table: ${Model.tableName} (${count} record(s))`);

      if (count > 0) {
        const sample = await Model.findAll({ limit: 50 });
        const rows = sample.map(row => row.toJSON());

        console.log('\n--- Sample Records ---');
        console.table(rows);
      } else {
        console.log('\n(No records found)');
      }

      const schema = [];
      const attributes = Model.rawAttributes;

      for (const attr in attributes) {
        const col = attributes[attr];
        schema.push({
          Column: col.field || attr,
          Type: col.type.toString(),
          NotNull: col.allowNull === false ? 'YES' : 'NO',
          Default: col.defaultValue ?? '-',
          PrimaryKey: col.primaryKey ? 'YES' : 'NO',
        });
      }

      console.log('\n--- Schema ---');
      console.table(schema);
    }

    console.log('\n?? Database view completed successfully.');

  } catch (error: any) {
    console.error('? Error reading database:', error.message);
  } finally {
    await sequelize.close();
    console.log('\n?? Database connection closed.');
  }
})();
