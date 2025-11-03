import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  PendingActions,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { analyticsAPI, transactionsAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, monthlyRes, categoryRes, statusRes, activityRes] = await Promise.all([
        analyticsAPI.getStats(),
        analyticsAPI.getMonthlyChart(6),
        analyticsAPI.getCategoryChart(30),
        analyticsAPI.getStatusChart(),
        analyticsAPI.getRecentActivity(5),
      ]);

      setStats(statsRes.data);
      setMonthlyData(monthlyRes.data);
      setCategoryData(categoryRes.data);
      setStatusData(statusRes.data);
      setRecentActivity(activityRes.data);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={color}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box sx={{ color: color, fontSize: 50 }}>
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Дашборд
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Общая статистика и аналитика
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Баланс"
            value={`$${stats?.balance || 0}`}
            icon={<AccountBalance />}
            color="#1976d2"
            subtitle={`${stats?.total_transactions || 0} транзакций`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Доходы"
            value={`$${stats?.total_income || 0}`}
            icon={<TrendingUp />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Расходы"
            value={`$${stats?.total_expense || 0}`}
            icon={<TrendingDown />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="В обработке"
            value={stats?.pending_count || 0}
            icon={<PendingActions />}
            color="#ed6c02"
            subtitle={`Завершено: ${stats?.completed_count || 0}`}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Динамика по месяцам
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#2e7d32" name="Доходы" />
                  <Bar dataKey="expense" fill="#d32f2f" name="Расходы" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                По статусам
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Расходы по категориям (30 дней)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Последние транзакции
              </Typography>
              {recentActivity.length === 0 ? (
                <Typography color="text.secondary">Транзакций пока нет</Typography>
              ) : (
                recentActivity.map((transaction, index) => (
                  <Box
                    key={transaction.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      bgcolor: index % 2 === 0 ? 'grey.50' : 'white',
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: transaction.category_color || '#1976d2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        {transaction.type === 'income' ? '↑' : '↓'}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {transaction.description || transaction.category_name || 'Без описания'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(transaction.transaction_date).toLocaleDateString('ru-RU')}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </Typography>
                  </Box>
                ))
              )}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
