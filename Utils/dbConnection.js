import { Sequelize } from 'sequelize';
import tedious from 'tedious';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT,
  dialectModule: tedious,
  dialectOptions: {
    encrypt: process.env.DB_ENCRYPT === 'true',
  },
});

export default sequelize;
