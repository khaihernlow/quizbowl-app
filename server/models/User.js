import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    id: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});

export default mongoose.model('User', userSchema);