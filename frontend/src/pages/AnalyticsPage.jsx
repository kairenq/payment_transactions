import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { analyticsAPI } from '../services/api';
import { toast } from 'react-toastify';

const AnalyticsPage = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthsRange, setMonthsRange] = useState(6);
  const [daysRange, setDaysRange] = useState(30);

  useEffect(() => {
    loadData();
  }, [monthsRange, daysRange]);

  const loadData = async () => {
    try {
      const [monthlyRes, categoryRes, dailyRes, topCatRes] = await Promise.all([
        analyticsAPI.getMonthlyChart(monthsRange),
        analyticsAPI.getCategoryChart(daysRange),
        analyticsAPI.getDailyChart(daysRange),
        analyticsAPI.getTopCategories(10, 'expense'),
      ]);

      setMonthlyData(monthlyRes.data);
      setCategoryData(categoryRes.data);
      setDailyData(dailyRes.data);
      setTopCategories(topCatRes.data);
    } catch (error) {
      toast.error('Ошибка загрузки аналитики');
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Аналитика
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Детальный анализ финансовых операций
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Динамика доходов и расходов</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Период</InputLabel>
                  <Select
                    value={monthsRange}
                    label="Период"
                    onChange={(e) => setMonthsRange(e.target.value)}
                  >
                    <MenuItem value={3}>3 месяца</MenuItem>
                    <MenuItem value={6}>6 месяцев</MenuItem>
                    <MenuItem value={12}>12 месяцев</MenuItem>
                    <MenuItem value={24}>24 месяца</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#2e7d32"
                    strokeWidth={3}
                    name="Доходы"
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#d32f2f"
                    strokeWidth={3}
                    name="Расходы"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Распределение по категориям
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.category}: $${entry.total}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Ежедневная динамика</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Период</InputLabel>
                  <Select
                    value={daysRange}
                    label="Период"
                    onChange={(e) => setDaysRange(e.target.value)}
                  >
                    <MenuItem value={7}>7 дней</MenuItem>
                    <MenuItem value={14}>14 дней</MenuItem>
                    <MenuItem value={30}>30 дней</MenuItem>
                    <MenuItem value={90}>90 дней</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
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

        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Топ-10 категорий расходов
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {topCategories.map((category, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ bgcolor: 'grey.50' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              {index + 1}. {category.category || 'Без категории'}
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="primary">
                              ${category.total_amount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {category.transaction_count} транзакций
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              bgcolor: category.color || '#1976d2',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '24px',
                            }}
                          >
                            {index + 1}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;
