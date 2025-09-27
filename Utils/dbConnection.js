import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnection = () => {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
        })
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
    }
}

export default dbConnection;