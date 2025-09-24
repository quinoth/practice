import * as React from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Определение цветовой палитры бренда
const brand = {
  50: 'hsl(210, 100%, 95%)',
  100: 'hsl(210, 100%, 92%)',
  200: 'hsl(210, 100%, 80%)',
  300: 'hsl(210, 100%, 65%)',
  400: 'hsl(210, 98%, 48%)',
  500: 'hsl(210, 98%, 42%)',
  600: 'hsl(210, 98%, 55%)',
  700: 'hsl(210, 100%, 35%)',
  800: 'hsl(210, 100%, 16%)',
  900: 'hsl(210, 100%, 21%)',
};

// Определение серой цветовой палитры
const gray = {
  50: 'hsl(220, 35%, 97%)',
  100: 'hsl(220, 30%, 94%)',
  200: 'hsl(220, 20%, 88%)',
  300: 'hsl(220, 20%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 20%, 35%)',
  700: 'hsl(220, 20%, 25%)',
  800: 'hsl(220, 30%, 6%)',
  900: 'hsl(220, 35%, 3%)',
};

// Определение типографики
const typography = {
  fontFamily: 'Inter, sans-serif',
  h1: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.2, letterSpacing: -0.5 },
  h6: { fontSize: '1.125rem', fontWeight: 600 },
  body2: { fontSize: '0.875rem', fontWeight: 400 },
};

// Определение формы элементов
const shape = { borderRadius: 8 };

// Определение теней
const defaultTheme = createTheme();
const shadows = [
  'none',
  'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
  ...defaultTheme.shadows.slice(2),
];

// Настройки для кнопок
const inputsCustomizations = {
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: 'none',
        borderRadius: theme.shape.borderRadius,
        textTransform: 'none',
      }),
    },
    variants: [
      { props: { size: 'small' }, style: { height: '2.25rem', padding: '8px 12px' } },
      {
        props: { color: 'primary', variant: 'contained' },
        style: {
          color: 'white',
          backgroundColor: brand[500],
          border: `1px solid ${brand[700]}`,
          '&:hover': { backgroundColor: brand[600], boxShadow: 'none' },
          '&:active': { backgroundColor: brand[700] },
        },
      },
      {
        props: { color: 'primary', variant: 'text' },
        style: {
          color: brand[700],
          '&:hover': { backgroundColor: alpha(brand[100], 0.5) },
          '&:active': { backgroundColor: alpha(brand[200], 0.7) },
        },
      },
      {
        props: { color: 'info', variant: 'text' },
        style: {
          color: gray[600],
          '&:hover': { backgroundColor: gray[100] },
          '&:active': { backgroundColor: gray[200] },
        },
      },
    ],
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${gray[200]}`,
        backgroundColor: alpha(gray[50], 0.3),
        '&:hover': { backgroundColor: gray[100], borderColor: gray[300] },
        '&:active': { backgroundColor: gray[200] },
      }),
    },
    variants: [
      { props: { size: 'small' }, style: { width: '2.25rem', height: '2.25rem', padding: '0.25rem' } },
    ],
  },
};

// Настройки для навигационных элементов
const navigationCustomizations = {
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        padding: '6px 8px',
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.background.default,
      }),
    },
  },
  MuiLink: {
    defaultProps: { underline: 'none' },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        fontWeight: 500,
        textDecoration: 'none',
        '&:hover': { color: brand[700] },
      }),
    },
  },
};

// Настройки для поверхностей
const surfacesCustomizations = {
  MuiPaper: {
    defaultProps: { elevation: 0 },
  },
};

// Компонент для применения кастомной темы
function AppTheme({ children, disableCustomTheme = false }) {
  const theme = createTheme({
    cssVariables: { cssVarPrefix: 'template' },
    palette: {
      primary: { main: brand[400], contrastText: brand[50] },
      info: { main: brand[300], contrastText: gray[50] },
      text: { primary: gray[800], secondary: gray[600] },
      background: { default: 'hsl(0, 0%, 99%)', paper: gray[50] },
      divider: alpha(gray[300], 0.4),
    },
    typography,
    shape,
    shadows,
    components: {
      ...inputsCustomizations,
      ...navigationCustomizations,
      ...surfacesCustomizations,
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

AppTheme.propTypes = {
  children: PropTypes.node,
  disableCustomTheme: PropTypes.bool,
};

export default AppTheme;