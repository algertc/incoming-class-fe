import { createBrowserRouter, RouterProvider } from "react-router";
import { ROUTES } from './routes';

// Import layouts and pages from the feature-based structure
import MainLayout from "../features/common/layouts/MainLayout";
import AuthLayout from "../features/common/layouts/AuthLayout";
import AuthenticatedLayout from "../features/common/layouts/AuthenticatedLayout";
import ProfileCompletion from "../features/profile/ProfileCompletion";
import HomePage from "../features/home/HomePage";
import CollegesPage from "../features/colleges/CollegesPage";
import FeedPage from "../features/feed/FeedPage";

// Placeholder components for authenticated routes
const Applications = () => <div>Applications</div>;
const Profile = () => <div>Profile</div>;
const Settings = () => <div>Settings</div>;

const router = createBrowserRouter([
    // Public routes
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "feed",
                element: <FeedPage />
            },
            {
                path: "public/colleges",
                element: <CollegesPage />
            },
        ]
    },
    // Auth routes (login, signup, etc.)
    {
        path: "/login",
        element: <AuthLayout formType={"login"}/>
    },
    {
        path: "/signup",
        element: <AuthLayout formType={"signup"} />
    },
    {
        path: "/forgot-password",
        element: <AuthLayout formType={"forgotPassword"} />
    },
    {
        path: "/forgot-password/reset",
        element: <AuthLayout formType={"forgotPassword"} />
    },
    // Profile completion route
    {
        path: ROUTES.PROFILE_COMPLETION,
        element: <ProfileCompletion />,
    },
    // Protected routes with authenticated layout
    {
        path: "/app",
        element: <AuthenticatedLayout />,
        children: [
            {
                index: true,
                element: <FeedPage />
            },
            {
                path: "feed",
                element: <FeedPage />
            },
            {
                path: "colleges",
                element: <CollegesPage />
            },
            {
                path: "applications",
                element: <Applications />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "settings",
                element: <Settings />
            },
        ]
    }
]);

const AppRouterProvider = () => {   
    return <RouterProvider router={router} />
}

export default AppRouterProvider;