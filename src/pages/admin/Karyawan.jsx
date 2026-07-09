import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../../utils/icons.jsx";

const API = "/api";

const formatTanggalIndonesia = () => {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const today = new Date();
  return `${today.getDate()} ${bulan[today.getMonth()]} ${today.getFullYear()}, ${hari[today.getDay()]}`;
};

export default function Karyawan() {
  const navigate = useNavigate();
  const currentDate = formatTanggalIndonesia();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingKaryawan, setEditingKaryawan] = useState(null);
  const [newKaryawan, setNewKaryawan] = useState({ name: "", role: "Staff Laundry", phone: "" });
  const [allKaryawan, setAllKaryawan] = useState([]);

  const fetchKaryawan = async () => {
    try {
      const res = await fetch(`${API}/karyawan`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAllKaryawan(data.map(k => ({ ...k, order: k.order_count ?? k.order ?? 0 })));
    } catch (err) {
      console.error("Gagal memuat karyawan:", err);
    }
  };

  useEffect(() => {
    fetchKaryawan();
  }, []);

  const filteredKaryawan = allKaryawan.filter(k => 
    k.name.toLowerCase().includes(search.toLowerCase()) || 
    k.role.toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredKaryawan.length / itemsPerPage);
  const paginatedKaryawan = filteredKaryawan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTambahKaryawan = async () => {
    if (newKaryawan.name && newKaryawan.phone) {
      try {
        const payload = {
          name: newKaryawan.name,
          role: newKaryawan.role,
          phone: newKaryawan.phone,
          order_count: editingKaryawan ? (editingKaryawan.order_count ?? editingKaryawan.order ?? 0) : 0,
          status: editingKaryawan ? editingKaryawan.status : "Aktif"
        };

        if (editingKaryawan) {
          const res = await fetch(`${API}/karyawan/${editingKaryawan.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          alert(`Karyawan berhasil diupdate!`);
        } else {
          const res = await fetch(`${API}/karyawan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, order_count: 0, status: "Aktif" })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          alert(`Karyawan berhasil ditambahkan!\nNama: ${newKaryawan.name}\nRole: ${newKaryawan.role}`);
        }

        setNewKaryawan({ name: "", role: "Staff Laundry", phone: "" });
        setEditingKaryawan(null);
        setShowModal(false);
        fetchKaryawan();
      } catch (err) {
        alert("Gagal menyimpan karyawan: " + err.message);
      }
    } else {
      alert("Mohon isi nama dan nomor HP!");
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditKaryawan = (karyawan) => {
    setEditingKaryawan(karyawan);
    setNewKaryawan({ name: karyawan.name, role: karyawan.role, phone: karyawan.phone });
    setShowModal(true);
  };

  const handleDeleteKaryawan = async (id) => {
    if (confirm("Yakin ingin menghapus karyawan ini?")) {
      try {
        const res = await fetch(`${API}/karyawan/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        alert("Karyawan berhasil dihapus!");
        fetchKaryawan();
      } catch (err) {
        alert("Gagal menghapus karyawan: " + err.message);
      }
    }
  };

  return (
    <div className="admin-layout" style={styles.app}>
      <input type="checkbox" id="mt" className="mt-i" />
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
            <div style={styles.navItem} onClick={() => window.location.href='/transaksi'}>
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

      <main className="admin-main" style={styles.main}>
        <label htmlFor="mt" className="mt-l"><Icon name="menu2" /></label>
        <header style={styles.header}>
          <h2 style={styles.welcome}>Manajemen Karyawan</h2>
          <div style={styles.headerRight}>
            <div style={styles.dateBox} onClick={() => alert("Kalender")}><Icon name="calendar" /> {currentDate}</div>
            <div style={styles.notifBtn}><Icon name="bell" /><span style={styles.notifBadge}>3</span></div>
            <div style={styles.topAvatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </header>

        <div style={styles.statsRow}>
          <StatCard label="Total Karyawan" val={allKaryawan.length.toString()} color="#e0f2fe" iColor="#0ea5e9" icon="idBadge2" growth="8.5%" />
          <StatCard label="Kasir" val={allKaryawan.filter(k => k.role === "Kasir").length.toString()} color="#dcfce7" iColor="#22c55e" icon="moneybag" growth="2.1%" />
          <StatCard label="Staff Laundry" val={allKaryawan.filter(k => k.role === "Staff Laundry").length.toString()} color="#f3e8ff" iColor="#a855f7" icon="tshirt" growth="5.3%" />
          <StatCard label="Delivery" val={allKaryawan.filter(k => k.role === "Delivery").length.toString()} color="#ffedd5" iColor="#f97316" icon="car" growth="1.2%" />
        </div>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Data Karyawan</h3>
            <div style={styles.actionButtons}>
              <input placeholder="Cari karyawan..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.search} />
              <button style={styles.btnAdd} onClick={() => setShowModal(true)}>+ Tambah Karyawan</button>
            </div>
          </div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>No</th>
                <th style={styles.th}>Nama</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>No. Telepon</th>
                <th style={styles.th}>Total Order</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedKaryawan.map((k, idx) => (
                <KaryawanRow key={k.id} no={(currentPage - 1) * itemsPerPage + idx + 1} name={k.name} role={k.role} phone={k.phone} order={k.order} status={k.status} onEdit={() => handleEditKaryawan(k)} onDelete={() => handleDeleteKaryawan(k.id)} />
              ))}
            </tbody>
          </table>
          <div style={styles.pagination}>
            <span onClick={() => goToPage(currentPage - 1)} style={{cursor: currentPage > 1 ? "pointer" : "default", opacity: currentPage > 1 ? 1 : 0.5}}>‹</span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <span key={page} onClick={() => goToPage(page)} style={page === currentPage ? styles.pageActive : {cursor: "pointer"}}>{page}</span>
            ))}
            <span onClick={() => goToPage(currentPage + 1)} style={{cursor: currentPage < totalPages ? "pointer" : "default", opacity: currentPage < totalPages ? 1 : 0.5}}>›</span>
          </div>
        </section>
      </main>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => { setShowModal(false); setEditingKaryawan(null); }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Tambah Karyawan</h3>
            <input style={styles.modalInput} placeholder="Nama Karyawan" value={newKaryawan.name} onChange={(e) => setNewKaryawan({...newKaryawan, name: e.target.value})} />
            <select style={styles.modalInput} value={newKaryawan.role} onChange={(e) => setNewKaryawan({...newKaryawan, role: e.target.value})}>
              <option value="Admin">Admin</option>
              <option value="Kasir">Kasir</option>
              <option value="Staff Laundry">Staff Laundry</option>
              <option value="Delivery">Delivery</option>
            </select>
            <input style={styles.modalInput} placeholder="Nomor HP" value={newKaryawan.phone} onChange={(e) => setNewKaryawan({...newKaryawan, phone: e.target.value})} />
            <div style={styles.modalButtons}>
              <button style={styles.modalCancel} onClick={() => { setShowModal(false); setEditingKaryawan(null); }}>Batal</button>
              <button style={styles.modalSave} onClick={handleTambahKaryawan}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavItem = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Icon name={icon} /> {label}
  </div>
);

const StatCard = ({ label, val, color, iColor, icon, growth }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIcon, backgroundColor: color, color: iColor }}><Icon name={icon} size={24} /></div>
    <div style={{ marginLeft: 16 }}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800 }}>{val}</div>
      <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 700 }}>▲ {growth} <span style={{color: '#94a3b8', fontWeight: 400}}>dari bulan lalu</span></div>
    </div>
  </div>
);

function getRoleBadge(role) {
  if (role === "Admin") return { padding: "4px 10px", borderRadius: 8, background: "#eff6ff", color: "#3b82f6", fontSize: 10, fontWeight: 800 };
  if (role === "Kasir") return { padding: "4px 10px", borderRadius: 8, background: "#ecfdf5", color: "#10b981", fontSize: 10, fontWeight: 800 };
  if (role === "Staff Laundry") return { padding: "4px 10px", borderRadius: 8, background: "#f5f3ff", color: "#8b5cf6", fontSize: 10, fontWeight: 800 };
  return { padding: "4px 10px", borderRadius: 8, background: "#fff7ed", color: "#f97316", fontSize: 10, fontWeight: 800 };
}

function getStatusBadge(status) {
  if (status === "Aktif") return { color: "#22c55e", fontWeight: 800, padding: "4px 8px", background: "#f0fdf4", borderRadius: 6 };
  return { color: "#f97316", fontWeight: 800, padding: "4px 8px", background: "#fff7ed", borderRadius: 6 };
}

const KaryawanRow = ({ no, name, role, phone, order, status, onEdit, onDelete }) => (
  <tr style={styles.tr}>
    <td style={styles.td}>{no}</td>
    <td style={styles.td}><Icon name="user" /> {name}</td>
    <td style={styles.td}><span style={getRoleBadge(role)}>{role}</span></td>
    <td style={styles.td}>{phone}</td>
    <td style={styles.td}>{order}</td>
    <td style={styles.td}><span style={getStatusBadge(status)}>{status}</span></td>
    <td style={styles.td}>
      <button style={styles.actionBtn} onClick={onEdit}><Icon name="edit" /></button>
      <button style={styles.deleteBtn} onClick={onDelete}><Icon name="trash" /></button>
    </td>
  </tr>
);

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
  topAvatar: { width: 40, height: 40, background: "#cbd5e1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  statsRow: { display: "flex", gap: 20, marginBottom: 25 },
  statCard: { flex: 1, background: "#fff", padding: "20px", borderRadius: 24, display: "flex", alignItems: "center", border: "1px solid #e2e8f0" },
  statIcon: { width: 48, height: 48, borderRadius: 14, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20 },
  card: { background: "#fff", padding: "25px", borderRadius: 28, border: "1px solid #e2e8f0", minWidth: 0 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 600, margin: 0 },
  actionButtons: { display: "flex", gap: 12 },
  search: { padding: "10px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, width: 200 },
  btnAdd: { background: "#3b82f6", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 12, fontWeight: 700, fontSize: 12, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { borderBottom: "1px solid #f8fafc" },
  th: { textAlign: "left", padding: "12px 15px", color: "#94a3b8", fontSize: 12, fontWeight: 600 },
  td: { padding: "15px", fontSize: 13, borderBottom: "1px solid #f8fafc", fontWeight: 500 },
  tr: { borderBottom: "1px solid #f8fafc" },
  pagination: { display: "flex", justifyContent: "center", gap: 12, marginTop: 20, alignItems: "center", color: "#94a3b8", fontSize: 12 },
  pageActive: { width: 28, height: 28, background: "#3b82f6", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 8, fontWeight: 700 },
  actionBtn: { background: "none", border: "none", cursor: "pointer", marginRight: 8, fontSize: 14 },
  deleteBtn: { background: "none", border: "none", cursor: "pointer", marginRight: 8, fontSize: 14, color: "#ef4444" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "white", borderRadius: 20, padding: 30, width: 400, display: "flex", flexDirection: "column", gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: 700, margin: 0, textAlign: "center" },
  modalInput: { padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 14 },
  modalButtons: { display: "flex", gap: 12, marginTop: 10 },
  modalCancel: { flex: 1, padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  modalSave: { flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 }
};
