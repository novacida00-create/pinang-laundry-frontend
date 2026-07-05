import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { icon: "🏠", label: "Dashboard", path: "/" },
    { icon: "🧾", label: "Orderan", path: "/orderan" },
    { icon: "👥", label: "Pelanggan", path: "/pelanggan" },
    { icon: "👨‍💼", label: "Karyawan", path: "/karyawan" },
    { icon: "🏷️", label: "Layanan", path: "/admin/layanan" },
    { icon: "📊", label: "Laporan", path: "/laporan" },
    { icon: "⚙️", label: "Pengaturan", path: "/pengaturan" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>🧺 <b>Pinang Laundry</b></div>

      <nav style={styles.nav}>
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.link,
              background: isActive ? "#2563eb" : "transparent",
            })}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 260,
    height: "100vh",
    position: "fixed",   // 🔥 WAJIB
    top: 0,
    left: 0,
    background: "#1e40af",
    color: "white",
    padding: 20,
    zIndex: 9999,        // 🔥 WAJIB BESAR
  },

  logo: {
    fontSize: 18,
    marginBottom: 20,
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  link: {
    padding: "10px",
    borderRadius: 8,
    textDecoration: "none",
    color: "white",
    display: "block",
    cursor: "pointer",
  },
};