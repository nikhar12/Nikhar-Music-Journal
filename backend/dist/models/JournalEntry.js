import { Schema, model } from 'mongoose';
const journalEntrySchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, musicRecordId: { type: Schema.Types.ObjectId, ref: 'MusicRecord', required: true }, rating: { type: Number, min: 0.5, max: 5, validate: { validator: (value) => Number.isInteger(value * 2), message: 'Rating must use half-star increments.' } }, favorite: { type: Boolean, default: false }, notes: { type: String, default: '' }, tags: { type: [String], default: [] }, memories: { type: String, default: '' }, lastPlayedAt: Date, listenCount: { type: Number, default: 0, min: 0 } }, { timestamps: true });
journalEntrySchema.index({ userId: 1, musicRecordId: 1 }, { unique: true });
journalEntrySchema.index({ userId: 1, favorite: 1, rating: -1, createdAt: -1 });
export const JournalEntry = model('JournalEntry', journalEntrySchema);
