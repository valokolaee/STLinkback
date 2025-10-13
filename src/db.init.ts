// src/db.init.ts
import { sequelize } from './db';
import bcrypt from 'bcryptjs';

async function resetDatabase() {
  try {
    // Disable foreign key checks to allow dropping tables
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('? FOREIGN_KEY_CHECKS disabled');

    // Get list of all tables
    const [tables] = await sequelize.query('SHOW TABLES');
    const tableNames = tables.map((t: any) => Object.values(t)[0]);

    // Drop all tables
    for (const tableName of tableNames) {
      await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      console.log(`? Dropped table: ${tableName}`);
    }

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('? FOREIGN_KEY_CHECKS enabled');

    // Sync database schema
    await sequelize.sync({ force: false });
    console.log('? Database synchronized');

    // Seed roles - Added 'agent' role
    const [userRole] = await sequelize.models.Role.findOrCreate({
      where: { name: 'user' },
      defaults: { description: 'Regular user' },
    });

    const [adminRole] = await sequelize.models.Role.findOrCreate({
      where: { name: 'admin' },
      defaults: { description: 'Administrator' },
    });

    // Create the missing 'agent' role
    const [agentRole] = await sequelize.models.Role.findOrCreate({
      where: { name: 'agent' },
      defaults: { description: 'Agent user' },
    });
    console.log('? Roles seeded: user, admin, agent');

    // Seed admin user
    const adminPassword = 'Amir@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [adminUser] = await sequelize.models.User.findOrCreate({
      where: { email: 'admin@michael.com' }, // Corrected email to match login test
      defaults: {
        username: 'admin',
        email: 'admin@michael.com',
        passwordHash: hashedPassword,
        clientType: 'individual',
        roleId: adminRole.id,
        referralCode: 'ADMIN123',
      },
    });

    console.log(`? Admin created: ${adminUser.email} | Password: ${adminPassword}`);
    console.log('? Database reset completed!');
    process.exit(0);
  } catch (error: any) {
    console.error('? Error:', error.message);
    process.exit(1);
  }
}

// Run the script only if called directly
if (require.main === module) {
  resetDatabase();
}