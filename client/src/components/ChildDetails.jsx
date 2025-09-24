import * as React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container, Typography, Paper, Divider, List, ListItem, ListItemText, Alert } from '@mui/material';
import { useChildrenData } from '../useChildrenData.js';

export default function ChildDetails() {
  const { id } = useParams();
  const children = useChildrenData();
  const child = children.find((c) => c.id === parseInt(id));

  // Если ребенок не найден, показываем сообщение и перенаправляем
  if (!child) {
    return (
      <>
        <Alert severity="error" sx={{ m: 2 }}>
          Ребенок с ID {id} не найден.
        </Alert>
        <Navigate to="/parent/children" replace />
      </>
    );
  }

  // Заглушка для данных ребенка
  const childData = {
    id,
    name: child.name,
    tests: [
      { id: 1, title: 'Тест на тревожность', date: '2025-10-01', result: 'Средний уровень' },
      { id: 2, title: 'Тест на концентрацию', date: '2025-10-05', result: 'Высокий уровень' },
    ],
    recommendations: [
      { id: 1, text: 'Рекомендуется больше времени проводить на свежем воздухе.', author: 'Петров А.В.', date: '2025-10-02' },
      { id: 2, text: 'Практиковать упражнения на концентрацию внимания.', author: 'Сидорова Е.Н.', date: '2025-10-06' },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
        Результаты и рекомендации для {childData.name}
      </Typography>
      {/* Список тестов */}
      <Paper elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden', mb: 4 }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: 600, color: 'primary.main' }}>
          Результаты тестов
        </Typography>
        <List aria-label="Список результатов тестов">
          {childData.tests.map((test, index) => (
            <React.Fragment key={test.id}>
              <ListItem>
                <ListItemText
                  primary={test.title}
                  secondary={`Дата: ${test.date} • Результат: ${test.result}`}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              {index < childData.tests.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
      {/* Список рекомендаций */}
      <Paper elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: 600, color: 'primary.main' }}>
          Рекомендации психологов
        </Typography>
        <List aria-label="Список рекомендаций психологов">
          {childData.recommendations.map((rec, index) => (
            <React.Fragment key={rec.id}>
              <ListItem>
                <ListItemText
                  primary={rec.text}
                  secondary={`Автор: ${rec.author} • Дата: ${rec.date}`}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              {index < childData.recommendations.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
}