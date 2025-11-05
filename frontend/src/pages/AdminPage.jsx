import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
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
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, People, PersonAdd, AdminPanelSettings, Schedule } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getStats(),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  const handleUpdate = async () => {
    try {
      await adminAPI.updateUser(editingUser.id, formData);
      toast.success('Пользователь обновлен');
      handleCloseDialog();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка обновления');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить пользователя?')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('Пользователь удален');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка удаления');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={color}>
                {value}
              </Typography>
            </Box>
            <Box sx={{ color: color, fontSize: 60 }}>
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
        Администрирование
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Управление пользователями и системой
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Всего пользователей"
            value={stats?.total_users || 0}
            icon={<People />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Активные"
            value={stats?.active_users || 0}
            icon={<PersonAdd />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Администраторы"
            value={stats?.admin_count || 0}
            icon={<AdminPanelSettings />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Новые (7 дней)"
            value={stats?.recent_registrations || 0}
            icon={<Schedule />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: 'rgba(30, 41, 59, 0.6)',
                  '& .MuiTableCell-root': {
                    fontWeight: 600,
                    borderBottom: '2px solid rgba(59, 130, 246, 0.2)',
                  }
                }}
              >
                <TableCell>ID</TableCell>
                <TableCell>Имя пользователя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата регистрации</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">{user.username}</Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color={user.role === 'admin' ? 'secondary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? 'Активен' : 'Неактивен'}
                      size="small"
                      color={user.is_active ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.id === 1}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать пользователя</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Имя пользователя"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Роль</InputLabel>
                <Select
                  value={formData.role}
                  label="Роль"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                }
                label="Активен"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleUpdate} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
