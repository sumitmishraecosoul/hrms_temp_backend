import { DataTypes } from 'sequelize';
import sequelize from '../Utils/dbConnection.js';

const attendance = sequelize.define('attendance', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employees',
            key: 'id'
        }
    },
    biometricId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: ['Present', 'Absent', 'Half Day', 'Late'],
        allowNull: false,
    },
    punchIn: {
        type: DataTypes.TIME,
        allowNull: true, // Nullable for absent employees
    },
    punchOut: {
        type: DataTypes.TIME,
        allowNull: true, // Nullable for absent employees
    },
    workingHours: {
        type: DataTypes.DECIMAL(4, 2), // For calculated hours (e.g., 8.50)
        allowNull: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false, 
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ['employeeId', 'date']
        },
        {
            fields: ['employeeId']
        },
        {
            fields: ['biometricId']
        },
        {
            fields: ['date']
        }
    ]
});


export default attendance;


