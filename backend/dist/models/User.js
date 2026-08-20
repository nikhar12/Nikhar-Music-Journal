import { Schema, model } from 'mongoose';
const userSchema = new Schema({ username: { type: String, unique: true, required: true, trim: true, lowercase: true }, passwordHash: { type: String, required: true, select: false } }, { timestamps: { createdAt: true, updatedAt: false } });
export const User = model('User', userSchema);
