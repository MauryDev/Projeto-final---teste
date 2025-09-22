// types/index.ts

// Interface para representar os dados de um usuário
export interface User {
  id: string;
  username: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

// Interface para o contexto de autenticação global
export interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  currentPage: string;
  API_BASE_URL: string;
  setCurrentPage: (page: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  handleLogin: (username: string, password: string) => Promise<void>;
  handleLogout: () => void;
  handleRegister: (username: string, password: string) => Promise<void>;
  handleUpdatePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
  fetchUserProfile: (jwtToken: string) => Promise<void>;
}
