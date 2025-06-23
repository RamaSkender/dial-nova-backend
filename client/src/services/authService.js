import axios from 'axios';

const API_URL = 'https://dial-nova-backend.onrender.com/api/auth/';

const signup = (email, password) => {
  return axios.post(API_URL + 'signup', {
    email,
    password,
  });
};

const signin = (email, password) => {
  return axios
    .post(API_URL + 'signin', {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  signup,
  signin,
  logout,
};

export default authService; 