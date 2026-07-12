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

export default function Pelanggan() {
  const navigate = useNavigate();
  const currentDate = formatTanggalIndonesia();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingPelanggan, setEditingPelanggan] = useState(null);
  const [newPelanggan, setNewPelanggan] = useState({ name: "", phone: "", address: "" });
  const [allPelanggan, setAllPelanggan] = useState([]);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [notifications] = useState([
    { id: 1, title: "Pelanggan Baru", message: "ACA mendaftar sebagai pelanggan", time: "5 menit lalu", read: false },
    { id: 2, title: "Pesanan Baru", message: "SINDI memesan Cuci Kiloan", time: "1 jam lalu", read: false },
    { id: 3, title: "Aktivitas", message: "Terdapat 5 pelanggan aktif hari ini", time: "3 jam lalu", read: true },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchPelanggan = async () => {
    try {
      const [ordersRes, pelRes] = await Promise.all([
        fetch(`${API}/orders`),
        fetch(`${API}/pelanggan`)
      ]);
      const ordersData = await ordersRes.json();
      const pelData = await pelRes.json();

      // Extract unique customers from orders
      const orderMap = new Map();
      (ordersData || []).forEach(o => {
        const key = (o.email || o.customer_name || "").toLowerCase();
        if (!orderMap.has(key)) {
          orderMap.set(key, {
            name: o.customer_name || "Unknown",
            email: o.email || "",
            phone: o.phone || "",
            address: o.address || "",
            order_count: 0,
            total_spent: 0,
            status: "Aktif"
          });
        }
        const c = orderMap.get(key);
        c.order_count++;
        c.total_spent += parseInt(o.total) || 0;
      });

      // Merge with pelanggan table data (pelanggan table data takes precedence)
      (pelData || []).forEach(p => {
        const key = (p.email || p.name || "").toLowerCase();
        if (orderMap.has(key)) {
          const c = orderMap.get(key);
          c.phone = p.phone || c.phone;
          c.address = p.address || c.address;
          c.status = p.status || "Aktif";
        } else {
          orderMap.set(key, {
            name: p.name,
            email: p.email || "",
            phone: p.phone || "",
            address: p.address || "",
            order_count: p.order_count || 0,
            total_spent: 0,
            status: p.status || "Aktif"
          });
        }
      });

      const combined = Array.from(orderMap.values()).map(c => ({
        ...c,
        order: c.order_count,
        email: c.email || c.name.toLowerCase().replace(/\s+/g, '') + '@gmail.com'
      }));

      setAllPelanggan(combined);
    } catch (err) {
      console.error("Gagal memuat pelanggan:", err);
    }
  };

  useEffect(() => {
    fetchPelanggan();
    const interval = setInterval(fetchPelanggan, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredPelanggan = allPelanggan.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.phone.toLowerCase().includes(search.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredPelanggan.length / itemsPerPage);
  const paginatedPelanggan = filteredPelanggan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTambahPelanggan = async () => {
    if (newPelanggan.name && newPelanggan.phone) {
      try {
        const email = newPelanggan.name.toLowerCase().replace(/\s+/g, '') + '@gmail.com';

        if (editingPelanggan) {
          const res = await fetch(`${API}/pelanggan/${editingPelanggan.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: newPelanggan.name,
              email: email,
              phone: newPelanggan.phone,
              address: newPelanggan.address,
              order_count: editingPelanggan.order_count ?? editingPelanggan.order ?? 0,
              status: editingPelanggan.status
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setEditingPelanggan(null);
          alert("Pelanggan berhasil diupdate!");
        } else {
          const res = await fetch(`${API}/pelanggan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: newPelanggan.name,
              email: email,
              phone: newPelanggan.phone,
              address: newPelanggan.address,
              order_count: 0,
              status: "Aktif"
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          alert(`Pelanggan berhasil ditambahkan!\nNama: ${newPelanggan.name}\nHP: ${newPelanggan.phone}`);
        }

        setNewPelanggan({ name: "", phone: "", address: "" });
        setShowModal(false);
        fetchPelanggan();
      } catch (err) {
        alert("Gagal menyimpan pelanggan: " + err.message);
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

  const handleEditPelanggan = (pelanggan) => {
    setEditingPelanggan(pelanggan);
    setNewPelanggan({ name: pelanggan.name, phone: pelanggan.phone, address: pelanggan.address });
    setShowModal(true);
  };

  const handleViewDetail = (pelanggan) => {
    setSelectedPelanggan(pelanggan);
    setShowDetailModal(true);
  };

  const handleDeletePelanggan = async (id) => {
    if (confirm("Yakin ingin menghapus pelanggan ini?")) {
      try {
        const res = await fetch(`${API}/pelanggan/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        alert("Pelanggan berhasil dihapus!");
        fetchPelanggan();
      } catch (err) {
        alert("Gagal menghapus pelanggan: " + err.message);
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
          <h2 style={styles.welcome}>Manajemen Pelanggan</h2>
          <div style={styles.headerRight}>
            <div style={styles.dateBox} onClick={() => alert("Kalender")}><Icon name="calendar" /> {currentDate}</div>
            <div style={styles.notifBtn} onClick={() => setShowNotifModal(true)}><Icon name="bell" />{unreadCount > 0 && <span style={styles.notifBadge}>{unreadCount}</span>}</div>
            <div style={styles.topAvatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </header>

        <div style={styles.statsRow}>
          <StatCard label="Total Pelanggan" val={allPelanggan.length.toString()} color="#f3e8ff" iColor="#a855f7" icon="users" growth="Semua" />
          <StatCard label="Pelanggan Baru" val={allPelanggan.filter(p => (p.order || 0) === 0).length.toString()} color="#dcfce7" iColor="#22c55e" icon="plus" growth="Baru" />
          <StatCard label="Aktif" val={allPelanggan.filter(p => p.status === "Aktif").length.toString()} color="#e0f2fe" iColor="#0ea5e9" icon="chartLine" growth="Aktif" />
          <StatCard label="Total Order" val={allPelanggan.reduce((s, p) => s + (p.order || 0), 0).toString()} color="#ffedd5" iColor="#f97316" icon="star" growth="Semua" />
        </div>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Data Pelanggan</h3>
            <div style={styles.actionButtons}>
              <input placeholder="Cari pelanggan..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.search} />
              <button style={styles.btnAdd} onClick={() => setShowModal(true)}>+ Tambah Pelanggan</button>
            </div>
          </div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>No</th>
                <th style={styles.th}>Nama</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>No. Telepon</th>
                <th style={styles.th}>Alamat</th>
                <th style={styles.th}>Total Order</th>
                <th style={styles.th}>Total Pengeluaran</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPelanggan.map((p, idx) => (
                <PelangganRow key={idx} no={(currentPage - 1) * itemsPerPage + idx + 1} name={p.name} email={p.email} phone={p.phone} address={p.address} order={p.order} totalSpent={p.total_spent} status={p.status} onEdit={() => handleEditPelanggan(p)} onDelete={() => handleDeletePelanggan(p.id)} onView={() => handleViewDetail(p)} />
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

      {showDetailModal && selectedPelanggan && (
        <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Detail Pelanggan</h3>
            <div style={styles.detailContent}>
              <div style={styles.detailRow}><span style={styles.detailLabel}>Nama:</span><span style={styles.detailValue}>{selectedPelanggan.name}</span></div>
              <div style={styles.detailRow}><span style={styles.detailLabel}>Email:</span><span style={styles.detailValue}>{selectedPelanggan.email}</span></div>
              <div style={styles.detailRow}><span style={styles.detailLabel}>No. Telepon:</span><span style={styles.detailValue}>{selectedPelanggan.phone}</span></div>
              <div style={styles.detailRow}><span style={styles.detailLabel}>Alamat:</span><span style={styles.detailValue}>{selectedPelanggan.address}</span></div>
              <div style={styles.detailRow}><span style={styles.detailLabel}>Total Order:</span><span style={styles.detailValue}>{selectedPelanggan.order || 0}</span></div>
              <div style={styles.detailRow}><span style={styles.detailLabel}>Total Pengeluaran:</span><span style={styles.detailValue}>Rp {(selectedPelanggan.total_spent || 0).toLocaleString('id-ID')}</span></div>
              <div style={styles.detailRow}><span style={styles.detailLabel}>Status:</span><span style={styles.detailValue}>{selectedPelanggan.status}</span></div>
            </div>
            <div style={styles.modalButtons}>
              <button style={styles.modalClose} onClick={() => setShowDetailModal(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => { setShowModal(false); setEditingPelanggan(null); }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>{editingPelanggan ? "Edit Pelanggan" : "Tambah Pelanggan"}</h3>
            <input style={styles.modalInput} placeholder="Nama Pelanggan" value={newPelanggan.name} onChange={(e) => setNewPelanggan({...newPelanggan, name: e.target.value})} />
            <input style={styles.modalInput} placeholder="Nomor HP" value={newPelanggan.phone} onChange={(e) => setNewPelanggan({...newPelanggan, phone: e.target.value})} />
            <input style={styles.modalInput} placeholder="Alamat" value={newPelanggan.address} onChange={(e) => setNewPelanggan({...newPelanggan, address: e.target.value})} />
            <div style={styles.modalButtons}>
              <button style={styles.modalCancel} onClick={() => { setShowModal(false); setEditingPelanggan(null); }}>Batal</button>
              <button style={styles.modalSave} onClick={handleTambahPelanggan}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showNotifModal && (
        <div style={styles.modalOverlay} onClick={() => setShowNotifModal(false)}>
          <div style={styles.notifModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.notifHeader}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Notifikasi</h3>
              <button onClick={() => setShowNotifModal(false)} style={styles.closeBtn}><Icon name="x" /></button>
            </div>
            <div style={styles.notifList}>
              {notifications.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Tidak ada notifikasi</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{ ...styles.notifItem, ...(n.read ? {} : { background: "#f0f7ff" }) }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{n.message}</div>
                      </div>
                      {!n.read && <span style={styles.notifDot} />}
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>{n.time}</div>
                  </div>
                ))
              )}
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

function toTitleCase(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function getStatusBadge(status) {
  if (status === "Aktif") return { color: "#22c55e", fontWeight: 800, padding: "4px 8px", background: "#f0fdf4", borderRadius: 6 };
  return { color: "#94a3b8", fontWeight: 800, padding: "4px 8px", background: "#f1f5f9", borderRadius: 6 };
}

const PelangganRow = ({ no, name, email, phone, address, order, totalSpent, status, onEdit, onDelete, onView }) => (
  <tr style={styles.tr}>
    <td style={styles.td}>{no}</td>
    <td style={styles.td}><Icon name="user" /> {toTitleCase(name)}</td>
    <td style={styles.td}><span style={{ fontSize: 11, color: "#3b82f6" }}><Icon name="mail" /> {email}</span></td>
    <td style={styles.td}>{phone}</td>
    <td style={styles.td}>{address}</td>
    <td style={styles.td}>{order}</td>
    <td style={styles.td}>Rp {(totalSpent || 0).toLocaleString('id-ID')}</td>
    <td style={styles.td}><span style={getStatusBadge(status)}>{status}</span></td>
    <td style={styles.td}>
      <button style={styles.actionBtn} onClick={onView} title="Lihat Detail"><Icon name="eye" /></button>
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
  modalSave: { flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 },
  notifModal: { background: "white", borderRadius: 16, width: 380, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" },
  notifHeader: { padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: 0, lineHeight: 1 },
  notifList: { overflow: "auto", maxHeight: 400 },
  notifItem: { padding: "14px 20px", borderBottom: "1px solid #f1f5f9", cursor: "pointer" },
  notifDot: { width: 8, height: 8, background: "#3b82f6", borderRadius: "50%", flexShrink: 0 },
  detailContent: { display: "flex", flexDirection: "column", gap: 12 },
  detailRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" },
  detailLabel: { color: "#64748b", fontSize: 13 },
  detailValue: { fontWeight: 700, fontSize: 13 },
  modalClose: { flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 }
};
