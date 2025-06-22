import { notifications, showNotification } from '@mantine/notifications';
import { IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';

/**
 * Show a success notification
 */
export const showSuccess = (message: string, title = 'Success') => {
  notifications.show({
    title,
    message,
    color: 'green',
    icon: <IconCheck size={20} />,
    autoClose: 3000,
  });
};

/**
 * Show an error notification
 */
export const showError = (message: string, title = 'Error') => {
  notifications.show({
    title,
    message,
    color: 'red',
    icon: <IconX size={20} />,
    autoClose: 5000,
  });
};

/**
 * Show an info notification
 */
export const showInfo = (message: string, title = 'Information') => {
  showNotification({
    title,
    message,
    color: 'blue',
    icon: <IconInfoCircle size={20} />,
    autoClose: 4000,
  });
}; 