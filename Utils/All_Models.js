import User from '../Models/user.js';
import Employee from '../Models/employee.js';
import Attendance from '../Models/attendance.js';
import { Op } from 'sequelize';
// import AttendanceSheet from '../Models/attendanceSheet.js';

const All_Models = {
    User,
    Employee,
    Attendance,
    Sequelize: { Op },
    // AttendanceSheet
}

export default All_Models;
