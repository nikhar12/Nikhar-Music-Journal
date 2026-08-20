import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
export const authRouter = Router();
authRouter.post('/login', async (req, res, next) => { try {
    const input = z.object({ username: z.string().min(1), password: z.string().min(1) }).parse(req.body);
    const user = await User.findOne({ username: input.username.toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash)))
        return res.status(401).json({ message: 'Incorrect username or password.' });
    const token = jwt.sign({ sub: user._id.toString() }, env.jwtSecret, { expiresIn: '30d' });
    res.json({ token, user: { username: user.username } });
}
catch (error) {
    next(error);
} });
