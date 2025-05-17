import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/Home/Home";
import MainLayout from "../layouts/MainLayout";
import Colleges from "../pages/Colleges/Colleges";
import AuthLayout from "../layouts/AuthLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/colleges",
                element: <Colleges />
            },
        ]
    },
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
    }
])

const AppRouterProvider = () => {   
    return <RouterProvider router={router} />
}

export default AppRouterProvider;