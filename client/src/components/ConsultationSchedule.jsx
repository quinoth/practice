import * as React from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useChildrenData } from '../useChildrenData.js';

export default function ConsultationSchedule() {
  const [formData, setFormData] = React.useState({
    childId: '',
    date: '',
    time: '',
  });
  // Список запланированных консультаций (заглушка)
  const [consultations, setConsultations] = React.useState([
    { id: 1, childId: 1, date: '2025-10-15', time: '14:00' },
    { id: 2, childId: 2, date: '2025-10-16', time: '16:00' },
  ]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Получение списка детей
  const children = useChildrenData();

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Валидация формы
  const validateForm = () => {
    if (!formData.childId || !formData.date || !formData.time) {
      return 'Заполните все поля.';
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.date)) {
      return 'Неверный формат даты (гггг-мм-дд).';
    }
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return 'Дата консультации должна быть в будущем.';
    }
    const [hours, minutes] = formData.time.split(':').map(Number);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return 'Неверный формат времени (чч:мм).';
    }
    return null;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      // Заглушка для api 
      // const response = await fetch('http://localhost:8000/consultations', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Ошибка записи на консультацию');
      // const result = await response.json();

      // Создаем новую консультацию с childId
      const newConsultation = {
        id: Date.now(),
        childId: parseInt(formData.childId),
        date: formData.date,
        time: formData.time,
      };
      setConsultations((prev) => [...prev, newConsultation]);
      setFormData({ childId: '', date: '', time: '' });
      setError(null);
    } catch (err) {
      setError(err.message || 'Не удалось записаться на консультацию.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Заголовок страницы */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
        Расписание консультаций
      </Typography>

      {/* Форма для записи на консультацию */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
          Записаться на консультацию
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          aria-describedby={error ? 'form-error' : undefined}
        >
          <FormControl fullWidth>
            <InputLabel id="child-select-label">Ребенок</InputLabel>
            <Select
              labelId="child-select-label"
              name="childId"
              value={formData.childId}
              onChange={handleChange}
              label="Ребенок"
              aria-label="Выберите ребенка"
            >
              {children.map((child) => (
                <MenuItem key={child.id} value={child.id}>
                  {child.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="date"
            label="Дата"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            aria-label="Выберите дату консультации"
          />
          <TextField
            name="time"
            label="Время"
            type="time"
            value={formData.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            aria-label="Выберите время консультации"
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Записаться'}
          </Button>
          {error && (
            <Alert severity="error" onClose={() => setError(null)} id="form-error">
              {error}
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Таблица запланированных консультаций */}
      <Paper elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: 600, color: 'primary.main' }}>
          Запланированные консультации
        </Typography>
        <TableContainer>
          <Table aria-label="Таблица запланированных консультаций">
            <TableHead>
              <TableRow>
                <TableCell scope="col">Ребенок</TableCell>
                <TableCell scope="col">Дата</TableCell>
                <TableCell scope="col">Время</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell>
                    {children.find((c) => c.id === consultation.childId)?.name || 'Неизвестный ребенок'}
                  </TableCell>
                  <TableCell>{consultation.date}</TableCell>
                  <TableCell>{consultation.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}