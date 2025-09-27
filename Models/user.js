import { DataTypes } from 'sequelize';
import sequelize from '../Utils/dbConnection.js';

const user = sequelize.define('user', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default user;