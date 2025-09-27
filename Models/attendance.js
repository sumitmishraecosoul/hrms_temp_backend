import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true,
    },
    punchIn: {
        type: Date,
    },
    punchOut: {
        type: Date,
    },
    date: {
        type: Date,
        required: true, 
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;


