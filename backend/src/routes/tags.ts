import { Router } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.js';
import { JournalEntry } from '../models/JournalEntry.js';

export const tagsRouter = Router();
tagsRouter.get('/', async (req: AuthRequest, res, next) => { try { const rows = await JournalEntry.aggregate<{ _id: string; count: number }>([{ $match: { userId: req.userId } }, { $unwind: '$tags' }, { $group: { _id: '$tags', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]); res.json({ data: rows.map(row => ({ name: row._id, count: row.count })) }); } catch (error) { next(error); } });
tagsRouter.patch('/:name', async (req: AuthRequest, res, next) => { try { const oldName = z.string().min(1).max(50).parse(req.params.name); const { name } = z.object({ name: z.string().trim().min(1).max(50) }).parse(req.body); await JournalEntry.updateMany({ userId: req.userId, tags: oldName }, { $set: { 'tags.$[tag]': name } }, { arrayFilters: [{ tag: oldName }] }); res.json({ name }); } catch (error) { next(error); } });
