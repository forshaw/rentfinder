import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { router } from "./app/router";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const queryClient = new QueryClient();

createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("✅ Service Worker registered by Forshaw");

      registration.onupdatefound = () => {
        const worker = registration.installing;
        if (!worker) return;

        worker.onstatechange = () => {
          if (worker.state === "installed") {
            console.log("✅ New version available");
          }
        };
      };
    })
    .catch((err) => console.error("SW registration failed:", err));
}
