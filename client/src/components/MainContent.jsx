import { Container, Typography, Button, Stack, Fade } from '@mui/material';

export default function MainContent() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, mt: { xs: 4, md: 6 } }}>
      <Fade in timeout={1000}>
        <Stack
          direction="column"
          alignItems="center"
          textAlign="center"
          spacing={3}
          className="card"
          sx={{
            p: { xs: 4, sm: 6 },
            bgcolor: (theme) =>
              `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.main}10 100%)`,
            borderRadius: (theme) => theme.shape.borderRadius,
            mb: 4,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            Центр профилактики, реабилитации и коррекции
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '600px' }}
          >
            Мы предоставляем профессиональные услуги для вашего здоровья и благополучия. 
            Наши специалисты помогут вам достичь гармонии и улучшить качество жизни.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" size="large">
              Записаться
            </Button>
            <Button variant="text" color="primary" size="large">
              Узнать больше
            </Button>
          </Stack>
        </Stack>
      </Fade>
    </Container>
  );
}