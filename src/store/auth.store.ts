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
    console.log('AuthStore: setUser called with:', user);
    set({ user });
    console.log('AuthStore: user state updated');
  },
  fetchUser: async () => {
    console.log('AuthStore: fetchUser called');
    try {
      set({ isLoading: true, error: null });
      const response = await authService.getCurrentUser();
      console.log('AuthStore: fetchUser response:', response);
      if (response.data && response.data.user) {
        console.log('AuthStore: Setting user from fetchUser:', response.data.user);
        set({ user: response.data.user, isLoading: false });
        
      } else {
        console.log('AuthStore: No user data in response');
        set({ error: 'No user data received', isLoading: false });
      }
    } catch (err) {
      console.error('AuthStore: fetchUser error:', err);
      set({ error: 'Failed to fetch user profile', isLoading: false });
      throw err; // Re-throw to handle in components
    }
  },
  logout: async () => {
    console.log('AuthStore: logout called');
    try {
      authService.logout();
      set({ user: null });
    } catch (err) {
      set({ error: 'Failed to logout' });
      throw err; // Re-throw to handle in components
    }
  },
})); 