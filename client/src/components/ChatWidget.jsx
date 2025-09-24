import * as React from 'react';
import { Box, Typography, TextField, Button, IconButton, Paper, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function ChatWidget({ onClose, isOpen }) {
  // Состояние для хранения сообщений чата, инициализировано приветственным сообщением
  const [messages, setMessages] = React.useState([
    { id: 1, text: 'Здравствуйте! Чем могу помочь?', sender: 'Психолог', timestamp: new Date() },
  ]);
  // Состояние для управления полем ввода
  const [input, setInput] = React.useState('');
  // Ref для автопрокрутки к последнему сообщению
  const messagesEndRef = React.useRef(null);

  // Эффект для прокрутки к последнему сообщению при изменении сообщений
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Обработчик отправки сообщения
  const handleSend = () => {
    if (input.trim()) {
      // Добавление сообщения пользователя в состояние
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: input, sender: 'Вы', timestamp: new Date() },
      ]);
      // Очистка поля ввода
      setInput('');
      // Симуляция ответа психолога с задержкой
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: 'Спасибо за ваш вопрос! Скоро ответим.', sender: 'Психолог', timestamp: new Date() },
        ]);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    // Анимация появления/исчезновения чата
    <Fade in={isOpen} timeout={300}>
      {/* Контейнер чата, фиксированный в правом нижнем углу с адаптивными размерами */}
      <Paper
        elevation={3}
        sx={{
          position: { xs: 'fixed', md: 'fixed' },
          bottom: { xs: 0, md: 16 },
          right: { xs: 0, md: 16 },
          width: { xs: '100%', md: 400 },
          height: { xs: '100%', md: 500 },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: '16px', md: '16px' },
          zIndex: 1500,
          overflow: 'hidden',
        }}
        role="dialog"
        aria-label="Чат с психологами"
      >
        {/* Заголовок чата с названием и кнопкой закрытия */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Чат с психологами</Typography>
          <IconButton
            onClick={onClose}
            aria-label="Закрыть чат"
            sx={{
              color: 'white',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.85)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Область отображения сообщений с автопрокруткой */}
        <Box
          sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}
          aria-live="polite"
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                mb: 2,
                textAlign: msg.sender === 'Вы' ? 'right' : 'left',
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                {msg.sender} ({new Date(msg.timestamp).toLocaleTimeString()})
              </Typography>
              <Paper
                sx={{
                  p: 1,
                  display: 'inline-block',
                  bgcolor: msg.sender === 'Вы' ? 'primary.light' : 'grey.200',
                  maxWidth: '80%',
                  borderRadius: '8px',
                }}
              >
                <Typography>{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
          {/* Точка для прокрутки к последнему сообщению */}
          <div ref={messagesEndRef} />
        </Box>
        {/* Поле ввода и кнопка отправки */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
            bgcolor: 'background.paper',
          }}
        >
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите сообщение..."
            fullWidth
            size="small"
            aria-label="Поле для ввода сообщения"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            aria-label="Отправить сообщение"
            disabled={!input.trim()}
          >
            Отправить
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
}