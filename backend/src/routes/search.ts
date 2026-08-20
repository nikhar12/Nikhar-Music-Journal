import { Router } from 'express';
import { z } from 'zod';
import { searchProviders } from '../services/providers.js';
export const searchRouter = Router();
searchRouter.get('/', async (req, res, next) => { try { const { q } = z.object({ q: z.string().trim().min(2).max(200) }).parse(req.query); res.json({ groups: await searchProviders(q) }); } catch (error) { next(error); } });
