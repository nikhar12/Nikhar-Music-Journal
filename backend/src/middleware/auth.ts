import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export interface AuthRequest extends Request { userId?: string; }
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) { const token = req.header('Authorization')?.replace(/^Bearer\s+/i, ''); if (!token) return res.status(401).json({ message: 'Authentication required.' }); try { req.userId = (jwt.verify(token, env.jwtSecret) as { sub: string }).sub; next(); } catch { res.status(401).json({ message: 'Invalid or expired session.' }); } }
