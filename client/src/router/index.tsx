import { createBrowserRouter, type RouteObject } from "react-router-dom"
import Index from "@/pages/index"
import Version from "@/pages/version"

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