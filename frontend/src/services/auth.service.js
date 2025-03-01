import api from './api';

const AuthService = {
  register: (name, email, password, password_confirmation) => {
    return api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation
    });
  },
  
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      });
  },
  
  logout: () => {
    return api.post('/auth/logout')
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default AuthService;