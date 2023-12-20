const TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'user_role';

const AuthService = {
  login: (token, role) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRole: () => {
    return localStorage.getItem(ROLE_KEY);
  },

  isLoggedIn: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default AuthService;
