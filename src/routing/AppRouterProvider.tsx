import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import MainLayout from "../layouts/MainLayout";
import Colleges from "../pages/Colleges/Colleges";
import Signup from "../pages/Signup/Signup";

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
                path: "/login",
                element: <Login />
            },
            {
                path: "/colleges",
                element: <Colleges />
            },
            {
                path: "/signup",
                element: <Signup />
            }
        ]
    },
])

const AppRouterProvider = () => {   
    return <RouterProvider router={router} />
}

export default AppRouterProvider;