import Header from "../components/Header";
import NetworkStatusBanner from "../components/NetworkStatusBanner";
import PwaUpdateBanner from "../components/PwaUpdateBanner";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import MobileNav from "../components/MobileNav";
import { useState, useEffect } from "react";

export default function AppLayout() {
  
 const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f7f7f7",
      }}
    >
      <Header />
      <NetworkStatusBanner />
      <PwaUpdateBanner />

      <div
        style={{
          display: "flex",
          flex: 1,
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* ✅ ONLY SHOW SIDEBAR ON DESKTOP */}
        {!isMobile && <Sidebar />}

        <main
          style={{
            flex: 1,
            padding: 20,
            paddingBottom: isMobile ? 80 : 20, // 👈 important for bottom nav
            minWidth: 0,
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* ✅ SHOW MOBILE NAV */}
      {isMobile && <MobileNav />}
    </div>
  );
}