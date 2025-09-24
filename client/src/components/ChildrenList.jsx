import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, ListItemIcon, Paper, Divider } from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { useChildrenData } from '../useChildrenData.js';

function ChildrenList() {
  const navigate = useNavigate();
  const children = useChildrenData();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
        Список детей
      </Typography>
      <Paper elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        {/* Список детей */}
        <List aria-label="Список детей для просмотра данных">
          {children.map((child, index) => (
            <React.Fragment key={child.id}>
              {/* Элемент списка с навигацией на страницу ребенка */}
              <ListItem
                onClick={() => navigate(`/parent/children/${child.id}`)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: (theme) => `${theme.palette.primary.main}10`,
                  },
                }}
                aria-label={`Перейти к данным ребенка ${child.name}`}
              >
                <ListItemIcon>
                  <ChildCareIcon sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText
                  primary={child.name}
                  secondary={`Возраст: ${child.age}`}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              {index < children.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default React.memo(ChildrenList);