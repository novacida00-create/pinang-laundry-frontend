import MainLayout from "../../components/layout/MainLayout";

export default function OrderHistory() {
  const orders = [
    {
      id: 1,
      service: "Cuci Kiloan",
      status: "Selesai",
      total: 20000,
    },
    {
      id: 2,
      service: "Setrika",
      status: "Proses",
      total: 15000,
    },
    {
      id: 3,
      service: "Express",
      status: "Diambil",
      total: 30000,
    },
  ];

  return (
    <MainLayout>
      <h2>Riwayat Pesanan</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Layanan</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.service}</td>
              <td>
                <span
                  style={{
                    color:
                      o.status === "Selesai"
                        ? "green"
                        : o.status === "Proses"
                        ? "orange"
                        : "blue",
                    fontWeight: "bold",
                  }}
                >
                  {o.status}
                </span>
              </td>
              <td>Rp {o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
}

const styles = {
  table: {
    width: "100%",
    marginTop: 20,
    borderCollapse: "collapse",
  },
};