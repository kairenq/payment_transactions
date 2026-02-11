import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access_token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem('access_token', access_token);

      // Set user state
      setUser(user);

      toast.success('Успешный вход!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка входа');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { access_token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem('access_token', access_token);

      // Set user state
      setUser(user);

      toast.success('Регистрация успешна!');
      return true;
    } catch (error) {
      // Handle validation errors (422)
      if (error.response?.status === 422 && error.response?.data?.detail) {
        const errors = error.response.data.detail;
        if (Array.isArray(errors) && errors.length > 0) {
          // Show first validation error with field name
          const firstError = errors[0];
          const field = firstError.loc?.[1] || 'поле';
          const fieldNames = {
            'username': 'Имя пользователя',
            'email': 'Email',
            'password': 'Пароль'
          };
          const fieldName = fieldNames[field] || field;
          const message = firstError.msg || 'Некорректное значение';
          toast.error(`${fieldName}: ${message}`);
        } else {
          toast.error('Ошибка валидации данных');
        }
      } else {
        // Handle other errors
        toast.error(error.response?.data?.detail || 'Ошибка регистрации');
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore errors on logout
    } finally {
      // Clear token and user state
      localStorage.removeItem('access_token');
      setUser(null);
      toast.info('Вы вышли из системы');
    }
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
