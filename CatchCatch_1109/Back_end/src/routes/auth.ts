import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

interface UserRow extends RowDataPacket {
  user_id: number;
  email: string;
  password_hash: string | null;
  nickname: string;
}

// 1. 이메일 회원가입 (POST /api/auth/signup)
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    res.status(400).json({ message: '이메일, 비밀번호, 닉네임을 모두 입력해주세요.' });
    return;
  }

  try {
    // 중복 이메일 확인
    const [existing] = await pool.query<UserRow[]>(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      res.status(409).json({ message: '이미 가입된 이메일입니다.' });
      return;
    }

    // 비밀번호 암호화 후 저장
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (email, password_hash, nickname, provider) VALUES (?, ?, ?, ?)',
      [email, passwordHash, nickname, 'LOCAL']
    );

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: {
        user_id: result.insertId,
        email,
        nickname,
      },
    });
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 2. 자체 로그인 및 JWT 발급 (POST /api/auth/login)
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
    return;
  }

  try {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT user_id, email, password_hash, nickname FROM users WHERE email = ?',
      [email]
    );

    const user = rows[0];

    if (!user || !user.password_hash) {
      res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'catchcatch_jwt_secret_key_2026';
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, nickname: user.nickname },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      message: '로그인 성공',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 3. 내 로그인 상태(토큰) 확인 (GET /api/auth/me)
router.get('/me', authenticateToken, (req: AuthRequest, res: Response): void => {
  res.json({
    message: '인증된 사용자입니다.',
    user: req.user,
  });
});

export default router;