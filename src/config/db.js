import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');
    await sequelize.sync(); // Sync models
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    if (process.env.NODE_ENV === 'production') {
      console.error('Database connection failed in production. App will continue without DB.');
      return; // Don't exit in production, let the app run
    }
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

export default sequelize;
export { connectDB };