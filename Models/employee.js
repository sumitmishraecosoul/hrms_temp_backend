import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    employeeId:{
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    department:{
        type: String,
        enum: ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Engineering', 'Customer Support', 'Legal', 'Product', 'Design', 'Operations'],
        required: true,
    },
    designation:{
        type: String,
        required: true,
    },
    dateOfJoining:{
        type: Date,
        required: true,
    },
    biometricId:{
        type: String,
        required: true,
        unique: true,
    },
    gender:{
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
