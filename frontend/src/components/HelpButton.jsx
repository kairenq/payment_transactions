import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Help,
  Close,
  Dashboard,
  AccountBalance,
  TrendingUp,
  Category,
  AdminPanelSettings,
  PersonAdd,
  Payment,
  BarChart,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const HelpButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const features = [
    {
      icon: <Dashboard sx={{ color: '#1976d2' }} />,
      title: 'Дашборд',
      description: 'Общая статистика, графики доходов и расходов, последние транзакции. Быстрый обзор финансового состояния.',
    },
    {
      icon: <Payment sx={{ color: '#2e7d32' }} />,
      title: 'Транзакции',
      description: 'Создавайте, редактируйте и удаляйте платежные операции. Фильтруйте по типу, статусу и категориям. Полный контроль над финансами.',
    },
    {
      icon: <BarChart sx={{ color: '#ed6c02' }} />,
      title: 'Аналитика',
      description: 'Детальная аналитика с графиками по месяцам, категориям и трендам расходов. Принимайте обоснованные финансовые решения.',
    },
    {
      icon: <Category sx={{ color: '#9c27b0' }} />,
      title: 'Категории',
      description: 'Управляйте категориями платежей. Создавайте свои категории с уникальными цветами для удобной визуализации.',
    },
    {
      icon: <AdminPanelSettings sx={{ color: '#d32f2f' }} />,
      title: 'Администрирование',
      description: 'Управление пользователями, одобрение транзакций и статистика системы (только для администраторов).',
    },
  ];

  const quickTips = [
    '💡 Используйте фильтры для быстрого поиска нужных транзакций',
    '📊 Графики и статистика обновляются автоматически в реальном времени',
    '🎨 Создавайте цветные категории для визуального разделения типов расходов',
    '⚡ Все изменения сохраняются мгновенно без задержек',
    '🔐 Только администраторы могут одобрять или отклонять транзакции',
  ];

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Fab
          color="primary"
          aria-label="help"
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
          }}
        >
          <Help />
        </Fab>
      </motion.div>

      {/* Help Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(19, 47, 76, 0.95) 0%, rgba(10, 25, 41, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Help sx={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Руководство по использованию
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Payment Transactions System
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Features Section */}
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2, mb: 2 }}>
                🚀 Основные возможности
              </Typography>

              <List>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListItem
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon>{feature.icon}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="600">
                            {feature.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {feature.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>

              <Divider sx={{ my: 3 }} />

              {/* Quick Tips Section */}
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                💡 Быстрые подсказки
              </Typography>

              <Box
                sx={{
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: 2,
                  p: 2,
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
              >
                {quickTips.map((tip, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      '&:last-child': { mb: 0 },
                    }}
                  >
                    {tip}
                  </Typography>
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Getting Started */}
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                🎯 С чего начать?
              </Typography>

              <Box
                sx={{
                  bgcolor: 'rgba(46, 125, 50, 0.1)',
                  borderRadius: 2,
                  p: 2,
                  border: '1px solid rgba(46, 125, 50, 0.2)',
                }}
              >
                <Typography variant="body2" paragraph>
                  <strong>1.</strong> Создайте несколько <strong>категорий</strong> для ваших расходов и доходов
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>2.</strong> Добавьте ваши <strong>транзакции</strong> (доходы, расходы, переводы)
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>3.</strong> Просматривайте <strong>аналитику</strong> и отслеживайте свои финансы
                </Typography>
                <Typography variant="body2">
                  <strong>4.</strong> Используйте <strong>фильтры</strong> для поиска нужных транзакций
                </Typography>
              </Box>

              {/* Footer */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Нужна помощь? Нажмите на кнопку с книгой в левом нижнем углу в любое время! 📚
                </Typography>
              </Box>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpButton;
