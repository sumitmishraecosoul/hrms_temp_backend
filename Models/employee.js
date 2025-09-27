import { DataTypes } from 'sequelize';
import sequelize from '../Utils/dbConnection.js';

const employee = sequelize.define('employee', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.ENUM,
        values: ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Engineering', 'Customer Support', 'Legal', 'Product', 'Design', 'Operations'],
        allowNull: false,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfJoining: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    biometricId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM,
        values: ['Male', 'Female', 'Other'],
        allowNull: false,
    },
    company:{
        type: DataTypes.ENUM,
        values: ['ThriveBrands', 'EcoSoul'],
        allowNull: false,
    }
});

export default employee;