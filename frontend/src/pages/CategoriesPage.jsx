import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { transactionsAPI } from '../services/api';
import { toast } from 'react-toastify';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#1976d2',
    icon: 'payment',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await transactionsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color,
        icon: category.icon,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        color: '#1976d2',
        icon: 'payment',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await transactionsAPI.updateCategory(editingCategory.id, formData);
        toast.success('Категория обновлена');
      } else {
        await transactionsAPI.createCategory(formData);
        toast.success('Категория создана');
      }
      handleCloseDialog();
      loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить категорию?')) return;
    try {
      await transactionsAPI.deleteCategory(id);
      toast.success('Категория удалена');
      loadCategories();
    } catch (error) {
      toast.error('Ошибка удаления');
    }
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
            Категории
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Управление категориями платежей
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Создать категорию
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s',
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: category.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                      }}
                    >
                      {category.icon.charAt(0).toUpperCase()}
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(category)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description || 'Без описания'}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      p: 1,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: category.color,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {category.color}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Цвет"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Иконка"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                helperText="Название иконки"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
