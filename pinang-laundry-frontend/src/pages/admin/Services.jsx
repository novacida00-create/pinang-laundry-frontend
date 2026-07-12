import MainLayout from "../../components/layout/MainLayout";

export default function Services() {
  const services = [
    { id: 1, name: "Cuci Kiloan", price: 7000 },
    { id: 2, name: "Setrika", price: 5000 },
    { id: 3, name: "Express", price: 12000 },
  ];

  return (
    <MainLayout>
      <h2>Data Layanan Laundry</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Layanan</th>
            <th>Harga</th>
          </tr>
        </thead>

        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>Rp {s.price}</td>
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