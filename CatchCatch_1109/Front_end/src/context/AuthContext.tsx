import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserInfo {
  user_id: number;
  email: string;
  nickname: string;
}

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:4000/api/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 앱 시작 시 localStorage에 저장된 로그인 정보 복원
  useEffect(() => {
    const savedToken = localStorage.getItem('catchcatch_token');
    const savedUser = localStorage.getItem('catchcatch_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser) as UserInfo);
      } catch {
        localStorage.removeItem('catchcatch_token');
        localStorage.removeItem('catchcatch_user');
      }
    }
  }, []);

  // 회원가입
  const signup = async (email: string, password: string, nickname: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nickname }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || '회원가입에 실패했습니다.');
    }
  };

  // 로그인
  const login = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    localStorage.setItem('catchcatch_token', data.token);
    localStorage.setItem('catchcatch_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  // 로그아웃
  const logout = (): void => {
    localStorage.removeItem('catchcatch_token');
    localStorage.removeItem('catchcatch_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};