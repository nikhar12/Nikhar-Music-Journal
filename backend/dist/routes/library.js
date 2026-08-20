import { Router } from 'express';
import { z } from 'zod';
import { JournalEntry } from '../models/JournalEntry.js';
import { MusicRecord } from '../models/MusicRecord.js';
export const libraryRouter = Router();
const entryInput = z.object({ musicRecordId: z.string().length(24), rating: z.number().min(.5).max(5).multipleOf(.5).optional(), favorite: z.boolean().optional(), notes: z.string().max(50000).optional(), tags: z.array(z.string().min(1).max(50)).max(100).optional(), memories: z.string().max(50000).optional() });
libraryRouter.get('/', async (req, res, next) => { try {
    const query = z.object({ q: z.string().optional(), page: z.coerce.number().min(1).default(1), limit: z.coerce.number().min(1).max(100).default(24), favorite: z.enum(['true', 'false']).optional(), sort: z.enum(['recent', 'rating', 'title']).default('recent') }).parse(req.query);
    const filter = { userId: req.userId };
    if (query.favorite)
        filter.favorite = query.favorite === 'true';
    if (query.q) {
        const records = await MusicRecord.find({ $text: { $search: query.q } }).select('_id').lean();
        filter.musicRecordId = { $in: records.map(record => record._id) };
    }
    const sort = query.sort === 'rating' ? { rating: -1, updatedAt: -1 } : { createdAt: -1 };
    const [entries, total] = await Promise.all([JournalEntry.find(filter).sort(sort).skip((query.page - 1) * query.limit).limit(query.limit).populate('musicRecordId').lean(), JournalEntry.countDocuments(filter)]);
    res.json({ data: entries, meta: { page: query.page, limit: query.limit, total, pages: Math.ceil(total / query.limit) } });
}
catch (error) {
    next(error);
} });
libraryRouter.post('/', async (req, res, next) => { try {
    const input = entryInput.parse(req.body);
    const entry = await JournalEntry.findOneAndUpdate({ userId: req.userId, musicRecordId: input.musicRecordId }, { $set: input, $setOnInsert: { userId: req.userId } }, { new: true, upsert: true, runValidators: true }).populate('musicRecordId');
    res.status(201).json(entry);
}
catch (error) {
    next(error);
} });
libraryRouter.patch('/:id', async (req, res, next) => { try {
    const input = entryInput.omit({ musicRecordId: true }).parse(req.body);
    const entry = await JournalEntry.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: input }, { new: true, runValidators: true }).populate('musicRecordId');
    if (!entry)
        return res.status(404).json({ message: 'Journal entry not found.' });
    res.json(entry);
}
catch (error) {
    next(error);
} });
