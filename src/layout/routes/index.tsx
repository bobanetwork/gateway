import BridgePage from "@/layout/bridge";
import DaoPage from "@/layout/dao";
import EarnPage from "@/layout/earn";
import EcosystemPage from "@/layout/ecosystem";
import HistoryPage from "@/layout/history";
import Home from "@/layout/home";
import StakePage from "@/layout/stake";
import TradePage from "@/layout/trade";
import SmartAccountPage from "@/layout/SmartAccountPage";
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
      element: <BridgePage />,
    },
    {
      path: "history",
      element: <HistoryPage />,
    },
    {
      path: "stake",
      element: <StakePage />,
    },
    {
      path: "smartaccount",
      element: <SmartAccountPage />,
    },
    {
      path: "earn",
      element: <EarnPage />,
    },
    {
      path: "dao",
      element: <DaoPage />,
    },
    {
      path: "ecosystem",
      element: <EcosystemPage />,
    },
    {
      path: "trade",
      element: <TradePage />,
    },
  ]
}]

const router = createBrowserRouter(RouteList)

export default router;