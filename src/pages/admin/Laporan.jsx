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
  return "Rp. " + parseInt(num).toLocaleString("id-ID");
};

const formatBerat = (berat, jenis) => {
  const clean = berat.toString().replace(/kg|pcs/g, "").trim();
  const unit = jenis === "Cuci Karpet" || jenis === "Cuci Baton" ? "pcs" : "kg";
  return clean + " " + unit;
};

const initialData = [];

export default function Laporan() {
  const navigate = useNavigate();
  const currentDate = formatTanggalIndonesia();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("semua");

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printPeriod, setPrintPeriod] = useState("harian");
  const [allLaporan, setAllLaporan] = useState([]);
  const [layananOptions, setLayananOptions] = useState([]);

  const loadLayanan = async () => {
    try {
      const res = await fetch("/api/layanan");
      const data = await res.json();
      if (!data.error && Array.isArray(data)) {
        setLayananOptions(data);
      }
    } catch (e) {
      console.error("Failed to load layanan:", e);
    }
  };

  const formatTanggalDariISO = (iso) => {
    const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const t = new Date(iso);
    return `${t.getDate().toString().padStart(2, "0")} ${bulan[t.getMonth()]} ${t.getFullYear()}`;
  };

  const loadData = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.error || !Array.isArray(data)) throw new Error(data.error);
      const mapped = data
        .filter(o => o.customer_name)
        .map((o, i) => ({
          no: i + 1,
          id: o.id,
          tanggal: formatTanggalDariISO(o.created_at),
          tanggalISO: o.created_at,
          pelanggan: o.customer_name,
          layanan: o.service_name || "-",
          berat: (o.weight || 0).toString(),
          harga: o.price?.toString() || "0",
          total: o.total?.toString() || "0",
          status: o.status || "Baru",
          payment_status: o.payment_status || "",
          payment: o.payment || "",
          phone: o.phone || ""
        }));
      setAllLaporan(mapped.length > 0 ? mapped : initialData);
    } catch (e) {
      console.error("Error loading data:", e);
      setAllLaporan(initialData);
    }
  };

  useEffect(() => {
    loadData();
    loadLayanan();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getDateFromString = (dateStr) => {
    const months = { "Januari": 0, "Februari": 1, "Maret": 2, "April": 3, "Mei": 4, "Juni": 5, "Juli": 6, "Agustus": 7, "September": 8, "Oktober": 9, "November": 10, "Desember": 11, "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "Jun": 5, "Jul": 6, "Agt": 7, "Sep": 8, "Okt": 9, "Nov": 10, "Des": 11 };
    const parts = dateStr.split(' ');
    const day = parseInt(parts[0]);
    const month = months[parts[1]] || 0;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  };

  const getFilteredData = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return allLaporan.filter(l => {
      const itemDate = l.tanggalISO ? new Date(l.tanggalISO) : getDateFromString(l.tanggal);
      
      if (filterPeriod === "harian") {
        return itemDate.toDateString() === today.toDateString();
      } else if (filterPeriod === "mingguan") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return itemDate >= weekAgo && itemDate <= today;
      } else if (filterPeriod === "bulanan") {
        return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
      } else if (filterPeriod === "tahunan") {
        return itemDate.getFullYear() === today.getFullYear();
      }
      return true;
    });
  };

  const filteredLaporan = getFilteredData().filter(l => 
    l.pelanggan.toLowerCase().includes(search.toLowerCase()) || 
    l.layanan.toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredLaporan.length / itemsPerPage);
  const paginatedLaporan = filteredLaporan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditClick = (data) => {
    setEditData({ ...data });
    setShowModal(true);
  };

  const handleDeleteLaporan = async (no) => {
    if (window.confirm("Yakin ingin menghapus pesanan ini?")) {
      try {
        const item = allLaporan.find(l => l.no === no);
        if (item?.id) {
          const res = await fetch(`/api/orders/${item.id}`, { method: "DELETE" });
          const result = await res.json();
          if (result.error) throw new Error(result.error);
        }
        await loadData();
        alert("Pesanan berhasil dihapus!");
      } catch (e) {
        console.error("Failed to delete pesanan:", e);
        alert("Gagal menghapus pesanan");
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editData.pelanggan || !editData.layanan || !editData.berat) {
      alert("Mohon isi semua data!");
      return;
    }
    
    try {
      const total = parseInt(editData.berat) * (parseInt(editData.harga) || 8000);
      const body = {
        customer_name: editData.pelanggan,
        service_name: editData.layanan,
        weight: parseFloat(editData.berat),
        price: parseInt(editData.harga) || 8000,
        total,
        status: editData.status,
        payment_status: editData.payment_status === "Lunas" ? "Lunas" : null,
        payment: editData.payment || null,
        paid_at: editData.status === "Selesai" ? new Date().toISOString().slice(0, 19).replace("T", " ") : null
      };

      if (editData.id) {
        const res = await fetch(`/api/orders/${editData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const result = await res.json();
        if (result.error) throw new Error(result.error);
      }

      await loadData();
      setShowModal(false);
      setEditData(null);
      alert("Data berhasil diubah!");
    } catch (e) {
      console.error("Failed to save:", e);
      alert("Gagal menyimpan data");
    }
  };

  const totalKg = filteredLaporan.reduce((sum, l) => {
    const num = parseFloat(l.berat.toString().replace(/kg|pcs/g, "").trim());
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const totalPendapatan = filteredLaporan.reduce((sum, l) => sum + (parseInt(l.total) || 0), 0);

  const totalLunas = filteredLaporan.filter(l => l.payment_status === "Lunas" || l.status === "Selesai").reduce((sum, l) => sum + (parseInt(l.total) || 0), 0);

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
          <h2 style={styles.welcome}>Laporan</h2>
          <div style={styles.headerRight}>
            <div style={styles.dateBox}><Icon name="calendar" /> {currentDate}</div>
            <div style={styles.topAvatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
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
            <div style={{ ...styles.statIcon, backgroundColor: "#dcfce7", color: "#22c55e" }}><Icon name="scale" /></div>
            <div style={{ marginLeft: 16 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>Total KG</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{totalKg} kg</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: "#fef2f2", color: "#ef4444" }}><Icon name="receipt" /></div>
            <div style={{ marginLeft: 16 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>Total Transaksi</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{filteredLaporan.length}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: "#dcfce7", color: "#22c55e" }}><Icon name="check" /></div>
            <div style={{ marginLeft: 16 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>Total Pendapatan</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#166534" }}>{formatRupiah(totalLunas)}</div>
            </div>
          </div>
        </div>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Riwayat Transaksi</h3>
            <div style={styles.actionButtons}>
              <select 
                style={styles.filterSelect} 
                value={filterPeriod} 
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <option value="semua">Semua</option>
                <option value="harian">Harian</option>
                <option value="mingguan">Mingguan</option>
                <option value="bulanan">Bulanan</option>
                <option value="tahunan">Tahunan</option>
              </select>
              <input placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.search} />
              <button style={styles.btnExport} onClick={() => setShowPrintModal(true)}><Icon name="printer" /> Cetak Laporan</button>
            </div>
          </div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>No</th>
                <th style={styles.th}>Tanggal</th>
                <th style={styles.th}>Pelanggan</th>
                <th style={styles.th}>Layanan</th>
                <th style={styles.th}>Berat</th>
                <th style={styles.th}>Harga/kg</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLaporan.map((l) => (
                <tr key={l.no} style={styles.tr}>
                  <td style={styles.td}>{l.no}</td>
                  <td style={styles.td}>{l.tanggal}</td>
                  <td style={styles.td}><Icon name="user" /> {l.pelanggan}</td>
                  <td style={styles.td}>{l.layanan}</td>
                  <td style={styles.td}>{formatBerat(l.berat, l.layanan)}</td>
                  <td style={styles.td}>{formatRupiah(l.harga)}</td>
                  <td style={styles.td}>{formatRupiah(l.total)}</td>
                  <td style={styles.td}><span style={getStatusBadge(l.status)}>{l.status}</span></td>
                  <td style={styles.td}>
                    <button 
                      type="button"
                      style={styles.actionBtn} 
                      onClick={() => handleEditClick(l)}
                    ><Icon name="edit" /> Edit</button>
                    <button 
                      type="button"
                      style={styles.deleteBtn} 
                      onClick={() => handleDeleteLaporan(l.no)}
                    ><Icon name="trash" /> Hapus</button>
                  </td>
                </tr>
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
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 20 }}>Edit Transaksi</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Pelanggan</label>
              <input style={styles.input} value={editData?.pelanggan || ""} onChange={(e) => setEditData({ ...editData, pelanggan: e.target.value })} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Layanan</label>
              <select style={styles.input} value={editData?.layanan || ""} onChange={(e) => setEditData({ ...editData, layanan: e.target.value })}>
                {layananOptions.map(s => (
                  <option key={s.id || s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Berat (angka saja)</label>
              <input style={styles.input} type="number" value={(editData?.berat?.toString() || "").replace(/kg|pcs/g, "").trim()} onChange={(e) => setEditData({ ...editData, berat: e.target.value })} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select style={styles.input} value={editData?.status || ""} onChange={(e) => {
                const newStatus = e.target.value;
                setEditData({ ...editData, status: newStatus, payment_status: newStatus === "Selesai" ? "Lunas" : editData.payment_status });
              }}>
                <option value="Baru">Baru</option>
                <option value="Proses">Proses</option>
                <option value="Siap">Siap</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Status Pembayaran</label>
              <select style={styles.input} value={editData?.payment_status || "Belum"} onChange={(e) => setEditData({ ...editData, payment_status: e.target.value })}>
                <option value="Belum">Belum Bayar</option>
                <option value="Lunas">Lunas</option>
              </select>
            </div>
            {editData?.payment_status === "Lunas" && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Metode Pembayaran</label>
                <select style={styles.input} value={editData?.payment || "cash"} onChange={(e) => setEditData({ ...editData, payment: e.target.value })}>
                  <option value="cash">Tunai</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button style={styles.modalCancel} onClick={() => setShowModal(false)}>Batal</button>
              <button style={styles.modalSave} onClick={handleSaveEdit}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showPrintModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPrintModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 20, textAlign: "center" }}>Cetak Laporan</h3>
            <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginBottom: 20 }}>Pilih periode laporan yang ingin dicetak</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { value: "harian", icon: "calendar", label: "Harian", desc: "Laporan transaksi hari ini" },
                { value: "mingguan", icon: "calendar", label: "Mingguan", desc: "Laporan transaksi 7 hari terakhir" },
                { value: "bulanan", icon: "chartBar", label: "Bulanan", desc: "Laporan transaksi bulan ini" },
                { value: "tahunan", icon: "chartLine", label: "Tahunan", desc: "Laporan transaksi tahun ini" },
              ].map(p => (
                <div
                  key={p.value}
                  onClick={() => setPrintPeriod(p.value)}
                  style={{
                    ...styles.printOption,
                    ...(printPeriod === p.value ? styles.printOptionActive : {}),
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700 }}><Icon name={p.icon} /> {p.label}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{p.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button style={styles.modalCancel} onClick={() => setShowPrintModal(false)}>Batal</button>
              <button style={styles.modalSave} onClick={() => {
                const pw = window.open('', '_blank');
                if (!pw) { alert("Izinkan popup untuk mencetak laporan"); return; }

                const bulanList = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                const formatDate = (iso) => {
                  const t = new Date(iso);
                  return `${t.getDate().toString().padStart(2, "0")} ${bulanList[t.getMonth()]} ${t.getFullYear()}`;
                };

                const printData = filteredLaporan;
                const totalTransaksi = printData.length;
                const totalKg = printData.reduce((sum, l) => {
                  const num = parseFloat(l.berat.toString().replace(/kg|pcs/g, "").trim());
                  return sum + (isNaN(num) ? 0 : num);
                }, 0);
                const totalLunasPeriod = printData.filter(l => l.payment_status === "Lunas" || l.status === "Selesai").reduce((sum, l) => sum + (parseInt(l.total) || 0), 0);

                const label = { harian: "Harian", mingguan: "Mingguan", bulanan: "Bulanan", tahunan: "Tahunan" }[printPeriod] || "Semua";
                setShowPrintModal(false);

                pw.document.write(`
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Laporan - Pinang Laundry</title>
<style>
  @page { margin: 20mm 15mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 0; }
  .header { text-align: center; padding-bottom: 20px; border-bottom: 3px double #1e40af; margin-bottom: 24px; }
  .header h1 { font-size: 22px; color: #1e40af; margin-bottom: 4px; }
  .header p { color: #64748b; font-size: 12px; }
  .header .brand { font-size: 36px; }
  .periode { text-align: center; color: #3b82f6; font-weight: 700; font-size: 14px; margin-bottom: 20px; }
  .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; color: #64748b; }
  .summary { background: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 24px; display: flex; justify-content: space-around; text-align: center; }
  .summary-item .val { font-size: 18px; font-weight: 800; color: #1e40af; }
  .summary-item .lbl { font-size: 11px; color: #64748b; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead th { background: #1e40af; color: #fff; padding: 10px 8px; font-size: 11px; text-align: left; letter-spacing: 0.5px; text-transform: uppercase; }
  thead th:first-child { border-radius: 6px 0 0 0; }
  thead th:last-child { border-radius: 0 6px 0 0; }
  tbody td { padding: 8px; font-size: 12px; border-bottom: 1px solid #e2e8f0; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  tbody tr:last-child td { border-bottom: 2px solid #1e40af; }
  .total-section { text-align: right; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin-bottom: 24px; }
  .total-section .label { font-size: 14px; color: #64748b; }
  .total-section .amount { font-size: 22px; font-weight: 800; color: #166534; }
  .footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; }
  .ttd { display: flex; justify-content: flex-end; margin-top: 40px; }
  .ttd-box { text-align: center; width: 200px; }
  .ttd-box .line { border-top: 1px solid #1e293b; margin-top: 60px; padding-top: 8px; font-size: 12px; font-weight: 700; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
  <div class="header">
    <div class="brand">🧺</div>
    <h1>PINANG LAUNDRY</h1>
    <p>Bersih, Cepat, Terpercaya — Jl. Pinang Raya, Margonda Depok</p>
  </div>
  <div class="periode">📊 LAPORAN TRANSAKSI — PERIODE ${label.toUpperCase()}</div>
  <div class="info-row">
    <span>Tanggal Cetak: ${currentDate}</span>
    <span>Jenis Laporan: ${label}</span>
  </div>
  <div class="summary">
    <div class="summary-item"><div class="val">${totalTransaksi}</div><div class="lbl">Total Transaksi</div></div>
    <div class="summary-item"><div class="val">${totalKg.toFixed(1)} kg</div><div class="lbl">Total Berat</div></div>
    <div class="summary-item"><div class="val">Rp ${totalLunasPeriod.toLocaleString('id-ID')}</div><div class="lbl">Total Pendapatan</div></div>
    <div class="summary-item"><div class="val">${printData.filter(l => l.status === "Selesai").length}</div><div class="lbl">Selesai</div></div>
  </div>
  <table>
    <thead><tr><th>No</th><th>Tanggal</th><th>Pelanggan</th><th>Layanan</th><th>Berat</th><th>Harga</th><th>Total</th><th>Status</th></tr></thead>
    <tbody>
      ${printData.map((l, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${l.tanggal}</td>
          <td>${l.pelanggan}</td>
          <td>${l.layanan}</td>
          <td>${l.berat} kg</td>
          <td>Rp ${parseInt(l.harga).toLocaleString('id-ID')}</td>
          <td>Rp ${parseInt(l.total).toLocaleString('id-ID')}</td>
          <td>${l.status}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div class="total-section">
    <div class="label">Total Pendapatan (Lunas / Selesai)</div>
    <div class="amount">Rp ${totalLunasPeriod.toLocaleString('id-ID')}</div>
  </div>
  <div class="ttd">
    <div class="ttd-box">
      <div>Depok, ${currentDate}</div>
      <div class="line">( ____________________ )</div>
      <div>Admin</div>
    </div>
  </div>
  <div class="footer">© ${new Date().getFullYear()} Pinang Laundry — Laporan ini digenerate otomatis</div>
  <script>window.print()</script>
</body></html>`);
                pw.document.close();
              }}>Cetak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavItem = ({ icon, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <Icon name={icon} /> {label}
  </div>
);

function getStatusBadge(status) {
  if (status === "Selesai") return { color: "#22c55e", fontWeight: 800, padding: "4px 8px", background: "#f0fdf4", borderRadius: 6 };
  if (status === "Proses") return { color: "#f97316", fontWeight: 800, padding: "4px 8px", background: "#fff7ed", borderRadius: 6 };
  if (status === "Siap") return { color: "#a855f7", fontWeight: 800, padding: "4px 8px", background: "#f5f3ff", borderRadius: 6 };
  return { color: "#3b82f6", fontWeight: 800, padding: "4px 8px", background: "#eff6ff", borderRadius: 6 };
}

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
  topAvatar: { width: 40, height: 40, background: "#cbd5e1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  statsRow: { display: "flex", gap: 20, marginBottom: 25 },
  statCard: { flex: 1, background: "#fff", padding: "20px", borderRadius: 24, display: "flex", alignItems: "center", border: "1px solid #e2e8f0" },
  statIcon: { width: 48, height: 48, borderRadius: 14, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20 },
  card: { background: "#fff", padding: "25px", borderRadius: 28, border: "1px solid #e2e8f0", minWidth: 0 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 600, margin: 0 },
  actionButtons: { display: "flex", gap: 12 },
  search: { padding: "10px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, width: 200 },
  filterSelect: { padding: "10px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, background: "#fff", cursor: "pointer" },
  btnExport: { background: "#3b82f6", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 12, fontWeight: 700, fontSize: 12, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { borderBottom: "1px solid #f8fafc" },
  th: { textAlign: "left", padding: "12px 15px", color: "#94a3b8", fontSize: 12, fontWeight: 600 },
  td: { padding: "15px", fontSize: 13, borderBottom: "1px solid #f8fafc", fontWeight: 500 },
  tr: { borderBottom: "1px solid #f8fafc" },
  pagination: { display: "flex", justifyContent: "center", gap: 12, marginTop: 20, alignItems: "center", color: "#94a3b8", fontSize: 12 },
  pageActive: { width: 28, height: 28, background: "#3b82f6", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 8, fontWeight: 700 },
  actionBtn: { background: "#3b82f6", color: "white", border: "none", borderRadius: 6, padding: "8px 12px", cursor: "pointer", marginRight: 5, fontSize: 12, fontWeight: 600, display: "inline-block" },
  deleteBtn: { background: "#ef4444", color: "white", border: "none", borderRadius: 6, padding: "8px 12px", cursor: "pointer", marginRight: 5, fontSize: 12, fontWeight: 600, display: "inline-block" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "white", borderRadius: 20, padding: 30, width: 400, display: "flex", flexDirection: "column", gap: 16 },
  formGroup: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6 },
  input: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 600 },
  modalCancel: { flex: 1, padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  modalSave: { flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 },
  printOption: { padding: "14px 18px", borderRadius: 12, border: "2px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s" },
  printOptionActive: { borderColor: "#3b82f6", background: "#eff6ff" },
};
