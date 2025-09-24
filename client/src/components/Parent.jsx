import * as React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Box, Paper, Stack, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatIcon from '@mui/icons-material/Chat';
import { useChat } from './ChatContext';

// Массив карточек с информацией о возможностях психолога
const psychologistCards = [
  {
    image: '/parent_1.png',
    alt: 'Справиться с тревожностью',
    text: 'Справиться с тревожностью. Понять причины беспокойства и обрести гармонию с собой.',
  },
  {
    image: '/parent_2.png',
    alt: 'Осознать планы и цели жизни',
    text: 'Осознать планы и цели жизни. Найти свой карьерный путь и решить, в котором вы будете расти и развиваться.',
  },
  {
    image: '/parent_3.png',
    alt: 'Улучшить отношения с близкими',
    text: 'Улучшить отношения с близкими. Выстроить конструктивный диалог с семьёй, друзьями и партнёром.',
  },
  {
    image: '/parent_4.png',
    alt: 'Научиться выстраивать личные границы',
    text: 'Научиться выстраивать личные границы. Строить комфортную коммуникацию в любых ситуациях и решать личные проблемы. Найти силы для гармоничной жизни.',
  },
];

export default function Parent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isChatOpen, toggleChat } = useChat(); // Глобальное состояние чата из контекста

  // Стили для навигационных кнопок и кнопки чата
  const getButtonStyles = (isActive) => ({
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: '12px',
    color: isActive ? 'primary.contrastText' : 'primary.main',
    borderColor: isActive ? 'primary.main' : 'primary.main',
    backgroundColor: isActive ? 'primary.main' : 'transparent',
    '&:hover': {
      backgroundColor: (theme) =>
        isActive ? 'primary.dark' : alpha(theme.palette.primary.main, 0.2),
      color: isActive ? 'primary.contrastText' : 'primary.light',
      borderColor: isActive ? 'primary.dark' : 'primary.light',
    },
    px: 2,
    py: 1,
  });

  // Стили для карточек психолога
  const cardStyles = {
    p: { xs: 2, md: 3 },
    borderRadius: '12px',
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#ffffff',
    boxShadow: (theme) => theme.shadows[4],
    boxSizing: 'border-box',
    minWidth: { xs: 'auto', md: '200px' },
    maxWidth: { xs: '100%', md: 'none' },
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, mt: { xs: 4, md: 6 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: 'primary.main' }}>
        Личный кабинет родителя
      </Typography>

      {/* Навигационные кнопки для перехода между разделами */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 2 }} sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          color="info"
          startIcon={<ChildCareIcon />}
          sx={getButtonStyles(location.pathname.startsWith('/parent/children'))}
          onClick={() => navigate('children')}
          aria-label="Перейти к списку детей"
        >
          Дети
        </Button>
        <Button
          variant="outlined"
          color="info"
          startIcon={<CalendarMonthIcon />}
          sx={getButtonStyles(location.pathname === '/parent/consultations')}
          onClick={() => navigate('consultations')}
          aria-label="Перейти к расписанию консультаций"
        >
          Расписание консультаций
        </Button>
        <Button
          variant="outlined"
          color="info"
          startIcon={<ChatIcon />}
          sx={getButtonStyles(isChatOpen)}
          onClick={toggleChat}
          aria-label={isChatOpen ? 'Закрыть чат с психологами' : 'Открыть чат с психологами'}
        >
          {isChatOpen ? 'Закрыть чат' : 'Чат с психологами'}
        </Button>
      </Stack>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Box>

      {/* Секция: Чем может помочь психолог */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
        Чем может помочь психолог
      </Typography>
      {/* Первая строка карточек психолога */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
        {psychologistCards.slice(0, 3).map((card, index) => (
          <Paper key={index} elevation={0} sx={cardStyles}>
            <img
              src={card.image}
              alt={card.alt}
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', marginBottom: '16px' }}
              onError={(e) => (e.target.src = '/placeholder.png')} // Заглушка для отсутствующих изображений
            />
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {card.text}
            </Typography>
          </Paper>
        ))}
      </Stack>
      {/* Вторая строка карточек психолога */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
        {psychologistCards.slice(2).map((card, index) => (
          <Paper key={index} elevation={0} sx={cardStyles}>
            <img
              src={card.image}
              alt={card.alt}
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', marginBottom: '16px' }}
              onError={(e) => (e.target.src = '/placeholder.png')} // Заглушка для отсутствующих изображений
            />
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {card.text}
            </Typography>
          </Paper>
        ))}
      </Stack>

      {/* Чат с психологами */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
          Чат с психологами
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          Свяжитесь с нашими специалистами для получения консультации или поддержки.
        </Typography>
        <Button
          variant="outlined"
          color="info"
          startIcon={<ChatIcon />}
          sx={getButtonStyles(isChatOpen)}
          onClick={toggleChat}
          aria-label={isChatOpen ? 'Закрыть чат с психологами' : 'Открыть чат с психологами'}
        >
          {isChatOpen ? 'Закрыть чат' : 'Начать чат'}
        </Button>
      </Paper>

      {/* Контактная информация для экстренного обращения */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: '12px' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Телефон экстренного обращения:
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          +7 (800) 000-00-00
        </Typography>
      </Paper>
    </Container>
  );
}