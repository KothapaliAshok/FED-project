import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@library.com',
    name: 'Admin User',
    role: 'admin',
    phone: '+1234567890',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'librarian@library.com',
    name: 'Librarian User',
    role: 'librarian',
    phone: '+1234567891',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'student@library.com',
    name: 'Student User',
    role: 'student',
    phone: '+1234567892',
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        // Mock authentication - in real app, this would be an API call
        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'password') {
          const token = `mock-token-${Date.now()}`;
          set({ user, token });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, token: null });
      },
      isAuthenticated: () => {
        return get().user !== null && get().token !== null;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

