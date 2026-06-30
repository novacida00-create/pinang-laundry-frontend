import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";

import Dashboard from "./pages/Dashboard";
import Transaksi from "./pages/Transaksi";
import Pelanggan from "./pages/Pelanggan";
import Karyawan from "./pages/Karyawan";
import Layanan from "./pages/Layanan";
import Laporan from "./pages/Laporan";
import Pengaturan from "./pages/Pengaturan";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/pelanggan" element={<Pelanggan />} />
          <Route path="/karyawan" element={<Karyawan />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
