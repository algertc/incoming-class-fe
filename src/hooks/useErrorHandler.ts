import { useCallback } from 'react';
import { showError } from '../utils';

interface ErrorHandlerOptions {
  showNotification?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showNotification = true,
      logError = true,
      fallbackMessage = 'An unexpected error occurred'
    } = options;

    // Extract error message
    let errorMessage = fallbackMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as any).message;
    }

    // Log error to console
    if (logError) {
      console.error('Error handled by useErrorHandler:', error);
    }

    // Show user notification
    if (showNotification) {
      showError(errorMessage);
    }

    // Here you could also send error to logging service
    // logErrorToService(error, errorMessage);

    return errorMessage;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
};

export default useErrorHandler;
