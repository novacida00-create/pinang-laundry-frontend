import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handle = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return size;
};

export const isMobile = (width) => width < 768;
export const isTablet = (width) => width >= 768 && width < 1024;

export const mobileStyles = {
  sidebar: { position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 999, transform: "translateX(-100%)", transition: "transform 0.3s" },
  sidebarOpen: { transform: "translateX(0)" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 998 },
  mainMobile: { padding: "15px", width: "100%", overflowX: "auto" },
  headerMobile: { flexDirection: "column", gap: 10, marginBottom: 20 },
  statsMobile: { flexDirection: "column", gap: 12 },
  tableMobile: { fontSize: 10, display: "block", overflowX: "auto", whiteSpace: "nowrap" },
  cardMobile: { padding: "15px" },
};
