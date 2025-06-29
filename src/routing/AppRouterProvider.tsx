// import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ROUTES } from './routes';

// Import layouts and pages from the feature-based structure
import MainLayout from "../features/common/layouts/MainLayout";
import AuthLayout from "../features/common/layouts/AuthLayout";
import AuthenticatedLayout from "../features/common/layouts/AuthenticatedLayout";
import ProfileCompletion from "../features/profile/ProfileCompletion";
import HomePage from "../features/home/HomePage";
import AboutPage from "../features/about/AboutPage";
import ContactPage from "../features/contact/ContactPage";
import PrivacyPage from "../features/privacy/PrivacyPage";
import CollegesPage from "../features/colleges/CollegesPage";
import FeedPage from "../features/feed/FeedPage";
import SubscriptionPage from "../features/subscription/SubscriptionPage";
import { StudentProfilePage, CurrentUserProfilePage } from "../features/profile";
import { PaymentSuccessPage, PaymentErrorPage, PremiumSuccessPage } from "../features/payment";

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
                path: "about",
                element: <AboutPage />
            },
            {
                path: "contact",
                element: <ContactPage />
            },
            {
                path: "privacy",
                element: <PrivacyPage />
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
    // Student profile page
    {
        path: "/profile/student/:id?",
        element: <StudentProfilePage />,
    },
    // Payment routes
    {
        path: ROUTES.PAYMENT_SUCCESS,
        element: <PaymentSuccessPage />,
    },
    {
        path: ROUTES.PAYMENT_ERROR,
        element: <PaymentErrorPage />,
    },
    {
        path: ROUTES.PAYMENT_GENERAL_ERROR,
        element: <PaymentErrorPage />,
    },
    {
        path: ROUTES.PREMIUM_SUCCESS,
        element: <PremiumSuccessPage />,
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
                path: "profile",
                element: <CurrentUserProfilePage />
            },
            {
                path: "subscription",
                element: <SubscriptionPage />
            },
        ]
    }
]);

const AppRouterProvider = () => {   
    return <RouterProvider router={router} />
}

export default AppRouterProvider;