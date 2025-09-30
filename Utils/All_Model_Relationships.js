import All_Models from "./All_Models.js";

const All_Model_Relationships = () => {
    All_Models.Employee.belongsTo(All_Models.Attendance, { foreignKey: 'id' });
    All_Models.Attendance.hasMany(All_Models.Employee, { foreignKey: 'id' });
}

export default All_Model_Relationships;