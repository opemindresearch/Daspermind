import { useCallback, useEffect, useState } from 'react';
export function useToast() {
  const [notification, setNotification] = useState({ message: '', id: 0 });
  const [visible, setVisible] = useState(false);
  const notify = useCallback((message: string) => {
    setNotification((previous) => ({ message, id: previous.id + 1 }));
    setVisible(true);
  }, []);
  useEffect(() => {
    if (!notification.id) return;
    const timeout = setTimeout(() => setVisible(false), 2300);
    return () => clearTimeout(timeout);
  }, [notification]);
  return { message: notification.message, visible, notify };
}
