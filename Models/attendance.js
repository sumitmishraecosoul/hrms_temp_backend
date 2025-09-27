import { DataTypes } from 'sequelize';
import sequelize from '../Utils/dbConnection.js';

const attendance = sequelize.define('attendance', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: ['Present', 'Absent'],
        allowNull: false,
    },
    punchIn: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    punchOut: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false, 
    },
});


export default attendance;


