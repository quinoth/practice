import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppNavBar from './components/AppNavBar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import SignUp from './components/SignUp.jsx';
import SignIn from './components/SignIn.jsx';
import AdminPage from './components/AdminPage.jsx';
import FileManager from './components/FileManager.jsx';
import AppTheme from './theme.jsx';
import Box from '@mui/material/Box';
import Parent from './components/Parent.jsx';
import ChildrenList from './components/ChildrenList.jsx';
import ChildDetails from './components/ChildDetails.jsx';
import ConsultationSchedule from './components/ConsultationSchedule.jsx';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ChatProvider } from './components/ChatContext'; // Импорт провайдера контекста чата
import ChatToggle from './components/ChatToggle';

// Компонент для страницы 404
const NotFound = () => (
  <Container sx={{ py: { xs: 4, md: 6 }, textAlign: 'center' }}>
    <Typography variant="h4" color="error.main" gutterBottom>
      404 - Страница не найдена
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      К сожалению, запрошенная страница не существует.
    </Typography>
    <Button variant="contained" color="primary" component={Link} to="/">
      На главную
    </Button>
  </Container>
);

// Основной компонент приложения
export default function App() {
  return (
    <AppTheme>
      <ChatProvider> {/* Оборачиваем приложение в ChatProvider для глобального состояния чата */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Навигационная панель */}
          <AppNavBar />
          {/* Основной контент с маршрутизацией */}
          <Box component="main" sx={{ flexGrow: 1, mt: { xs: 9, md: 11 } }}>
            <Suspense fallback={<CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />}>
              <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/file-manager" element={<FileManager />} />
                <Route path="/parent" element={<Parent />}>
                  <Route path="children" element={<ChildrenList />} />
                  <Route path="children/:id" element={<ChildDetails />} />
                  <Route path="consultations" element={<ConsultationSchedule />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Box>
          {/* Нижняя часть страницы */}
          <Footer />
          {/* Иконка и чат-виджет, отображаемые на всех страницах */}
          <ChatToggle />
        </Box>
      </ChatProvider>
    </AppTheme>
  );
}