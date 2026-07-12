import React from "react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Icon from "../../utils/icons.jsx";



const formatTanggalIndonesia = () => {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const today = new Date();
  const namaHari = hari[today.getDay()];
  const namaBulan = bulan[today.getMonth()];
  const tanggal = today.getDate();
  const tahun = today.getFullYear();
  
  return `${tanggal} ${namaBulan} ${tahun}, ${namaHari}`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const currentDate = formatTanggalIndonesia();
  const [showKaryawanModal, setShowKaryawanModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Pesanan Baru", message: "Novacida Haqs memesan Cuci Kiloan", time: "2 menit lalu", read: false },
    { id: 2, title: "Pesanan Selesai", message: "Pesanan Ahmad Rizki sudah selesai", time: "30 menit lalu", read: false },
    { id: 3, title: "Pembayaran", message: "Pembayaran dari Siti Aminah berhasil", time: "1 jam lalu", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const [stats, setStats] = useState({
    pendapatan: "Rp 0",
    transaksi: "0",
    pelanggan: "0",
    selesai: "0"
  });
  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const loadStats = async () => {
    try {
      const [ordersRes, pelangganRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/pelanggan")
      ]);

      const ordersData = await ordersRes.json();
      const pelangganData = await pelangganRes.json();

      if (!ordersRes.ok) throw new Error(ordersData.error);
      if (!pelangganRes.ok) throw new Error(pelangganData.error);

      const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
      const pelanggan = Array.isArray(pelangganData) ? pelangganData : (pelangganData.data || []);

      const totalPendapatan = orders
        .filter(o => o.status === "Selesai")
        .reduce((sum, o) => sum + (parseInt(o.total) || 0), 0);

      const totalPelanggan = pelanggan.length;
      const orderSelesai = orders.filter(o => o.status === "Selesai").length;

      setStats({
        pendapatan: `Rp ${totalPendapatan.toLocaleString("id-ID")}`,
        transaksi: orders.length.toString(),
        pelanggan: totalPelanggan.toString(),
        selesai: orderSelesai.toString()
      });
    } catch {
      setStats({
        pendapatan: "Rp 0",
        transaksi: "0",
        pelanggan: "0",
        selesai: "0"
      });
    }
  };

  const [users, setUsers] = useState([
    { no: 1, name: "Alex", user: "Alex123", role: "Admin", phone: "0812-3456-7890" },
    { no: 2, name: "Siti Aisyah", user: "siti.aisyah", role: "Kasir", phone: "0813-2345-6789" },
    { no: 3, name: "Budi Setiawan", user: "budi.setiawan", role: "Staff", phone: "0814-1234-5678" },
    { no: 4, name: "Dewi Lestari", user: "dewi.lestari", role: "Staff", phone: "0815-9876-5432" },
    { no: 5, name: "Andi Saputra", user: "andi.saputra", role: "Delivery", phone: "0816-4567-8901" },
  ]);
  const [newUser, setNewUser] = useState({ name: "", user: "", role: "Staff", phone: "" });

  const handleTambahUser = () => {
    if (newUser.name) {
      const no = users.length + 1;
      const username = newUser.name.toLowerCase().replace(/\s+/g, ".");
      setUsers([...users, { ...newUser, user: username, no }]);
      setNewUser({ name: "", user: "", role: "Staff", phone: "" });
      setShowUserModal(false);
      alert("Pengguna berhasil ditambahkan!");
    } else {
      alert("Mohon isi nama!");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ name: user.name, phone: user.phone, role: user.role, user: user.user });
    setShowUserModal(true);
  };

  const handleUpdateUser = () => {
    if (editingUser && newUser.name) {
      setUsers(users.map(u => u.no === editingUser.no ? { ...newUser, no: editingUser.no } : u));
      setEditingUser(null);
      setNewUser({ name: "", user: "", role: "Staff", phone: "" });
      setShowUserModal(false);
      alert("Pengguna berhasil diupdate!");
    }
  };

  const handleDeleteUser = (no) => {
    if (confirm("Yakin ingin menghapus pengguna ini?")) {
      setUsers(users.filter(u => u.no !== no));
      alert("Pengguna berhasil dihapus!");
    }
  };

  return (
    <div className="admin-layout" style={styles.app}>
      <input type="checkbox" id="mt" className="mt-i" />
      {/* SIDEBAR */}
      <aside className="admin-sidebar" style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <div style={styles.logoSection}>
            <div style={styles.logoIcon}>🧺</div>
            <div>
              <h1 style={styles.logoText}>Pinang Laundry</h1>
              <p style={styles.logoSub}>Bersih, Cepat, Terpercaya</p>
            </div>
          </div>

          <nav style={styles.nav}>
            <NavLink to="/admin" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}>
              <NavItem icon="dashboard" label="Dashboard" />
            </NavLink>
            <NavLink to="/orderan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}>
              <NavItem icon="receipt" label="Orderan" />
            </NavLink>
            <NavLink to="/pelanggan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}>
              <NavItem icon="users" label="Pelanggan" />
            </NavLink>
            <div style={styles.navItem} onClick={() => navigate("/transaksi")}>
              <NavItem icon="creditCard" label="Transaksi" />
            </div>
            <NavLink to="/karyawan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}>
              <NavItem icon="idBadge2" label="Karyawan" />
            </NavLink>
            <NavLink to="/admin/layanan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}>
              <NavItem icon="tag" label="Layanan" />
            </NavLink>
            <NavLink to="/laporan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}>
              <NavItem icon="chartBar" label="Laporan" />
            </NavLink>
            <NavLink to="/pengaturan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}>
              <NavItem icon="settings" label="Pengaturan" />
            </NavLink>
          </nav>
        </div>

        <div style={styles.profileWidget}>
          <div style={styles.avatarCircle}><Icon name="user" /></div>
          <div style={{ flex: 1 }}>
            <div style={styles.profName}>Alex</div>
            <div style={styles.profRole}>Admin</div>
          </div>
          <button onClick={() => navigate("/")} style={styles.logoutBtn}>Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main" style={styles.main}>
        <label htmlFor="mt" className="mt-l"><Icon name="menu2" /></label>
        {/* HEADER */}
        <header style={styles.header}>
          <h2 style={styles.welcome}>Selamat datang, Alex!</h2>
          <div style={styles.headerRight}>
            <div style={styles.dateBox}><Icon name="calendar" /> {currentDate}</div>
            <div style={styles.notifBtn} onClick={() => setShowNotifModal(true)}>
              <Icon name="bell" />{unreadCount > 0 && <span style={styles.notifBadge}>{unreadCount}</span>}
            </div>
            <div style={styles.topAvatar} onClick={() => setShowProfileModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </header>

        {/* STATS ROW */}
        <div style={styles.statsRow}>
          <StatCard label="Total Pendapatan" val={stats.pendapatan} color="#e0f2fe" iColor="#0ea5e9" icon="cash" growth="12.5%" onClick={() => navigate("/laporan")} />
          <StatCard label="Total Orderan" val={stats.transaksi} color="#dcfce7" iColor="#22c55e" icon="shoppingBag" growth="8.2%" onClick={() => navigate("/orderan")} />
          <StatCard label="Total Pelanggan" val={stats.pelanggan} color="#f3e8ff" iColor="#a855f7" icon="users" growth="5.7%" onClick={() => navigate("/pelanggan")} />
          <StatCard label="Order Selesai" val={stats.selesai} color="#ffedd5" iColor="#f97316" icon="checkbox" growth="9.1%" onClick={() => navigate("/orderan")} />
        </div>

        {/* REVENUE CHART */}
        <section style={{ ...styles.card, marginBottom: 25 }}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Grafik Pendapatan</h3>
            <select style={styles.select}><option>6 Bulan Terakhir</option></select>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} tickFormatter={(val) => `Rp${(val/1000000).toFixed(0)}JT`} />
                <Tooltip formatter={(val) => [`Rp ${val.toLocaleString('id-ID')}`, 'Pendapatan']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="pendapatan" stroke="#3b82f6" strokeWidth={3} fill="url(#colorArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* USER TABLE */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Manajemen Pengguna</h3>
            <button style={styles.btnAdd} onClick={() => setShowUserModal(true)}>+ Tambah Pengguna</button>
          </div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>No</th>
                <th style={styles.th}>Nama</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>No. Telepon</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.no} style={styles.tr}>
                  <td style={styles.td}>{user.no}</td>
                  <td style={styles.td}><Icon name="user" /> {user.name}</td>
                  <td style={styles.td}>{user.user}</td>
                  <td style={styles.td}><span style={getRoleBadge(user.role)}>{user.role}</span></td>
                  <td style={styles.td}>{user.phone}</td>
                  <td style={styles.td}><span style={styles.statusAktif}>Aktif</span></td>
                  <td style={styles.td}>
                    <button style={styles.actionBtn} onClick={() => handleEditUser(user)}><Icon name="edit" /></button>
                    <button style={styles.deleteBtn} onClick={() => handleDeleteUser(user.no)}><Icon name="trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* MODAL TAMBAH/EDIT USER */}
      {showUserModal && (
        <div style={styles.modalOverlay} onClick={() => { setShowUserModal(false); setEditingUser(null); setNewUser({ name: "", user: "", role: "Staff", phone: "" }); }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>{editingUser ? "Edit Pengguna" : "Tambah Pengguna"}</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama</label>
              <input style={styles.formInput} value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>No. Telepon</label>
              <input style={styles.formInput} value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <select style={styles.formInput} value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                <option value="Admin">Admin</option>
                <option value="Kasir">Kasir</option>
                <option value="Staff">Staff</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
            <div style={styles.modalButtons}>
              <button style={styles.modalCancel} onClick={() => { setShowUserModal(false); setEditingUser(null); setNewUser({ name: "", user: "", role: "Staff", phone: "" }); }}>Batal</button>
              <button style={styles.modalSave} onClick={editingUser ? handleUpdateUser : handleTambahUser}>
                {editingUser ? "Update" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div style={styles.modalOverlay} onClick={() => setShowProfileModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.profileHeader}>
              <div style={styles.profileAvatar}><Icon name="user" size={40} /></div>
              <h3>Alex</h3>
              <p style={styles.profileRole}>Admin</p>
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.profileRow}>
                <span style={styles.profileLabel}><Icon name="mail" /> Email</span>
                <span>alex@pinanglaundry.com</span>
              </div>
              <div style={styles.profileRow}>
                <span style={styles.profileLabel}><Icon name="phone" /> Telepon</span>
                <span>0812-3456-7890</span>
              </div>
              <div style={styles.profileRow}>
                <span style={styles.profileLabel}><Icon name="building" /> Department</span>
                <span>Manajemen</span>
              </div>
              <div style={styles.profileRow}>
                <span style={styles.profileLabel}><Icon name="calendar" /> Bergabung</span>
                <span>1 Januari 2024</span>
              </div>
            </div>
            <button style={styles.profileCloseBtn} onClick={() => setShowProfileModal(false)}>Tutup</button>
          </div>
        </div>
      )}

      {/* NOTIFICATION MODAL */}
      {showNotifModal && (
        <div style={styles.modalOverlay} onClick={() => setShowNotifModal(false)}>
          <div style={styles.notifModal} onClick={e => e.stopPropagation()}>
            <div style={styles.notifHeader}>
              <h3><Icon name="bell" /> Notifikasi</h3>
              <button style={styles.closeBtn} onClick={() => setShowNotifModal(false)}><Icon name="x" /></button>
            </div>
            <div style={styles.notifList}>
              {notifications.map(n => (
                <div key={n.id} style={n.read ? styles.notifItemRead : styles.notifItem} onClick={() => markAsRead(n.id)}>
                  <div style={styles.notifIcon}>{n.read ? <Icon name="check" /> : <Icon name="bell" />}</div>
                  <div style={styles.notifContent}>
                    <div style={styles.notifTitle}>{n.title}</div>
                    <div style={styles.notifMessage}>{n.message}</div>
                    <div style={styles.notifTime}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* --- DATA --- */
const chartData = [
  { name: 'Nov 2025', pendapatan: 14000000 },
  { name: 'Des 2025', pendapatan: 16500000 },
  { name: 'Jan 2026', pendapatan: 19500000 },
  { name: 'Feb 2026', pendapatan: 20000000 },
  { name: 'Mar 2026', pendapatan: 23000000 },
  { name: 'Apr 2026', pendapatan: 24850000 },
];

/* --- COMPONENTS --- */
const NavItem = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Icon name={icon} /> {label}
  </div>
);

const StatCard = ({ label, val, color, iColor, icon, growth, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <div style={{ ...styles.statCard, cursor: onClick ? "pointer" : "default" }} onClick={handleClick}>
      <div style={{ ...styles.statIcon, backgroundColor: color, color: iColor }}><Icon name={icon} size={24} /></div>
      <div style={{ marginLeft: 16 }}>
        <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 800 }}>{val}</div>
        <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 700 }}>▲ {growth} <span style={{color: '#94a3b8', fontWeight: 400}}>dari bulan lalu</span></div>
      </div>
    </div>
  );
};

function getRoleBadge(role) {
  if (role === "Admin") return { padding: "4px 10px", borderRadius: 8, background: "#eff6ff", color: "#3b82f6", fontSize: 10, fontWeight: 800 };
  if (role === "Kasir") return { padding: "4px 10px", borderRadius: 8, background: "#ecfdf5", color: "#10b981", fontSize: 10, fontWeight: 800 };
  if (role === "Staff") return { padding: "4px 10px", borderRadius: 8, background: "#f5f3ff", color: "#8b5cf6", fontSize: 10, fontWeight: 800 };
  return { padding: "4px 10px", borderRadius: 8, background: "#fff7ed", color: "#f97316", fontSize: 10, fontWeight: 800 };
}

/* --- STYLES --- */
const styles = {
  app: { display: "flex", minHeight: "100vh", backgroundColor: "#F5F7FB", color: "#1e293b" },
  sidebar: { width: 260, background: "linear-gradient(180deg, #0f2b5e, #1e40af)", padding: "30px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", zIndex: 1 },
  sidebarTop: { display: "flex", flexDirection: "column", gap: 40 },
  logoSection: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { width: 40, height: 40, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20, backdropFilter: "blur(4px)" },
  logoText: { fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 },
  logoSub: { fontSize: 10, color: "rgba(255,255,255,0.6)", margin: 0 },
  nav: { display: "flex", flexDirection: "column", gap: 6 },
  navItem: { padding: "12px 16px", borderRadius: 12, color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "none", display: "flex", transition: "all 0.2s" },
  navActive: { background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700 },
  profileWidget: { display: "flex", alignItems: "center", gap: 12, padding: 14 },
  avatarCircle: { width: 40, height: 40, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 18, color: "rgba(255,255,255,0.75)" },
  profName: { fontSize: 14, fontWeight: 600, color: "#fff" },
  profRole: { fontSize: 10, color: "rgba(255,255,255,0.6)" },
  logoutBtn: { background: "#ef4444", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", padding: "10px 16px", borderRadius: 10 },
  main: { flex: 1, padding: "30px 40px", overflowY: "auto", minWidth: 0 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  welcome: { fontSize: 24, fontWeight: 700, margin: 0 },
  headerRight: { display: "flex", alignItems: "center", gap: 15 },
  dateBox: { padding: "10px 15px", background: "#fff", borderRadius: 12, fontSize: 12, fontWeight: 700, border: "1px solid #f1f5f9", cursor: "pointer" },
  notifBtn: { position: "relative", padding: 10, background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", cursor: "pointer" },
  notifBadge: { position: "absolute", top: 8, right: 8, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", border: "2px solid #fff" },
  topAvatar: { width: 40, height: 40, background: "#cbd5e1", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  statsRow: { display: "flex", gap: 20, marginBottom: 25 },
  statCard: { flex: 1, background: "#fff", padding: "20px", borderRadius: 24, display: "flex", alignItems: "center", border: "1px solid #e2e8f0", cursor: "pointer" },
  statIcon: { width: 48, height: 48, borderRadius: 14, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20 },
  card: { background: "#fff", padding: "28px", borderRadius: 28, border: "1px solid #e2e8f0", minWidth: 0 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  cardTitle: { fontSize: 16, fontWeight: 600, margin: 0, color: "#1e293b" },
  select: { padding: "8px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12, color: "#64748b", cursor: "pointer" },
  link: { fontSize: 11, color: "#3b82f6", fontWeight: 700, cursor: "pointer" },
  btnAdd: { background: "#3b82f6", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 12, fontWeight: 700, fontSize: 12, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { borderBottom: "1px solid #f8fafc" },
  th: { textAlign: "left", padding: "12px 15px", color: "#94a3b8", fontSize: 12, fontWeight: 600 },
  td: { padding: "15px", fontSize: 13, borderBottom: "1px solid #f8fafc", fontWeight: 500 },
  tr: { borderBottom: "1px solid #f8fafc" },
  badgeBlue: { padding: "4px 10px", borderRadius: 8, background: "#eff6ff", color: "#3b82f6", fontSize: 10, fontWeight: 800 },
  badgeGreen: { padding: "4px 10px", borderRadius: 8, background: "#ecfdf5", color: "#10b981", fontSize: 10, fontWeight: 800 },
  badgePurple: { padding: "4px 10px", borderRadius: 8, background: "#f5f3ff", color: "#8b5cf6", fontSize: 10, fontWeight: 800 },
  badgeOrange: { padding: "4px 10px", borderRadius: 8, background: "#fff7ed", color: "#f97316", fontSize: 10, fontWeight: 800 },
  statusAktif: { color: "#22c55e", fontWeight: 800, padding: "4px 8px", background: "#f0fdf4", borderRadius: 6 },
  pagination: { display: "flex", justifyContent: "center", gap: 12, marginTop: 20, alignItems: "center", color: "#94a3b8", fontSize: 12 },
  pageActive: { width: 28, height: 28, background: "#3b82f6", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 8, fontWeight: 700 },
  actionBtn: { background: "none", border: "none", cursor: "pointer", marginRight: 8, fontSize: 14 },
  deleteBtn: { background: "none", border: "none", cursor: "pointer", marginRight: 8, fontSize: 14, color: "#ef4444" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "white", borderRadius: 20, padding: 30, width: 400, display: "flex", flexDirection: "column", gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: 700, margin: 0, textAlign: "center" },
  modalInput: { padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 14 },
  modalButtons: { display: "flex", gap: 12, marginTop: 10 },
  formGroup: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6 },
  formInput: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 600, boxSizing: "border-box" },
  modalCancel: { flex: 1, padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  modalSave: { flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1001 },
  profileHeader: { textAlign: "center", padding: "20px 0", borderBottom: "1px solid #e2e8f0" },
  profileAvatar: { width: 80, height: 80, background: "#e2e8f0", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 40, margin: "0 auto 12px" },
  profileRole: { color: "#64748b", fontSize: 14 },
  profileInfo: { padding: "20px 0" },
  profileRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 },
  profileLabel: { color: "#64748b", fontWeight: 600 },
  profileCloseBtn: { width: "100%", padding: 12, background: "#3b82f6", color: "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", marginTop: 16 },
  notifModal: { background: "white", borderRadius: 16, width: 380, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" },
  notifHeader: { padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer" },
  notifList: { overflow: "auto", maxHeight: 400 },
  notifItem: { padding: 16, borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", gap: 12, background: "#eff6ff" },
  notifItemRead: { padding: 16, borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", gap: 12 },
  notifIcon: { fontSize: 20 },
  notifContent: { flex: 1 },
  notifTitle: { fontWeight: 700, fontSize: 14, marginBottom: 4 },
  notifMessage: { fontSize: 13, color: "#64748b", marginBottom: 4 },
  notifTime: { fontSize: 11, color: "#94a3b8" }
};