import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);