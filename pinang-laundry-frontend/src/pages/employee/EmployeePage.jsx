import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";

export default function EmployeePage() {
  const { user } = useAuth();

  const tasks = [
    {
      id: 1,
      task: "Sortir cucian pelanggan Budi",
      status: "Proses",
    },
    {
      id: 2,
      task: "Setrika order Siti",
      status: "Pending",
    },
    {
      id: 3,
      task: "Packing laundry Express",
      status: "Selesai",
    },
  ];

  return (
    <MainLayout>
      <h2>Dashboard Karyawan</h2>

      {/* INFO USER */}
      <div style={styles.card}>
        <h3>Halo 👋 {user?.name || "Karyawan"}</h3>
        <p>Email: {user?.email || "-"}</p>
      </div>

      {/* TASK LIST */}
      <div style={{ marginTop: 20 }}>
        <h3>Tugas Harian</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tugas</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.task}</td>
                <td>
                  <span style={getStatusStyle(t.status)}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

function getStatusStyle(status) {
  return {
    color:
      status === "Selesai"
        ? "green"
        : status === "Proses"
        ? "orange"
        : "red",
    fontWeight: "bold",
  };
}

const styles = {
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    marginTop: 10,
    borderCollapse: "collapse",
  },
};