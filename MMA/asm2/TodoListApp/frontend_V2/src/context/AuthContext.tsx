import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Alert } from "react-native";

import { ApiError, setAuthToken, setUnauthorizedHandler } from "../api/apiClient";
import * as authApi from "../api/authApi";
import type { User } from "../api/authApi";
import { clearToken, getToken, saveToken } from "../storage/tokenStorage";

// loading: đang kiểm tra token đã lưu lúc mở app
type AuthStatus = "loading" | "signedIn" | "signedOut";

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);

  // Xoá phiên ở phía app: token trong bộ nhớ, token đã lưu và thông tin user
  const clearSession = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    setStatus("signedOut");
    await clearToken();
  }, []);

  // Auto-login: có token đã lưu thì hỏi server (/auth/me) xem còn hợp lệ không
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = await getToken();
      if (!savedToken) {
        setStatus("signedOut");
        return;
      }

      setAuthToken(savedToken);
      try {
        setUser(await authApi.getMe());
        setStatus("signedIn");
      } catch (error) {
        setAuthToken(null);
        setStatus("signedOut");
        // Chỉ xoá token khi server từ chối; mất mạng thì giữ lại để lần sau thử tiếp
        if (error instanceof ApiError && error.status === 401) {
          await clearToken();
        } else if (error instanceof Error) {
          Alert.alert("Không thể tự đăng nhập", error.message);
        }
      }
    };

    restoreSession().catch(() => setStatus("signedOut"));
  }, []);

  // Đang dùng app mà server trả 401 (token hết hạn / đã logout ở nơi khác) thì về màn hình Login
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      Alert.alert("Phiên đăng nhập đã hết hạn", "Vui lòng đăng nhập lại.");
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const login = useCallback(
    async (username: string, password: string, rememberMe: boolean) => {
      const result = await authApi.login(username, password, rememberMe);

      setAuthToken(result.token);
      // Có tick thì lưu token cho lần mở app sau, không tick thì chỉ giữ trong bộ nhớ
      if (result.rememberMe) {
        await saveToken(result.token);
      } else {
        await clearToken();
      }

      setUser(result.userInfo);
      setStatus("signedIn");
    },
    []
  );

  const register = useCallback(async (username: string, password: string) => {
    await authApi.register(username, password);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Server lỗi hoặc mất mạng vẫn đăng xuất ở phía app
    }
    await clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider value={{ status, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
