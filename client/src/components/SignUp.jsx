import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../theme.jsx';
import { GosuslugiIcon } from './CustomIcons';

// Стили для карточки формы регистрации
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

// Стили для контейнера формы
const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp({ disableCustomTheme }) {
  // Состояния для управления ошибками и чекбоксом
  const [formErrors, setFormErrors] = React.useState({
    email: { error: false, message: '' },
    password: { error: false, message: '' },
    name: { error: false, message: '' },
  });
  const [isConsentChecked, setIsConsentChecked] = React.useState(false);

  // Валидация полей формы
  const validateInputs = React.useCallback(() => {
    const email = document.getElementById('email')?.value || '';
    const password = document.getElementById('password')?.value || '';
    const name = document.getElementById('name')?.value || '';

    const newErrors = {
      email: { error: false, message: '' },
      password: { error: false, message: '' },
      name: { error: false, message: '' },
    };
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = { error: true, message: 'Пожалуйста, введите действительную электронную почту.' };
      isValid = false;
    }
    if (!password || password.length < 6) {
      newErrors.password = { error: true, message: 'Пароль должен содержать минимум 6 символов.' };
      isValid = false;
    }
    if (!name) {
      newErrors.name = { error: true, message: 'ФИО обязательно.' };
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  }, []);

  // Обработчик отправки формы
  const handleSubmit = React.useCallback(async (event) => {
    event.preventDefault();

    if (!validateInputs() || !isConsentChecked) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const formData = {
      email: data.get('email'),
      password: data.get('password'),
      name: data.get('name'),
    };

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(`Ошибка регистрации: ${errData.detail || 'Неверные данные'}`);
        return;
      }

      const result = await response.json();
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('user_role', result.role);

      // Перенаправление по ролям
      switch (result.role) {
        case 'superuser':
        case 'admin':
          window.location.href = '/admin';
          break;
        case 'psychologist':
          window.location.href = '/psychologist/dashboard';
          break;
        case 'parent':
          window.location.href = '/parent';
          break;
        default:
          window.location.href = '/client';
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Не удалось подключиться к серверу. Проверьте интернет.');
    }
  }, [validateInputs, isConsentChecked]);

  // Обработчик изменения состояния чекбокса
  const handleCheckboxChange = React.useCallback((event) => {
    setIsConsentChecked(event.target.checked);
  }, []);

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Регистрация
          </Typography>
          {/* Форма регистрации */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
		    {/* Поля ввода с formcontrol для проверки ввода*/}
            <FormControl>
              <FormLabel htmlFor="name">ФИО</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Иванов Иван Иванович"
                error={formErrors.name.error}
                helperText={formErrors.name.message}
                color={formErrors.name.error ? 'error' : 'primary'}
                aria-describedby={formErrors.name.error ? 'name-error' : undefined}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Почта</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={formErrors.email.error}
                helperText={formErrors.email.message}
                color={formErrors.email.error ? 'error' : 'primary'}
                aria-describedby={formErrors.email.error ? 'email-error' : undefined}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Пароль</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={formErrors.password.error}
                helperText={formErrors.password.message}
                color={formErrors.password.error ? 'error' : 'primary'}
                aria-describedby={formErrors.password.error ? 'password-error' : undefined}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  value="allowExtraEmails"
                  color="primary"
                  checked={isConsentChecked}
                  onChange={handleCheckboxChange}
                />
              }
              label={
                <Typography variant="body2">
                  Я согласен на{' '}
                  <Link href="#" variant="body2" sx={{ color: '#005c99 !important', '&:hover': { color: '#005c99 !important' } }}>
                    обработку персональных данных
                  </Link>
                </Typography>
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isConsentChecked}
            >
              Зарегистрироваться
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>или</Typography>
          </Divider>
          {/* Альтернативные методы регистрации */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Вход через госуслуги')}
              startIcon={<GosuslugiIcon />}
            >
              Зарегистрироваться через Госуслуги
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Уже зарегистрированы?{' '}
              <Link href="/signin" variant="body2">
                Войти
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}