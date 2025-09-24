import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

// Стили для панели навигации
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  padding: '4px 12px',
  minHeight: 56,
}));

export default function AppNavBar() {
  // Состояние для мобильного меню
  const [open, setOpen] = React.useState(false);

  // Обработчик переключения состояния мобильного меню
  const toggleDrawer = React.useCallback((newOpen) => () => {
    setOpen(newOpen);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          {/* Навигация для десктопа */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Link component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
              <Typography variant="h6" sx={{ fontWeight: 500, color: 'primary.main', px: 2 }}>
                ЦПРК
              </Typography>
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="large" onClick={() => alert('СПТ в разработке')}>
                СПТ
              </Button>
              <Button variant="text" color="info" size="large" onClick={() => alert('FAQ в разработке')}>
                FAQ
              </Button>
              <Button
                variant="text"
                color="info"
                size="large"
                component={RouterLink}
                to="/file-manager"
              >
                Файлы
              </Button>
              <Button
                variant="text"
                color="info"
                size="large"
                component={RouterLink}
                to="/admin"
              >
                Админ
              </Button>
              <Button
                variant="text"
                color="info"
                size="large"
                component={RouterLink}
                to="/parent"
              >
                Родитель
              </Button>
            </Box>
          </Box>
          {/* Кнопки входа и регистрации для десктопа */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            <Button
              color="primary"
              variant="text"
              size="large"
              component={RouterLink}
              to="/signin"
            >
              Войти
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="large"
              component={RouterLink}
              to="/signup"
            >
              Зарегистрироваться
            </Button>
          </Box>
          {/* Мобильное меню */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <IconButton aria-label="Открыть меню" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={toggleDrawer(false)} aria-label="Закрыть меню">
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem onClick={toggleDrawer(false)}>
                  <Button variant="text" color="info" fullWidth onClick={() => alert('СПТ в разработке')}>
                    СПТ
                  </Button>
                </MenuItem>
                <MenuItem onClick={toggleDrawer(false)}>
                  <Button variant="text" color="info" fullWidth onClick={() => alert('FAQ в разработке')}>
                    FAQ
                  </Button>
                </MenuItem>
                <MenuItem onClick={toggleDrawer(false)}>
                  <Button
                    variant="text"
                    color="info"
                    fullWidth
                    component={RouterLink}
                    to="/file-manager"
                  >
                    Файлы
                  </Button>
                </MenuItem>
                <MenuItem onClick={toggleDrawer(false)}>
                  <Button
                    variant="text"
                    color="info"
                    fullWidth
                    component={RouterLink}
                    to="/admin"
                  >
                    Админ
                  </Button>
                </MenuItem>
                <MenuItem onClick={toggleDrawer(false)}>
                  <Button
                    variant="text"
                    color="info"
                    fullWidth
                    component={RouterLink}
                    to="/parent"
                  >
                    Родитель
                  </Button>
                </MenuItem>
                <Divider sx={{ my: 2 }} />
                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    component={RouterLink}
                    to="/signup"
                    onClick={toggleDrawer(false)}
                  >
                    Зарегистрироваться
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="text"
                    fullWidth
                    component={RouterLink}
                    to="/signin"
                    onClick={toggleDrawer(false)}
                  >
                    Войти
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}