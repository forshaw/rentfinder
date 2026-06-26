import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";

import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import { useEffect } from "react";
import { subscribe } from "./utils/notificationEvents";


export default function App() {

  /**
   * ✅ GLOBAL NOTIFICATION LISTENER
   * Listens for events and shows toast
   */
    useEffect(() => {
      const handler = () => {
        console.log("🔥 EVENT TRIGGERED"); // debug
        toast.success("Toast works ✅");
      };

      const unsubscribe = subscribe(handler);

      return () => unsubscribe();
    }, []);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ✅ Your existing router */}
      <RouterProvider router={router} />

      {/* ✅ Toast UI (must exist once globally) */}
      <Toaster position="top-right" />
    </div>
  );
}