import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  FilterList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { transactionsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { fadeIn } from '../styles/theme';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({ type: '', status: '', category_id: '' });
  const [formData, setFormData] = useState({
    category_id: '',
    type: 'expense',
    amount: '',
    currency: 'USD',
    description: '',
    recipient: '',
    sender: '',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      const [transRes, catRes] = await Promise.all([
        transactionsAPI.getAll(filters),
        transactionsAPI.getCategories(),
      ]);
      setTransactions(transRes.data);
      setCategories(catRes.data);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        category_id: transaction.category_id || '',
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description || '',
        recipient: transaction.recipient || '',
        sender: transaction.sender || '',
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        category_id: '',
        type: 'expense',
        amount: '',
        currency: 'USD',
        description: '',
        recipient: '',
        sender: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingTransaction) {
        await transactionsAPI.update(editingTransaction.id, formData);
        toast.success('Транзакция обновлена');
      } else {
        await transactionsAPI.create(formData);
        toast.success('Транзакция создана');
      }
      handleCloseDialog();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить транзакцию?')) return;
    try {
      await transactionsAPI.delete(id);
      toast.success('Транзакция удалена');
      loadData();
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      completed: 'success',
      failed: 'error',
      cancelled: 'default',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      income: 'success',
      expense: 'error',
      transfer: 'info',
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Транзакции
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Управление платежными операциями
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Создать транзакцию
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <FilterList />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Тип</InputLabel>
            <Select
              value={filters.type}
              label="Тип"
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="income">Доход</MenuItem>
              <MenuItem value="expense">Расход</MenuItem>
              <MenuItem value="transfer">Перевод</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              value={filters.status}
              label="Статус"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="pending">В обработке</MenuItem>
              <MenuItem value="completed">Завершено</MenuItem>
              <MenuItem value="failed">Ошибка</MenuItem>
              <MenuItem value="cancelled">Отменено</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Категория</InputLabel>
            <Select
              value={filters.category_id}
              label="Категория"
              onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
            >
              <MenuItem value="">Все</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {(filters.type || filters.status || filters.category_id) && (
            <Button size="small" onClick={() => setFilters({ type: '', status: '', category_id: '' })}>
              Сбросить
            </Button>
          )}
        </Box>
      </Paper>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: alpha('#1e293b', 0.6),
                  '& .MuiTableCell-root': {
                    fontWeight: 600,
                    borderBottom: `2px solid ${alpha('#3b82f6', 0.2)}`,
                  }
                }}
              >
                <TableCell>Дата</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell align="right">Сумма</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">Транзакций пока нет</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction, index) => (
                  <TableRow
                    key={transaction.id}
                    component={motion.tr}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    sx={{
                      '&:hover': {
                        bgcolor: alpha('#3b82f6', 0.08),
                      }
                    }}
                  >
                    <TableCell>
                      {new Date(transaction.transaction_date).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      {transaction.category_name && (
                        <Chip
                          label={transaction.category_name}
                          size="small"
                          sx={{
                            bgcolor: transaction.category_color,
                            color: 'white',
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{transaction.description || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.type}
                        size="small"
                        color={getTypeColor(transaction.type)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        fontWeight="bold"
                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {transaction.amount} {transaction.currency}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        size="small"
                        color={getStatusColor(transaction.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(transaction)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransaction ? 'Редактировать транзакцию' : 'Новая транзакция'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Тип</InputLabel>
                <Select
                  value={formData.type}
                  label="Тип"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="income">Доход</MenuItem>
                  <MenuItem value="expense">Расход</MenuItem>
                  <MenuItem value="transfer">Перевод</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={formData.category_id}
                  label="Категория"
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <MenuItem value="">Без категории</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Сумма"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                inputProps={{ min: 0.01, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Валюта"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Получатель"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Отправитель"
                value={formData.sender}
                onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTransaction ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionsPage;
