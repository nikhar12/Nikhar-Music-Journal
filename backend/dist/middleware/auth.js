import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function requireAuth(req, res, next) { const token = req.header('Authorization')?.replace(/^Bearer\s+/i, ''); if (!token)
    return res.status(401).json({ message: 'Authentication required.' }); try {
    req.userId = jwt.verify(token, env.jwtSecret).sub;
    next();
}
catch {
    res.status(401).json({ message: 'Invalid or expired session.' });
} }
