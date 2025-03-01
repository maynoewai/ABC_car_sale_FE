import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface LoginData {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const authService = {
  login: async (data: LoginData) => {
    return axios.post(`${API_URL}/login`, data);
  },

  register: async (data: RegisterData) => {
    return axios.post(`${API_URL}/register`, data);
  },

  logout: async () => {
    return axios.post(`${API_URL}/logout`);
  }
};