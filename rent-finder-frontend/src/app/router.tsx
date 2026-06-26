import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";
import Offline from "../pages/Offline";

import BusyDashboard from "../pages/BusyDashboard";
import FinderDashboard from "../pages/FinderDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Notifications from "../pages/Notifications";
import TaskDetails from "../pages/TaskDetails";
import CreateRequest from "../pages/CreateRequest";
import RequestDetails from "../pages/RequestDetails";
import BankTransfer from "../pages/BankTransfer";

import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";
import AppLayout from "../layouts/AppLayout";

import { useAuth } from "../context/AuthContext";

/* =========================
   ✅ HOME REDIRECT
========================= */

function HomeRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "rent_finder":
      return <Navigate to="/finder" replace />;
    case "busy_individual":
      return <Navigate to="/busy" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
}

/* =========================
   ✅ ROUTER
========================= */

export const router = createBrowserRouter([
  /* ---------- Public ---------- */
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "/offline", element: <Offline /> },

  /* ---------- Protected Layout ---------- */
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),

    children: [
      /* ---------- Root ---------- */
      {
        path: "/",
        element: <HomeRedirect />,
      },

      /* ---------- Busy ---------- */
      {
        path: "/busy",
        element: (
          <RequireRole role="busy_individual">
            <BusyDashboard />
          </RequireRole>
        ),
      },

      /* ---------- Finder ---------- */
      {
        path: "/finder",
        element: (
          <RequireRole role="rent_finder">
            <FinderDashboard />
          </RequireRole>
        ),
      },

      /* ---------- Admin ---------- */
      {
        path: "/admin",
        element: (
          <RequireRole role="admin">
            <AdminDashboard />
          </RequireRole>
        ),
      },

      /* ---------- Shared Pages ---------- */
      {
        path: "/notifications",
        element: <Notifications />,
      },

      {
        path: "/tasks/:id",
        element: <TaskDetails />,
      },

      {
        path: "/create-request",
        element: <CreateRequest />,
      },

      {
        path: "/requests/:id",
        element: <RequestDetails />,
      },

      {
        path: "/bank-transfer/:escrowId",
        element: <BankTransfer />,
      },
    ],
  },

  /* ---------- Fallback ---------- */
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);