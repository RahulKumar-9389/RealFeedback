import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    content: string,
    createdAt: Date
}

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    isVerified: boolean,
    isAcceptingMessages: boolean,
    verifyCode: string,
    verifyCodeExpiry: Date,
    messages: Message[]
}


// Message Schema

const messageSchema: Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// User Schema
const userSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    verifyCode: {
        type: String,
        required: [true, "Please fill the verify code."]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [messageSchema],
});

const Users = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default Users;