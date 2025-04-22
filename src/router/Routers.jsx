import BaseLayout from "@/layouts/BaseLayout";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Routers = () => {
    const router = createBrowserRouter(
        [
            {
                path: "/",
                element: <BaseLayout />,
                errorElement: <h1>404</h1>,
                children: [
                    {
                        path: "/",
                        element: <h1>asd</h1>,
                    },
                ],
            },
        ],
        {
            future: { v7_relativeSplatPath: true },
        }
    );

    return (
        <>
            <RouterProvider
                router={router}
                future={{ v7_startTransition: true }}
            />
        </>
    );
};

export default Routers;
