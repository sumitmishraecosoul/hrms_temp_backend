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
        values: ['Data Analytics', 'Human Resources and Administration', 'Finance & Accounts', 
            'Digital Marketing', 'Supply Chain', 'New Product Design', 'Supply Chain-Operations', 
            'Retail E-commerce', 'India E-commerce', 'E-commerce','Zonal Sales (India)- HORECA','Zonal Sales (India)','Zonal Sales'],
        allowNull: false,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // dateOfJoining: {
    //     type: DataTypes.DATE,
    //     allowNull: false,
    // },
    biometricId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    workAnniversary: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
});

export default employee;