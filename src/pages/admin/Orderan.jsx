import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { sendWa, formatRupiah } from "../../utils/waNotif.js";
import Icon from "../../utils/icons.jsx";

const formatTanggalIndonesia = () => {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const today = new Date();
  return `${today.getDate()} ${bulan[today.getMonth()]} ${today.getFullYear()}, ${hari[today.getDay()]}`;
};

export default function Orderan() {
  const navigate = useNavigate();
  const currentDate = formatTanggalIndonesia();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({ name: "", layanan: "Cuci Kiloan", berat: "", total: "" });
  
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ baru: 0, proses: 0, selesai: 0, total: 0 });


  useEffect(() => {
    // Update stats whenever orders change
    setStats({
      baru: orders.filter(o => o.status === "Menunggu").length,
      proses: orders.filter(o => o.status === "Diproses").length,
      selesai: orders.filter(o => o.status === "Selesai").length,
      total: orders.length
    });
  }, [orders]);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOrders(data.map((o, index) => ({ ...o, no: index + 1 })));
    } catch (e) {
      console.error("Failed to load orders:", e);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await loadOrders();
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const handleSendWa = async (order) => {
    if (!order.phone) { alert("No. HP pelanggan tidak tersedia"); return; }
    let settings = {};
    try { const r = await fetch("/api/pengaturan"); settings = await r.json(); } catch {}
    if (!settings.fonnteToken) { alert("Isi token Fonnte di halaman Pengaturan!"); return; }
    const cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const target = cleanPhone.startsWith("62") ? cleanPhone : "62" + cleanPhone.replace(/^0+/, "");
    const result = await sendWa(target,
`*Laundry Selesai!*
Halo *${order.customer_name}*,

Laundry Anda sudah selesai dan siap diambil!

*Invoice:* ${order.order_code}
*Layanan:* ${order.service_name}
*Berat:* ${order.weight} kg
*Total:* ${formatRupiah(order.total)}

Silakan ambil di:
${settings.alamat || "Pinang Laundry"}
${settings.jamBuka || "07:00"} - ${settings.jamTutup || "21:00"}

Terima kasih telah menggunakan layanan kami!
`);
    if (result && result.ok) {
      alert("Notifikasi WA berhasil dikirim ke " + order.customer_name);
    } else {
      alert("WA gagal: " + (result?.error || "unknown error"));
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name.toLowerCase().includes(search.toLowerCase()) || 
    o.service_name.toLowerCase().includes(search.toLowerCase()) ||
    (o.order_code && o.order_code.toLowerCase().includes(search.toLowerCase()))
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (order, newStatus) => {
    await updateOrderStatus(order.id, newStatus);
    alert(`Status ${order.order_code} menjadi: ${newStatus}`);
    if (newStatus === "Diproses" && order.phone) {
      try {
        const r = await fetch("/api/pengaturan");
        const s = await r.json();
        if (s.waNotif && s.fonnteToken) {
          const cleanPhone = order.phone.replace(/[^0-9]/g, "");
          const target = cleanPhone.startsWith("62") ? cleanPhone : "62" + cleanPhone.replace(/^0+/, "");
          await sendWa(target,
`*Pesanan Diproses - Pinang Laundry*
Halo *${order.customer_name}*,

Pesanan Anda sedang diproses!

*Invoice:* ${order.order_code}
*Layanan:* ${order.service_name}
*Berat:* ${order.weight} kg
*Total:* ${formatRupiah(order.total)}

Estimasi selesai: sesuai layanan yang dipilih.
Terima kasih telah menunggu!`
          );
        }
      } catch {}
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

      {/* MAIN CONTENT */}
      <main className="admin-main" style={styles.main}>
        <label htmlFor="mt" className="mt-l"><Icon name="menu2" /></label>
        <header style={styles.header}>
          <h2 style={styles.welcome}>Manajemen Orderan</h2>
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
          <StatCard label="Pesanan Baru" val={stats.baru.toString()} color="#e0f2fe" iColor="#0ea5e9" icon="package" growth=" Baru" />
          <StatCard label="Diproses" val={stats.proses.toString()} color="#dcfce7" iColor="#22c55e" icon="settings" growth=" Proses" />
          <StatCard label="Selesai" val={stats.selesai.toString()} color="#f3e8ff" iColor="#a855f7" icon="check" growth=" Selesai" />
          <StatCard label="Total Pesanan" val={stats.total.toString()} color="#ffedd5" iColor="#f97316" icon="shirt" growth="Semua" />
        </div>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Pesanan Pelanggan</h3>
            <div style={styles.actionButtons}>
              <input 
                placeholder="Cari pesanan..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.search} 
              />
            </div>
          </div>
          {orders.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}><Icon name="clipboard" /></div>
              <p>Belum ada pesanan dari pelanggan</p>
              <p style={styles.emptyHint}>Pelanggan akan membuat pesanan dari halaman customer</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>No</th>
                  <th style={styles.th}>Kode Pesanan</th>
                  <th style={styles.th}>Pelanggan</th>
                  <th style={styles.th}>Layanan</th>
                  <th style={styles.th}>Berat</th>
                  <th style={styles.th}>Tanggal</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((t) => (
                  <OrderRow 
                    key={t.id} 
                    no={t.no} 
                    orderCode={t.order_code || "-"}
                    name={t.customer_name} 
                    layanan={t.service_name} 
                    berat={t.weight + " kg"} 
                    tanggal={t.created_at ? new Date(t.created_at).toLocaleDateString('id-ID') : "-"}
                    status={t.status}
                    delivery={t.delivery_mode}
                    onView={() => handleViewDetail(t)}
                    onStatusChange={(status) => handleUpdateStatus(t, status)}
                    onSendWa={() => handleSendWa(t)}
                    status={t.status}
                  />
                ))}
              </tbody>
            </table>
          )}
          {orders.length > 0 && (
            <div style={styles.pagination}>
              <span onClick={() => goToPage(currentPage - 1)} style={{cursor: currentPage > 1 ? "pointer" : "default", opacity: currentPage > 1 ? 1 : 0.5}}>‹</span>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <span 
                  key={page}
                  onClick={() => goToPage(page)} 
                  style={page === currentPage ? styles.pageActive : {cursor: "pointer"}}
                >
                  {page}
                </span>
              ))}
              <span onClick={() => goToPage(currentPage + 1)} style={{cursor: currentPage < totalPages ? "pointer" : "default", opacity: currentPage < totalPages ? 1 : 0.5}}>›</span>
            </div>
          )}
        </section>

        {/* MODAL DETAIL PESANAN */}
        {showDetailModal && selectedOrder && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Detail Pesanan</h3>
              <div style={styles.detailContent}>
                <div style={styles.detailRow}><span style={styles.detailLabel}>Kode Pesanan:</span><span style={styles.detailValue}>{selectedOrder.order_code}</span></div>
                <div style={styles.detailRow}><span style={styles.detailLabel}>Pelanggan:</span><span style={styles.detailValue}>{selectedOrder.customer_name}</span></div>
                <div style={styles.detailRow}><span style={styles.detailLabel}>Layanan:</span><span style={styles.detailValue}>{selectedOrder.service_name}</span></div>
                <div style={styles.detailRow}><span style={styles.detailLabel}>Berat/Jumlah:</span><span style={styles.detailValue}>{selectedOrder.weight} kg</span></div>
                <div style={styles.detailRow}><span style={styles.detailLabel}>Total:</span><span style={styles.detailValueBold}>Rp {selectedOrder.total?.toLocaleString('id-ID')}</span></div>
                <div style={styles.detailRow}><span style={styles.detailLabel}>No. Telepon:</span><span style={styles.detailValue}>{selectedOrder.phone}</span></div>
                <div style={styles.detailRow}><span style={styles.detailLabel}>Alamat:</span><span style={styles.detailValue}>{selectedOrder.address}</span></div>
                {selectedOrder.delivery_mode && <div style={styles.detailRow}><span style={styles.detailLabel}>Pengiriman:</span><span style={styles.detailValue}>{selectedOrder.delivery_mode === "kurir" ? <><Icon name="truck" /> Antar-Jemput</> : <><Icon name="buildingStore" /> Antar Mandiri</>}{selectedOrder.ongkir ? ` (Ongkir: Rp ${(parseInt(selectedOrder.ongkir) || 0).toLocaleString('id-ID')})` : ""}</span></div>}
                <div style={styles.detailRow}><span style={styles.detailLabel}>Status:</span>
                   <select value={selectedOrder.status} onChange={(e) => { handleUpdateStatus(selectedOrder, e.target.value); setSelectedOrder({...selectedOrder, status: e.target.value}); }} style={styles.statusSelectLarge}>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>
              <div style={styles.modalButtons}>
                <button style={styles.modalClose} onClick={() => setShowDetailModal(false)}>Tutup</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
/* --- COMPONENTS --- */
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

function getStatusBadge(status) {
  if (status === "Selesai") return { color: "#22c55e", fontWeight: 800, padding: "4px 8px", background: "#f0fdf4", borderRadius: 6 };
  if (status === "Siap") return { color: "#a855f7", fontWeight: 800, padding: "4px 8px", background: "#f5f3ff", borderRadius: 6 };
  if (status === "Proses") return { color: "#f97316", fontWeight: 800, padding: "4px 8px", background: "#fff7ed", borderRadius: 6 };
  return { color: "#3b82f6", fontWeight: 800, padding: "4px 8px", background: "#eff6ff", borderRadius: 6 };
}

const OrderRow = ({ no, orderCode, name, layanan, berat, tanggal, status, delivery, onView, onStatusChange, onSendWa }) => (
  <tr style={styles.tr}>
    <td style={styles.td}>{no}</td>
    <td style={styles.td}><span style={styles.orderCode}>{orderCode}</span></td>
    <td style={styles.td}><Icon name="user" /> {name}</td>
    <td style={styles.td}>{layanan}</td>
    <td style={styles.td}>{berat}</td>
    <td style={{ ...styles.td, fontSize: 11, color: "#64748b" }}>{tanggal}</td>
    <td style={styles.td}>
      <select 
        value={status} 
        onChange={(e) => onStatusChange(e.target.value)}
        style={{ ...styles.statusSelect, ...getStatusBadge(status) }}
      >
        <option value="Menunggu">Menunggu</option>
        <option value="Diproses">Diproses</option>
        <option value="Selesai">Selesai</option>
      </select>
    </td>
    <td style={styles.td}>
      <button style={styles.actionBtn} onClick={onView} title="Lihat Detail"><Icon name="eye" /></button>
      {status === "Selesai" && <button style={styles.waBtn} onClick={onSendWa} title="Kirim Notifikasi WA"><Icon name="deviceMobile" /></button>}
      {delivery && <span style={{ fontSize: 10, color: "#3b82f6", marginLeft: 4 }}>{delivery === "kurir" ? <Icon name="truck" /> : <Icon name="buildingStore" />}</span>}
    </td>
  </tr>
);

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
  dateBox: { padding: "10px 15px", background: "#fff", borderRadius: 12, fontSize: 12, fontWeight: 700, border: "1px solid #f1f5f9" },
  notifBtn: { position: "relative", padding: 10, background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9" },
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
  waBtn: { background: "#22c55e", border: "none", cursor: "pointer", fontSize: 14, borderRadius: 6, padding: "4px 6px", marginRight: 4 },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "white", borderRadius: 20, padding: 30, width: 400, display: "flex", flexDirection: "column", gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: 700, margin: 0, textAlign: "center" },
  modalInput: { padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 14 },
  modalButtons: { display: "flex", gap: 12, marginTop: 10 },
  modalCancel: { flex: 1, padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  modalSave: { flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 },
  emptyState: { textAlign: "center", padding: 60, background: "#fff", borderRadius: 28, marginBottom: 24 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyHint: { color: "#94a3b8", fontSize: 13 },
  orderCode: { padding: "4px 8px", background: "#f1f5f9", borderRadius: 6, fontSize: 11, fontWeight: 700 },
  statusSelect: { padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  detailContent: { display: "flex", flexDirection: "column", gap: 12 },
  detailRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" },
  detailLabel: { color: "#64748b", fontSize: 13 },
  detailValue: { fontWeight: 700, fontSize: 13 },
  detailValueBold: { fontWeight: 800, fontSize: 16, color: "#22c55e" },
  statusSelectLarge: { padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 700 },
  modalClose: { flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 }
};