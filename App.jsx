import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/admin/Dashboard";
import Transaksi from "./pages/admin/Transaksi";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaksi" element={<Transaksi />} />

      </Routes>
    </BrowserRouter>
  );
}