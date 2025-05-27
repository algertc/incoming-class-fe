# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Incoming Class Frontend

A modern web application for college discovery and application management.

## Folder Structure

The codebase follows a feature-based modular architecture, organized as follows:

```
src/
├── features/               # Feature-based modules
│   ├── auth/               # Authentication-related features
│   │   ├── components/     # Auth-specific components (withAuthRedirect)
│   │   ├── login/          # Login feature components
│   │   │   └── components/ # Login form components
│   │   ├── signup/         # Signup feature components
│   │   │   └── components/ # Signup form components
│   │   └── forgot-password/# Forgot password feature components
│   │       └── components/ # Forgot password form components
│   ├── profile/            # Profile completion features
│   ├── home/               # Home page features
│   ├── colleges/           # Colleges listing features
│   ├── feed/               # Feed page features
│   └── common/             # Shared features
│       ├── layouts/        # Layout components
│       └── components/     # Shared UI components (LoadingScreen)
├── pages/                  # Legacy page components (being migrated)
├── components/             # Legacy shared components
├── hooks/                  # API and utility hooks
├── models/                 # Data models and types
├── services/               # API services
├── store/                  # State management
├── routing/                # Routing configuration
├── utils/                  # Utility functions
└── constants/              # Application constants
```

## Migration Status

The application is currently being migrated from a traditional page-based structure to a more modular, feature-based architecture. The following features have been migrated:

- ✅ Home page
- ✅ Login feature
- ✅ Signup feature
- ✅ Forgot password feature
- ✅ Profile completion
- ✅ Colleges feature
- ✅ Feed feature
- ✅ Layout components
- ⏳ Profile management (in progress)
- ⏳ Settings feature (in progress)

## Authentication Flow

The application implements a sophisticated authentication flow with several guards and redirects:

### Public Routes
- If a user is authenticated and has a complete profile, they are redirected to the dashboard
- If a user is authenticated but has an incomplete profile, they are redirected to profile completion

### Auth Routes (Login, Signup, Forgot Password)
- If a user is authenticated and has a complete profile, they are redirected to the dashboard
- If a user is authenticated but has an incomplete profile, they are redirected to profile completion

### Profile Completion Route
- If a user is not authenticated, they are redirected to login
- If a user is authenticated but has a complete profile, they are redirected to dashboard
- Only users with incomplete profiles can access this route

### Protected Routes
- If a user is not authenticated, they are redirected to login

## Higher-Order Components (HOCs)

Several HOCs are used to implement the authentication flow:

### `withAuth`
Ensures that only authenticated users can access protected routes.

### `withAuthRedirect`
Prevents authenticated users from accessing public and auth routes, redirecting them to appropriate pages based on their profile completion status.

### `withProfileStageGuard`
Guards the profile completion page, ensuring only users with incomplete profiles can access it.

## State Persistence

The application uses localStorage to persist state across page reloads, including:

- Form data in the signup process
- OTP verification state
- Countdown timers

## Styling

The application uses Mantine UI components with custom styling through CSS modules. Each component has its own module CSS file for better maintainability.
