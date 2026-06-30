import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";

export default function CustomerPage() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <h2>Dashboard Pelanggan</h2>

      <div style={styles.card}>
        <h3>Selamat datang 👋</h3>
        <p>Nama: {user?.name || "Customer"}</p>
        <p>Email: {user?.email || "-"}</p>
      </div>

      <div style={styles.info}>
        <p>
          Di sini kamu bisa melihat status laundry, riwayat pesanan, dan
          estimasi selesai.
        </p>
      </div>
    </MainLayout>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  info: {
    marginTop: 20,
    background: "#f0f9ff",
    padding: 15,
    borderRadius: 8,
  },
};