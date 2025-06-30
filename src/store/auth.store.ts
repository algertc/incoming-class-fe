import { create } from 'zustand';
import type { User } from '../models/user.model';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (_user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => {
 
    set({ user });
 
  },
  fetchUser: async () => {
 
    try {
      set({ isLoading: true, error: null });
      const response = await authService.getCurrentUser();
 
      if (response.data && response.data.user) {
 
        set({ user: response.data.user, isLoading: false });
        
      } else {
 
        set({ error: 'No user data received', isLoading: false });
      }
    } catch (err) {
      console.error('AuthStore: fetchUser error:', err);
      set({ error: 'Failed to fetch user profile', isLoading: false });
      throw err; // Re-throw to handle in components
    }
  },
  logout: async () => {
 
    try {
      authService.logout();
      set({ user: null });
    } catch (err) {
      set({ error: 'Failed to logout' });
      throw err; // Re-throw to handle in components
    }
  },
})); 