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
import TermsPage from "../features/terms/TermsPage";
import CollegesPage from "../features/colleges/CollegesPage";
import FeedPage from "../features/feed/FeedPage";
import SubscriptionPage from "../features/subscription/SubscriptionPage";
import { StudentProfilePage, CurrentUserProfilePage } from "../features/profile";
import { PaymentSuccessPage, PaymentErrorPage, PremiumSuccessPage } from "../features/payment";
import NotFoundPage from "../features/common/components/NotFoundPage";
import ErrorTestPage from "../features/common/components/ErrorTestPage";

const router = createBrowserRouter([
    // Public routes now served under /public
    {
        path: "/public",
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
                path: "terms",
                element: <TermsPage />
            },
            {
                path: "feed",
                element: <FeedPage />
            },
            {
                path: "colleges",
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
    // Authenticated layout now on base path '/'
    {
        path: "/",
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
            {
                path: "home",
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
                path: "terms",
                element: <TermsPage />
            },
            {
                path: "error-test",
                element: <ErrorTestPage />
            },
        ]
    },
    // Catch-all route for 404 errors - must be last
    {
        path: "*",
        element: <NotFoundPage />
    }
]);

const AppRouterProvider = () => {   
    return <RouterProvider router={router} />
}

export default AppRouterProvider;