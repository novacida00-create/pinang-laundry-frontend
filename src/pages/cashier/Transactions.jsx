import MainLayout from "../../components/layout/MainLayout";

export default function Transactions() {
  const data = [
    { id: 1, customer: "Budi", total: 20000, status: "Selesai" },
    { id: 2, customer: "Siti", total: 35000, status: "Proses" },
  ];

  return (
    <MainLayout>
      <h2>Riwayat Transaksi</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Pelanggan</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.customer}</td>
              <td>Rp {d.total}</td>
              <td>{d.status}</td>
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