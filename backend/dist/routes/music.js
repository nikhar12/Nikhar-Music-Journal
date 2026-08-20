import { Router } from 'express';
import { z } from 'zod';
import { JournalEntry } from '../models/JournalEntry.js';
import { MusicRecord } from '../models/MusicRecord.js';
export const musicRouter = Router();
const selectedSong = z.object({ provider: z.enum(['spotify', 'youtube']), providerId: z.string().min(1).max(200), title: z.string().min(1).max(300), artists: z.array(z.string().min(1).max(300)).min(1).max(20), album: z.string().max(300).optional(), artworkUrl: z.string().url().optional(), externalUrl: z.string().url(), durationMs: z.number().int().positive().optional(), releaseDate: z.string().date().optional(), metadata: z.record(z.string(), z.unknown()).default({}), rating: z.number().min(.5).max(5).multipleOf(.5), favorite: z.boolean().default(false), tags: z.array(z.string().min(1).max(50)).max(100).default([]), notes: z.string().max(50000).default('') });
musicRouter.post('/from-provider', async (req, res, next) => { try {
    const input = selectedSong.parse(req.body);
    const existing = await MusicRecord.findOne({ providers: { $elemMatch: { provider: input.provider, providerId: input.providerId } } });
    const record = existing ?? await MusicRecord.create({ title: input.title, album: input.album, artists: input.artists, durationMs: input.durationMs, releaseDate: input.releaseDate, artworkUrl: input.artworkUrl, preferredProvider: input.provider, providers: [{ provider: input.provider, providerId: input.providerId, externalUrl: input.externalUrl, artworkUrl: input.artworkUrl, data: input.metadata, lastSyncedAt: new Date() }], keywords: [input.title, ...input.artists, input.album].filter((value) => Boolean(value)), lastMetadataSync: new Date() });
    const entry = await JournalEntry.findOneAndUpdate({ userId: req.userId, musicRecordId: record._id }, { $setOnInsert: { userId: req.userId, musicRecordId: record._id }, $set: { rating: input.rating, favorite: input.favorite, tags: input.tags, notes: input.notes } }, { new: true, upsert: true, runValidators: true }).populate('musicRecordId');
    res.status(existing ? 200 : 201).json(entry);
}
catch (error) {
    next(error);
} });
