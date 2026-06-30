import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./src/routes/AppRoutes";
import { AuthProvider } from "./src/context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);