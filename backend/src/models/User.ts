import { Schema, model } from 'mongoose';
export interface UserDocument { username: string; passwordHash: string; createdAt: Date; }
const userSchema = new Schema<UserDocument>({ username: { type: String, unique: true, required: true, trim: true, lowercase: true }, passwordHash: { type: String, required: true, select: false } }, { timestamps: { createdAt: true, updatedAt: false } });
export const User = model<UserDocument>('User', userSchema);
