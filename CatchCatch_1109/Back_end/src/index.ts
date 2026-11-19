import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:8443', credentials: true }));
app.use(express.json());

// 기본 안내
app.get('/', (_req: Request, res: Response) => {
  res.send('CATCHCATCH 백엔드 서버가 정상 작동 중입니다.');
});

// DB 연결 확인 API
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    res.json({
      status: 'OK',
      message: 'CATCHCATCH 백엔드 및 MariaDB(3308) 연결 성공',
      tables: rows,
    });
  } catch (error) {
    console.error('DB 연결 실패:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'MariaDB 연결에 실패했습니다. .env 설정과 DB 실행 상태를 확인하세요.',
    });
  }
});

// 사용자 인증 API (회원가입, 로그인, 토큰 검증)
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`🚀 CATCHCATCH Back_end server running on http://localhost:${PORT}`);
});