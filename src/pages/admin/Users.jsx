import MainLayout from "../../components/layout/MainLayout";

export default function Users() {
  const users = [
    { id: 1, name: "Admin", role: "Admin" },
    { id: 2, name: "Kasir 1", role: "Kasir" },
  ];

  return (
    <MainLayout>
      <h2>Manajemen User</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
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