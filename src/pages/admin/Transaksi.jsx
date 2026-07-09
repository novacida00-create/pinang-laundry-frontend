import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../../utils/icons.jsx";

const formatTanggalIndonesia = () => {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const today = new Date();
  return `${today.getDate()} ${bulan[today.getMonth()]} ${today.getFullYear()}, ${hari[today.getDay()]}`;
};

const formatRupiah = (num) => {
  return "Rp " + (parseInt(num) || 0).toLocaleString("id-ID");
};

export default function Transaksi() {
  const navigate = useNavigate();
  const currentDate = formatTanggalIndonesia();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("semua");
  const [orders, setOrders] = useState([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);


  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOrders(data.map((o, i) => ({ ...o, no: i + 1 })));
    } catch (e) {
      console.error("Failed to load orders:", e);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = (o.order_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name || "").toLowerCase().includes(search.toLowerCase());
    if (filterStatus === "semua") return matchSearch;
    if (filterStatus === "Lunas") return matchSearch && o.payment_status === "Lunas";
    return matchSearch && (o.payment_status !== "Lunas" || !o.payment_status);
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPendapatan = orders.filter(o => o.status === "Selesai" || o.payment_status === "Lunas")
    .reduce((sum, o) => sum + (parseInt(o.total) || 0), 0);
  const totalPendapatanHariIni = orders.filter(o => {
    if (o.status !== "Selesai" && o.payment_status !== "Lunas") return false;
    const t = new Date(o.created_at);
    const now = new Date();
    return t.toDateString() === now.toDateString();
  }).reduce((sum, o) => sum + (parseInt(o.total) || 0), 0);

  const handlePrintReceipt = (order) => {
    setReceiptOrder(order);
    setShowReceiptModal(true);
  };

  const printReceipt = () => {
    if (!receiptOrder) return;
    const pw = window.open('', '_blank');
    if (!pw) { alert("Izinkan popup untuk mencetak struk"); return; }
    const o = receiptOrder;
    pw.document.write(`
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Struk Pembayaran - ${o.order_code}</title>
<style>
  @page { margin: 10mm; size: 80mm auto; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; font-size: 12px; color: #000; padding: 10px; }
  .header { text-align: center; margin-bottom: 12px; }
  .header h2 { font-size: 16px; margin-bottom: 2px; }
  .header p { font-size: 10px; color: #555; }
  .divider { border-top: 1px dashed #000; margin: 8px 0; }
  .info { margin-bottom: 8px; }
  .info div { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px; }
  .items { margin-bottom: 8px; }
  .items th { text-align: left; font-size: 10px; padding: 4px 0; border-bottom: 1px solid #000; }
  .items td { font-size: 11px; padding: 4px 0; }
  .total { margin: 8px 0; }
  .total div { display: flex; justify-content: space-between; font-size: 12px; }
  .grand-total { font-size: 14px; font-weight: bold; border-top: 2px solid #000; padding-top: 6px; margin-top: 6px; }
  .footer { text-align: center; margin-top: 16px; font-size: 10px; color: #555; }
  .status { text-align: center; margin: 10px 0; }
  .status span { padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; }
  .lunas { background: #d1fae5; color: #065f46; }
  .belum { background: #fef3c7; color: #92400e; }
</style></head><body>
  <div class="header">
    <h2>PINANG LAUNDRY</h2>
    <p>Bersih, Cepat, Terpercaya</p>
    <p>Jl. Pinang Raya, Margonda Depok</p>
  </div>
  <div class="divider"></div>
  <div class="info">
    <div><span>Invoice</span><span>${o.order_code}</span></div>
    <div><span>Tanggal</span><span>${new Date(o.created_at).toLocaleDateString('id-ID')}</span></div>
    <div><span>Pelanggan</span><span>${o.customer_name}</span></div>
    <div><span>Telepon</span><span>${o.phone || "-"}</span></div>
    <div><span>Layanan</span><span>${o.service_name}</span></div>
    <div><span>Berat</span><span>${o.weight} kg</span></div>
    ${o.delivery_mode ? `<div><span>Pengiriman</span><span>${o.delivery_mode === "kurir" ? "Antar-Jemput" : "Antar Mandiri"}</span></div>` : ""}
    <div><span>Pembayaran</span><span>${o.payment === "qris" ? "QRIS" : o.payment === "cash" ? "TUNAI" : o.payment ? o.payment : "-"}</span></div>
    ${o.ongkir ? `<div><span>Ongkir</span><span>${formatRupiah(o.ongkir)}</span></div>` : ""}
  </div>
  <div class="divider"></div>
  <div class="total">
    <div><span>Total</span><span>${formatRupiah(o.total)}</span></div>
    <div class="grand-total"><span>Bayar</span><span>${formatRupiah(o.total)}</span></div>
  </div>
  <div class="status">
    <span class="${o.payment_status === "Lunas" ? "lunas" : "belum"}">${o.payment_status === "Lunas" ? "LUNAS" : "BELUM LUNAS"}</span>
  </div>
  <div class="divider"></div>
  <div class="footer">
    <p>Terima kasih telah menggunakan layanan kami!</p>
    <p>${currentDate}</p>
  </div>
  <script>window.print()</script>
</body></html>`);
    pw.document.close();
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
            <NavLink to="/admin" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}><NavItem icon="dashboard" label="Dashboard" /></NavLink>
            <NavLink to="/orderan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}><NavItem icon="receipt" label="Orderan" /></NavLink>
            <NavLink to="/pelanggan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}><NavItem icon="users" label="Pelanggan" /></NavLink>
            <div style={{ ...styles.navItem, background: "#3b82f6", color: "#fff", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}><NavItem icon="creditCard" label="Transaksi" /></div>
            <NavLink to="/karyawan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}><NavItem icon="idBadge2" label="Karyawan" /></NavLink>
            <NavLink to="/admin/layanan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}><NavItem icon="tag" label="Layanan" /></NavLink>
            <NavLink to="/laporan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}><NavItem icon="chartBar" label="Laporan" /></NavLink>
            <NavLink to="/pengaturan" style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}><NavItem icon="settings" label="Pengaturan" /></NavLink>
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
          <h2 style={styles.welcome}>Transaksi Customer</h2>
          <div style={styles.headerRight}>
            <div style={styles.dateBox}><Icon name="calendar" /> {currentDate}</div>
            <div style={styles.topAvatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </header>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: "#e0f2fe", color: "#0ea5e9" }}><Icon name="moneybag" /></div>
            <div style={{ marginLeft: 16 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>Total Pendapatan</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{formatRupiah(totalPendapatan)}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: "#dcfce7", color: "#22c55e" }}><Icon name="calendar" /></div>
            <div style={{ marginLeft: 16 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>Pendapatan Hari Ini</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{formatRupiah(totalPendapatanHariIni)}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: "#f3e8ff", color: "#a855f7" }}><Icon name="clipboard" /></div>
            <div style={{ marginLeft: 16 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>Total Transaksi</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{orders.length}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: "#ffedd5", color: "#f97316" }}><Icon name="check" /></div>
            <div style={{ marginLeft: 16 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>Lunas</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{orders.filter(o => o.payment_status === "Lunas").length}</div>
            </div>
          </div>
        </div>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Riwayat Transaksi</h3>
            <div style={styles.actionButtons}>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.filterSelect}>
                <option value="semua">Semua Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Belum">Belum Lunas</option>
              </select>
              <input placeholder="Cari invoice / pelanggan..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.search} />
            </div>
          </div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Invoice</th>
                <th style={styles.th}>Pelanggan</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Metode Bayar</th>
                <th style={styles.th}>Status Bayar</th>
                <th style={styles.th}>Tanggal</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((o) => {
                return (
                  <tr key={o.id || o.no} style={styles.tr}>
                    <td style={styles.td}><span style={styles.invoiceCode}>{o.order_code || "-"}</span></td>
                    <td style={styles.td}><Icon name="user" /> {o.customer_name}</td>
                    <td style={styles.td}><span style={styles.totalPrice}>{formatRupiah(o.total)}</span></td>
                    <td style={styles.td}>
                      {o.payment === "qris" ? <span style={styles.badgeQRIS}>QRIS</span> :
                       o.payment === "cash" ? <span style={styles.badgeCash}>Tunai</span> :
                       <span style={styles.badgePending}>-</span>}
                    </td>
                    <td style={styles.td}>
                      <span style={o.payment_status === "Lunas" ? styles.badgeCash : styles.badgePending}>
                        {o.payment_status === "Lunas" ? <><Icon name="check" /> Lunas</> : <><Icon name="hourglass" /> Belum</>}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontSize: 11, color: "#64748b" }}>{o.created_at ? new Date(o.created_at).toLocaleDateString('id-ID') : "-"}</td>
                    <td style={styles.td}>
                      <button style={styles.printBtn} onClick={() => handlePrintReceipt(o)} title="Cetak Struk"><Icon name="printer" /></button>
                    </td>
                  </tr>
                );
              })}
              {paginatedOrders.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 13 }}>Belum ada transaksi</td></tr>
              )}
            </tbody>
          </table>
          <div style={styles.pagination}>
            <span onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} style={{cursor: currentPage > 1 ? "pointer" : "default", opacity: currentPage > 1 ? 1 : 0.5}}>‹</span>
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(page => (
              <span key={page} onClick={() => setCurrentPage(page)} style={page === currentPage ? styles.pageActive : {cursor: "pointer"}}>{page}</span>
            ))}
            <span onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} style={{cursor: currentPage < totalPages ? "pointer" : "default", opacity: currentPage < totalPages ? 1 : 0.5}}>›</span>
          </div>
        </section>
      </main>

      {showReceiptModal && receiptOrder && (
        <div style={styles.modalOverlay} onClick={() => setShowReceiptModal(false)}>
          <div style={styles.receiptModal} onClick={e => e.stopPropagation()}>
            <div style={styles.receiptHeader}>
              <h3 style={{ margin: 0 }}><Icon name="receipt" /> Struk Pembayaran</h3>
              <button style={styles.closeBtn} onClick={() => setShowReceiptModal(false)}><Icon name="x" /></button>
            </div>
            <div style={styles.receiptBody}>
              <div style={styles.receiptInfo}>
                <div style={styles.receiptRow}><span>Invoice</span><span style={{ fontWeight: 700 }}>{receiptOrder.order_code}</span></div>
                <div style={styles.receiptRow}><span>Tanggal</span><span>{new Date(receiptOrder.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                <div style={styles.receiptRow}><span>Pelanggan</span><span>{receiptOrder.customer_name}</span></div>
                <div style={styles.receiptRow}><span>Telepon</span><span>{receiptOrder.phone || "-"}</span></div>
                <div style={styles.divider}></div>
                <div style={styles.receiptRow}><span>Layanan</span><span>{receiptOrder.service_name}</span></div>
                <div style={styles.receiptRow}><span>Berat</span><span>{receiptOrder.weight} kg</span></div>
                {receiptOrder.delivery_mode && <div style={styles.receiptRow}><span>Pengiriman</span><span>{receiptOrder.delivery_mode === "kurir" ? "Antar-Jemput Kurir" : "Antar Mandiri"}</span></div>}
                {receiptOrder.ongkir ? <div style={styles.receiptRow}><span>Ongkos Kirim</span><span>{formatRupiah(receiptOrder.ongkir)}</span></div> : null}
                <div style={styles.divider}></div>
                <div style={{ ...styles.receiptRow, fontWeight: 800, fontSize: 16 }}><span>Total Bayar</span><span style={{ color: "#059669" }}>{formatRupiah(receiptOrder.total)}</span></div>
                <div style={styles.receiptRow}><span>Pembayaran</span><span style={{ fontWeight: 700, color: receiptOrder.payment === "qris" ? "#7c3aed" : receiptOrder.payment === "cash" ? "#065f46" : "#94a3b8" }}>{receiptOrder.payment === "qris" ? <><Icon name="creditCard" /> QRIS</> : receiptOrder.payment === "cash" ? <><Icon name="currencyDollar" /> Tunai</> : "-"}</span></div>
                <div style={styles.receiptRow}>
                  <span>Status</span>
                  <span style={{ color: receiptOrder.payment_status === "Lunas" ? "#22c55e" : "#f59e0b", fontWeight: 700 }}>
                    {receiptOrder.payment_status === "Lunas" ? <><Icon name="check" /> Lunas</> : <><Icon name="hourglass" /> Belum Lunas</>}
                  </span>
                </div>
              </div>
            </div>
            <div style={styles.receiptFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowReceiptModal(false)}>Tutup</button>
              <button style={styles.printReceiptBtn} onClick={printReceipt}><Icon name="printer" /> Cetak Struk</button>
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
  topAvatar: { width: 40, height: 40, background: "#cbd5e1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  statsRow: { display: "flex", gap: 20, marginBottom: 25 },
  statCard: { flex: 1, background: "#fff", padding: "20px", borderRadius: 24, display: "flex", alignItems: "center", border: "1px solid #e2e8f0" },
  statIcon: { width: 48, height: 48, borderRadius: 14, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20 },
  card: { background: "#fff", padding: "25px", borderRadius: 28, border: "1px solid #e2e8f0", minWidth: 0 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 600, margin: 0 },
  actionButtons: { display: "flex", gap: 12 },
  search: { padding: "10px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, width: 220 },
  filterSelect: { padding: "10px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, background: "#fff", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { borderBottom: "1px solid #f8fafc" },
  th: { textAlign: "left", padding: "12px 15px", color: "#94a3b8", fontSize: 12, fontWeight: 600 },
  td: { padding: "15px", fontSize: 13, borderBottom: "1px solid #f8fafc", fontWeight: 500 },
  tr: { borderBottom: "1px solid #f8fafc" },
  invoiceCode: { padding: "4px 8px", background: "#f1f5f9", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: "monospace" },
  totalPrice: { color: "#059669", fontWeight: 800 },
  statusBadge: { padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 800, display: "inline-block" },
  badgeQRIS: { padding: "4px 8px", borderRadius: 6, background: "#f3e8ff", color: "#7c3aed", fontSize: 10, fontWeight: 800 },
  badgeCash: { padding: "4px 8px", borderRadius: 6, background: "#d1fae5", color: "#065f46", fontSize: 10, fontWeight: 800 },
  badgePending: { padding: "4px 8px", borderRadius: 6, background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 800 },
  pagination: { display: "flex", justifyContent: "center", gap: 12, marginTop: 20, alignItems: "center", color: "#94a3b8", fontSize: 12 },
  pageActive: { width: 28, height: 28, background: "#3b82f6", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 8, fontWeight: 700 },
  printBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: "4px 8px", borderRadius: 8, transition: "all 0.2s" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  receiptModal: { background: "#fff", borderRadius: 20, width: 420, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" },
  receiptHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #e2e8f0" },
  closeBtn: { width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f1f5f9", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" },
  receiptBody: { padding: "20px 24px" },
  receiptInfo: { display: "flex", flexDirection: "column", gap: 10 },
  receiptRow: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 },
  divider: { height: 1, background: "#e2e8f0", margin: "4px 0" },
  receiptFooter: { display: "flex", gap: 12, padding: "16px 24px", borderTop: "1px solid #e2e8f0" },
  cancelBtn: { flex: 1, padding: 12, borderRadius: 12, border: "2px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#64748b" },
  printReceiptBtn: { flex: 1, padding: 12, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 },
};
