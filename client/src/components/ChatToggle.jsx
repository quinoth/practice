import * as React from 'react';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatWidget from './ChatWidget';
import { useChat } from './ChatContext';

export default function ChatToggle() {
  const { isChatOpen, toggleChat } = useChat();

  return (
    <>
      {/* Иконка чата: отображается в правом нижнем углу, только если чат закрыт */}
      {!isChatOpen && (
        <Fab
          color="primary"
          aria-label="Открыть чат"
          onClick={toggleChat}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1400,
          }}
        >
          <ChatIcon />
        </Fab>
      )}
      {/* Чат-виджет: отображается при isChatOpen=true */}
      <ChatWidget isOpen={isChatOpen} onClose={toggleChat} />
    </>
  );
}