import authRoutes from '../Users/Routes/auth.js';
import employeeRoutes from '../Users/Routes/employee.js';
import attendanceRoutes from '../Users/Routes/attendance.js';
// import attendanceSheetRoutes from '../Users/Routes/attendanceSheet.js';
// Not in Use 

const All_User_Routes = (app) => {
    app.use('/auth', authRoutes);
    app.use('/employee', employeeRoutes);
    app.use('/attendance', attendanceRoutes);
    // app.use('/attendanceSheet', attendanceSheetRoutes);
}

export default All_User_Routes;