import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  alpha,
} from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a1929',
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <AccountBalance sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              </motion.div>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Вход в систему
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Управление платежными транзакциями
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Имя пользователя"
                margin="normal"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Пароль"
                type="password"
                margin="normal"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Войти
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Нет аккаунта?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/register')}
                  sx={{ cursor: 'pointer' }}
                >
                  Зарегистрироваться
                </Link>
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: alpha('#3b82f6', 0.1),
                border: `1px solid ${alpha('#3b82f6', 0.3)}`,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#60a5fa', fontWeight: 500 }}>
                Тестовый доступ: admin / admin123
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
