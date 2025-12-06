import { createBrowserRouter, type RouteObject } from "react-router-dom"
import Index from "@/pages/Index"
import Version from "@/pages/Version"

const routes: RouteObject[] = [
    {
        path: "/",
        Component: Index,
    },
    {
        path: "/version",
        Component: Version
    }
]

export default createBrowserRouter(routes)