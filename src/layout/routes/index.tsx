import Home from "@/layout/home";
import Bridge from "@/layout/bridge";
import History from "@/layout/history";
import Stake from "@/layout/stake";
import Earn from "@/layout/earn";
import Dao from "@/layout/dao";
import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

const RouteList: RouteObject[] = [{
  path: "/",
  element: <Home />,
  children: [
    {
      path: "",
      element: <Navigate to="/bridge" replace />,
    },
    {
      path: "bridge",
      element: <Bridge />,
    },
    {
      path: "history",
      element: <History />,
    },
    {
      path: "stake",
      element: <Stake />,
    },
    {
      path: "earn",
      element: <Earn />,
    },
    {
      path: "dao",
      element: <Dao />,
    },
  ]
}]

const router = createBrowserRouter(RouteList)

export default router;