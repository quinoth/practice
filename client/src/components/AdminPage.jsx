import * as React from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function AdminPage() {
  // Состояние для списка пользователей
  const [users, setUsers] = React.useState([
    { id: 1, name: 'Иванов Иван', email: 'ivanov@example.com', role: 'Обучающийся' },
    { id: 2, name: 'Петров Петр', email: 'petrov@example.com', role: 'Родитель' },
    { id: 3, name: 'Сидорова Анна', email: 'sidorova@example.com', role: 'Психолог' },
  ]);

  // Состояние для строки поиска
  const [searchQuery, setSearchQuery] = React.useState('');

  // Фильтрация пользователей по имени или email
  const filteredUsers = React.useMemo(() =>
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [users, searchQuery]
  );

  // Обработчик изменения роли пользователя
  const handleRoleChange = React.useCallback((userId, newRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: 'primary.main' }}>
        Панель администратора
      </Typography>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
          Управление пользователями
        </Typography>
        {/* Поле поиска пользователей */}
        <TextField
          fullWidth
          label="Поиск по имени или email"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
        />
        {/* Список пользователей */}
        <Paper elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
			<List>
			  {filteredUsers.map((user, index) => (
				<React.Fragment key={user.id}>
				  <ListItem
					sx={{
					  flexDirection: { xs: 'column', md: 'row' },
					  alignItems: { xs: 'flex-start', md: 'center' },
					  py: { xs: 1.5, md: 2 },
					  '&:hover': {
						backgroundColor: (theme) => `${theme.palette.primary.main}10`,
					  },
					}}
					secondaryAction={
					  <FormControl sx={{ minWidth: { xs: '100%', md: 150 }, mt: { xs: 1, md: 0 } }}>
						<InputLabel>Роль</InputLabel>
						<Select
						  value={user.role}
						  onChange={(e) => handleRoleChange(user.id, e.target.value)}
						  label="Роль"
						  size="small"
						  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
						>
						  <MenuItem value="Психолог">Психолог</MenuItem>
						  <MenuItem value="Родитель">Родитель</MenuItem>
						  <MenuItem value="Обучающийся">Обучающийся</MenuItem>
						</Select>
					  </FormControl>
					}
				  >
					<ListItemIcon sx={{ minWidth: { xs: 30, md: 40 } }}>
					  <PersonIcon sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, color: 'primary.main' }} />
					</ListItemIcon>
					<ListItemText
					  primary={user.name}
					  secondary={user.email}
					  primaryTypographyProps={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 500 }}
					  secondaryTypographyProps={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, color: 'text.secondary' }}
					/>
				  </ListItem>
				  {index < filteredUsers.length - 1 && <Divider />}
				</React.Fragment>
			  ))}
			</List>
        </Paper>
      </Box>
    </Container>
  );
}