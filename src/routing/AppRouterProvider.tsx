import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/Home/Home";
import MainLayout from "../layouts/MainLayout";
import Colleges from "../pages/Colleges/Colleges";
import AuthLayout from "../layouts/AuthLayout";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import Feed from "../pages/Feed/Feed";
import { ROUTES } from './routes';
import ProfileCompletion from '../pages/ProfileCompletion/ProfileCompletion';

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
                element: <Home />
            },
            {
                path: "public/colleges",
                element: <Colleges />
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
                element: <Feed />
            },
            {
                path: "colleges",
                element: <Colleges />
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