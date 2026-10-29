import { createContext, useContext, useEffect, useState } from 'react';
import * as AuthController from '../controllers/AuthController';

const AuthContext = createContext(null);

// Giữ thông tin user đang đăng nhập và chia sẻ cho mọi màn hình.
// user = null nghĩa là chưa đăng nhập -> AppNavigator chỉ hiển thị màn hình Login.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startupError, setStartupError] = useState('');

  // Khi app khởi động: chuẩn bị database và khôi phục phiên đăng nhập cũ.
  useEffect(() => {
    async function prepareApp() {
      try {
        setUser(await AuthController.initializeAuth());
      } catch {
        setStartupError('Could not open the local database. Please restart the app.');
      } finally {
        setIsLoading(false);
      }
    }
    prepareApp();
  }, []);

  async function signIn(username, password) {
    const result = await AuthController.login(username, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }

  async function signOut() {
    await AuthController.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, startupError, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
