export type UserRole = 'employee' | 'manager' | 'admin';

export type UserType = {
  UserId?: string;
  Name?: string;
  role?: UserRole;
  [key: string]: any;
} | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
