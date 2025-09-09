import { mockApi } from './mockApi';

interface AuthState {
  token: string | null;
  user: any | null;
  expiresAt: number | null;
}

class AuthService {
  private state: AuthState = {
    token: null,
    user: null,
    expiresAt: null
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          this.state = parsed;
        } else {
          this.logout();
        }
      }
    } catch (error) {
      console.error('Error loading auth from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('auth', JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving auth to storage:', error);
    }
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    const result = await mockApi.login(email, password);
    
    this.state = {
      token: result.token,
      user: result.user,
      expiresAt: Date.now() + (result.expiresInSec * 1000)
    };

    if (rememberMe) {
      this.saveToStorage();
    }

    return result;
  }

  logout() {
    this.state = { token: null, user: null, expiresAt: null };
    localStorage.removeItem('auth');
  }

  getToken(): string | null {
    if (this.state.expiresAt && Date.now() >= this.state.expiresAt) {
      this.logout();
      return null;
    }
    return this.state.token;
  }

  getUser() {
    return this.state.user;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getTimeUntilExpiry(): number {
    if (!this.state.expiresAt) return 0;
    return Math.max(0, this.state.expiresAt - Date.now());
  }
}

export const authService = new AuthService();