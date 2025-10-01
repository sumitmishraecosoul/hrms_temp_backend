import All_Models from "./All_Models.js";

const All_Model_Relationships = () => {
    // Employee has many attendances
    All_Models.Employee.hasMany(All_Models.Attendance, { foreignKey: 'employeeId' });
    // Attendance belongs to one employee
    All_Models.Attendance.belongsTo(All_Models.Employee, { foreignKey: 'employeeId' });
}

export default All_Model_Relationships;