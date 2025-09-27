import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 8
    },
    attendance: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance"
    }]
});

const User = mongoose.model('User', userSchema);

export default User;
