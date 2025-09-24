import * as React from 'react';

// Создание контекста для управления глобальным состоянием чат-виджета
const ChatContext = React.createContext({
  isChatOpen: false, // По умолчанию чат закрыт
  toggleChat: () => {}, // Пустая функция-заглушка для переключения состояния
});

// Провайдер контекста для предоставления состояния и функции переключения чата
export function ChatProvider({ children }) {
  // Состояние для отслеживания, открыт ли чат
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  // Функция для переключения состояния чата (открыт/закрыт)
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  // Предоставляет isChatOpen и toggleChat всем дочерним компонентам
  return (
    <ChatContext.Provider value={{ isChatOpen, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
}

// Хук для удобного доступа к контексту чата в других компонентах
export const useChat = () => React.useContext(ChatContext);