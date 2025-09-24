import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Paper,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import { styled } from '@mui/material/styles';

// Стили для зоны загрузки файлов
const DropZone = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isDragActive' && prop !== 'isInvalid',
})(({ theme, isDragActive, isInvalid }) => ({
  minHeight: '150px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: `2px dashed ${isInvalid ? theme.palette.error.main : isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: isDragActive ? `${theme.palette.primary.main}10` : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  transition: theme.transitions.create(['border-color', 'background-color']),
  '&:hover': {
    borderColor: isInvalid ? theme.palette.error.main : theme.palette.primary.main,
    backgroundColor: isInvalid ? `${theme.palette.error.main}10` : `${theme.palette.primary.main}10`,
  },
}));

const FileManager = React.memo(() => {
  // Состояние для списка файлов и ошибок
  const [files, setFiles] = React.useState([]);
  const [error, setError] = React.useState(null);

  // Допустимые форматы файлов и максимальный размер
  const accept = {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'image/jpeg': ['.jpeg'],
    'image/png': ['.png'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'application/vnd.oasis.opendocument.text': ['.odt'],
    'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
    'application/vnd.oasis.opendocument.presentation': ['.odp'],
  };
  const maxSize = 10 * 1024 * 1024; // 10 МБ

  // Обработчик загрузки файлов при перетаскивании
  const onDrop = React.useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles?.length > 0) {
      const firstRejection = rejectedFiles[0];
      if (firstRejection.errors.some(e => e.code === 'file-too-large')) {
        setError('Файл слишком большой (максимум 10 МБ)');
      } else {
        setError('Разрешены только файлы .docx, .xlsx, .jpeg, .png, .pptx, .odt, .ods, .odp');
      }
      return;
    }
    setError(null);
    const newFiles = acceptedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} МБ`,
      date: new Date().toLocaleDateString('ru-RU'),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Настройки для react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: true,
    noClick: true,
  });

  // Обработчик выбора файлов через input
  const handleFileInputChange = React.useCallback((e) => {
    const fileList = Array.from(e.target.files);
    const { acceptedFiles, rejectedFiles } = fileList.reduce(
      (acc, file) => {
        const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
        const fileType = file.type;
        const isValidType = Object.values(accept).flat().includes(fileExtension) || Object.keys(accept).includes(fileType);
        const isValidSize = file.size <= maxSize;

        if (isValidType && isValidSize) {
          acc.acceptedFiles.push(file);
        } else {
          acc.rejectedFiles.push({
            file,
            errors: [
              ...(isValidType ? [] : [{ code: 'file-invalid-type' }]),
              ...(isValidSize ? [] : [{ code: 'file-too-large' }]),
            ],
          });
        }
        return acc;
      },
      { acceptedFiles: [], rejectedFiles: [] }
    );
    onDrop(acceptedFiles, rejectedFiles);
  }, [accept, maxSize, onDrop]);

  // Обработчик удаления файла
  const handleDelete = React.useCallback((id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  // Мемоизация списка файлов
  const fileList = React.useMemo(() => (
    files.map((file, index) => (
      <React.Fragment key={file.id}>
        <ListItem
          secondaryAction={
            <IconButton edge="end" onClick={() => handleDelete(file.id)} aria-label="удалить">
              <DeleteIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
          }
          sx={{
            '&:hover': {
              backgroundColor: (theme) => `${theme.palette.primary.main}10`,
            },
          }}
        >
          <ListItemIcon>
            <InsertDriveFileIcon sx={{ color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText
            primary={file.name}
            secondary={`${file.size} • ${file.date}`}
            primaryTypographyProps={{ fontWeight: 500 }}
            secondaryTypographyProps={{ color: 'text.secondary' }}
          />
        </ListItem>
        {index < files.length - 1 && <Divider />}
      </React.Fragment>
    ))
  ), [files, handleDelete]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, mt: { xs: 4, md: 6 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: 'primary.main' }}>
        Файловый менеджер
      </Typography>
      {/* Зона загрузки файлов */}
      <DropZone isDragActive={isDragActive} isInvalid={!!error} {...getRootProps()}>
        <input {...getInputProps()} />
        <UploadIcon sx={{ fontSize: 40, color: error ? 'error.main' : 'primary.main', mb: 1 }} />
        <Typography variant="body1" color={error ? 'error.main' : 'text.secondary'}>
          {error || 'Перетащите файлы (.docx, .xlsx, .jpeg, .png, .pptx, .odt, .ods, .odp) сюда или'}
        </Typography>
        {!error && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadIcon />}
            sx={{ mt: 2 }}
            component="label"
          >
            Выберите файлы
            <input
              type="file"
              hidden
              multiple
              accept={Object.values(accept).flat().join(',')}
              onChange={handleFileInputChange}
            />
          </Button>
        )}
      </DropZone>
      {/* Отображение ошибок загрузки */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {/* Список загруженных файлов */}
      <Paper elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <List>
          {fileList}
        </List>
      </Paper>
    </Container>
  );
});

export default FileManager;