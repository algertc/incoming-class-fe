# Migration Guide

This document outlines the process of migrating the Incoming Class Frontend application from a traditional page-based structure to a more modular, feature-based architecture.

## Completed Tasks

1. **Folder Structure Reorganization**
   - Created a feature-based directory structure in `src/features/`
   - Organized components by feature domain
   - Created shared components and layouts in `features/common/`

2. **Authentication Flow Improvements**
   - Implemented HOCs for authentication guards:
     - `withAuth`: Protects authenticated routes
     - `withAuthRedirect`: Prevents authenticated users from accessing public pages
     - `withProfileStageGuard`: Ensures profile completion for users with incomplete profiles

3. **Feature Migration**
   - **Home Feature**: Migrated homepage to `features/home/`
   - **Auth Feature**: 
     - Migrated login functionality to `features/auth/login/`
     - Migrated signup functionality to `features/auth/signup/`
     - Migrated forgot password functionality to `features/auth/forgot-password/`
   - **Profile Feature**: Migrated profile completion to `features/profile/`
   - **Colleges Feature**: Migrated colleges listing to `features/colleges/`
   - **Feed Feature**: Migrated feed page to `features/feed/`
   - **Common Components**:
     - Migrated layout components to `features/common/layouts/`
     - Added loading screen component

4. **State Persistence**
   - Implemented localStorage for signup form data persistence
   - Added countdown timer for OTP verification
   - Created cleanup mechanisms for local storage

5. **Tooling**
   - Created a component migration helper script (`scripts/migrate-component.js`)

## Remaining Tasks

1. **Complete Feature Migration**
   - Add specific college details pages
   - Profile management components
   - Settings pages

2. **Remove Legacy Code**
   - After migrating all components, remove the old files
   - Update imports across the codebase to use the new component paths

3. **Testing and Verification**
   - Test all authentication flows
   - Verify redirects work correctly
   - Ensure localStorage persistence works across page reloads

4. **Documentation**
   - Update component documentation
   - Add JSDoc comments to components and functions

## Migration Process

To migrate a component from the legacy structure to the feature-based structure:

1. **Create Feature Directory**
   ```bash
   mkdir -p src/features/<feature-domain>/<feature-name>/components
   ```

2. **Use Migration Script**
   ```bash
   node scripts/migrate-component.js <source-path> <target-path>
   ```

3. **Update CSS Module Imports**
   - Update any CSS module imports to use the new path
   - Ensure class names are consistently applied

4. **Update Router References**
   - Update the router to use the new component paths
   - Apply HOCs as needed for authentication and routing guards

5. **Remove Original Files**
   - Once migration is complete and tested, remove the original files

## Best Practices

1. **Feature Organization**
   - Group related components within a feature directory
   - Keep components focused on a single responsibility
   - Use index files for clean exports

2. **CSS Modules**
   - Use component-specific CSS modules
   - Name CSS files to match their components
   - Avoid global styles where possible

3. **Authentication**
   - Apply appropriate HOCs to protect routes
   - Use consistent redirect patterns
   - Handle loading states properly

4. **State Management**
   - Use localStorage for data that needs to persist across reloads
   - Clean up localStorage when no longer needed
   - Apply Zustand stores for shared state management 

## Recent Migration Progress (Latest Update)

In the latest migration effort, the following features were successfully migrated:

1. **Forgot Password Feature**
   - Created `src/features/auth/forgot-password/` structure
   - Migrated components:
     - `ForgotPasswordPage.tsx`: Main entry point
     - `ForgotPasswordRequest.tsx`: OTP request form
     - `ForgotPasswordReset.tsx`: Password reset form 
   - Added CSS module for consistent styling
   - Updated import paths in components
   - Updated `AuthLayout` to use the new component

2. **Colleges Feature**
   - Created `src/features/colleges/` structure
   - Implemented improved `CollegesPage.tsx` with:
     - Responsive grid layout
     - Card-based UI for colleges
     - Support for filtering and tags
   - Updated router to use the new component

3. **Feed Feature**
   - Created `src/features/feed/` structure
   - Migrated `FeedPage.tsx` with:
     - Support for authenticated and unauthenticated views
     - Responsive layouts for different screen sizes
     - Integration with existing feed components
   - Updated router to use the new component

These migrations bring the application closer to a complete feature-based architecture, improving maintainability and organization. The next focus will be on migrating the Profile management and Settings features, followed by removing legacy code.