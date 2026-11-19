import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtUserPayload {
  user_id: number;
  email: string;
  nickname: string;
}

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <TOKEN>"

  if (!token) {
    res.status(401).json({ message: '로그인이 필요합니다. (토큰 없음)' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'catchcatch_jwt_secret_key_2026';

  try {
    const decoded = jwt.verify(token, secret) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: '유효하지 않거나 만료된 토큰입니다.' });
  }
};