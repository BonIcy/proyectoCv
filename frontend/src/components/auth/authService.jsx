const TOKEN_KEY = 'auth_token';

const AuthService = {
  login: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isLoggedIn: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default AuthService;