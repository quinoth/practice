import * as React from 'react';

export const useChildrenData = () => {
  // Заглушка массива детей
  const children = React.useMemo(() => [
    { id: 1, name: 'Иванов Алексей', age: 10 },
    { id: 2, name: 'Иванова Мария', age: 8 },
  ], []);

  return children;
};