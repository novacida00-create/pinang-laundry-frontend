import MainLayout from "../../components/layout/MainLayout";

export default function Orders() {
  const orders = [
    { id: 1, customer: "Budi", status: "Proses" },
    { id: 2, customer: "Siti", status: "Selesai" },
  ];

  return (
    <MainLayout>
      <h2>Data Order</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Pelanggan</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.status}</td>
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