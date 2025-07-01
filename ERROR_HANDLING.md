# Error Handling Documentation

This document outlines the error handling functionality implemented in the application.

## Components

### 1. ErrorBoundary Component
**Location:** `src/components/common/ErrorBoundary.tsx`

A React Error Boundary that catches JavaScript errors anywhere in the component tree and displays a fallback UI.

**Features:**
- Catches unhandled JavaScript errors
- Displays user-friendly error message
- Shows technical details in expandable section
- Provides reload and navigation options
- Logs errors to console for debugging

**Usage:**
```tsx
import ErrorBoundary from '../components/common/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 2. NotFoundPage Component
**Location:** `src/features/common/components/NotFoundPage.tsx`

A 404 page displayed when users navigate to non-existent routes.

**Features:**
- Modern, responsive design matching app theme
- Helpful suggestions for users
- Navigation buttons (Home, Back)
- Glass morphism styling

**Usage:**
Automatically triggered by React Router for unmatched routes.

### 3. useErrorHandler Hook
**Location:** `src/hooks/useErrorHandler.ts`

A custom hook for consistent error handling throughout the application.

**Features:**
- Handles synchronous and asynchronous errors
- Shows user notifications
- Logs errors for debugging
- Configurable options

**Usage:**
```tsx
import { useErrorHandler } from '../hooks/useErrorHandler';

const MyComponent = () => {
  const { handleError, handleAsyncError } = useErrorHandler();

  const handleAction = async () => {
    await handleAsyncError(async () => {
      // Your async operation
      await someApiCall();
    });
  };

  const handleSyncAction = () => {
    try {
      // Risky operation
    } catch (error) {
      handleError(error);
    }
  };
};
```

## Routes

### Error Test Page (Development)
**URL:** `/error-test`
**Location:** `src/features/common/components/ErrorTestPage.tsx`

A development page for testing different types of errors.

**Available Tests:**
- JavaScript Error (triggers ErrorBoundary)
- TypeError (triggers ErrorBoundary)
- Handled Error (shows notification)
- Async Error (graceful handling)
- Network Error (simulated)

## HTTP Client Error Handling
**Location:** `src/hooks/api/http.client.ts`

Enhanced error handling in the HTTP client with specific handling for:
- Network errors (connection issues)
- Server errors (5xx status codes)
- Client errors (4xx status codes)
- Authentication errors (401)

## Testing Error Handling

### 1. Test 404 Page
Navigate to any non-existent URL: `/this-does-not-exist`

### 2. Test ErrorBoundary
Visit: `/error-test` and click "Trigger JavaScript Error"

### 3. Test API Error Handling
Use the error test page to trigger network errors

### 4. Test Manual Error Handling
```tsx
import { useErrorHandler } from '../hooks/useErrorHandler';

const { handleError } = useErrorHandler();
handleError(new Error('Test error'));
```

## Error Logging

Currently, errors are logged to the browser console. In a production environment, you would typically integrate with error monitoring services like:
- Sentry
- LogRocket
- Bugsnag
- DataDog

To add error reporting, modify the `componentDidCatch` method in `ErrorBoundary.tsx` and the `handleError` function in `useErrorHandler.ts`.

## Best Practices

1. **Use ErrorBoundary** at layout level for catching unexpected errors
2. **Use useErrorHandler** for predictable error scenarios
3. **Provide meaningful error messages** to users
4. **Log detailed error information** for debugging
5. **Test error scenarios** regularly during development
6. **Monitor errors** in production environments

## Configuration

The error handling system is automatically configured when you wrap your app with `ErrorBoundary` in `App.tsx`. No additional setup is required.

## Browser Support

Error Boundaries work in React 16+ and are supported in all modern browsers. The fallback UI uses modern CSS features but gracefully degrades in older browsers.
