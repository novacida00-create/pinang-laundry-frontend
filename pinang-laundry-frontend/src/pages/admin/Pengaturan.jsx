import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../../utils/icons.jsx";

const formatTanggalIndonesia = () => {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const today = new Date();
  return `${today.getDate()} ${bulan[today.getMonth()]} ${today.getFullYear()}, ${hari[today.getDay()]}`;
};

const defaultSettings = {
  namaToko: "Pinang Laundry",
  alamat: "Jl. Pinang Raya No. 123, Jakarta Selatan",
  telepon: "021-7654321",
  namaAdmin: "Alex",
  jamBuka: "07:00",
  jamTutup: "21:00",
  notifEmail: false,
  notifSMS: false,
  autoReminder: false,
  fonnteToken: "",
  waAdmin: "",
  waNotif: false
};

export default function Pengaturan() {
  const navigate = useNavigate();
  const currentDate = formatTanggalIndonesia();
  const [editingProfil, setEditingProfil] = useState(false);
  const [editingApp, setEditingApp] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const savedSettings = useRef(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/pengaturan");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSettings(data);
        savedSettings.current = data;
      } catch {
        setSettings(defaultSettings);
        savedSettings.current = defaultSettings;
      }
    };
    fetchSettings();
  }, []);

  const handleSaveProfil = async () => {
    try {
      const res = await fetch("/api/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      savedSettings.current = { ...settings };
      setEditingProfil(false);
      alert("Profil berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan profil: " + (err.message || "Unknown error"));
    }
  };

  const handleSaveApp = async () => {
    try {
      const res = await fetch("/api/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      savedSettings.current = { ...settings };
      setEditingApp(false);
      alert("Pengaturan aplikasi berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan: " + (err.message || "Unknown error"));
    }
  };

  const handleSaveWA = async () => {
    try {
      const waSettings = {
        fonnteToken: settings.fonnteToken,
        waAdmin: settings.waAdmin,
        waNotif: settings.waNotif
      };
      const res = await fetch("/api/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(waSettings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || res.statusText);
      savedSettings.current = { ...settings };
      alert("Pengaturan WhatsApp berhasil disimpan!");
    } catch (err) {
      alert("Gagal simpan WA: " + (err?.message || JSON.stringify(err) || "Error tidak diketahui"));
    }
  };

  const toggleSetting = async (key) => {
    const newVal = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newVal }));
    const label = key === 'notifEmail' ? 'Notifikasi Email' : key === 'notifSMS' ? 'Notifikasi WhatsApp' : 'Auto Reminder';
    try {
      const res = await fetch("/api/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: newVal })
      });
      if (!res.ok) throw new Error(((await res.json()).error) || res.statusText);
      savedSettings.current = { ...savedSettings.current, [key]: newVal };
    } catch (err) {
      setSettings(prev => ({ ...prev, [key]: !newVal }));
      alert("Gagal menyimpan " + label + ": " + (err?.message || JSON.stringify(err) || "Error"));
      return;
    }
    alert(label + " " + (newVal ? "diaktifkan" : "dinonaktifkan") + "!");
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
          <h2 style={styles.welcome}>Pengaturan</h2>
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

          <div style={styles.gridRow}>
            <div style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ ...styles.cardTitle, margin: 0 }}>Profil Toko</h3>
                {!editingProfil && <button style={styles.btnEdit} onClick={() => setEditingProfil(true)}><Icon name="edit" /> Edit</button>}
              </div>
              {editingProfil ? (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nama Toko</label>
                    <input 
                      style={styles.input} 
                      value={settings.namaToko}
                      onChange={(e) => handleInputChange("namaToko", e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Alamat</label>
                    <textarea 
                      style={styles.textarea}
                      value={settings.alamat}
                      onChange={(e) => handleInputChange("alamat", e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>No. Telepon</label>
                    <input 
                      style={styles.input}
                      value={settings.telepon}
                      onChange={(e) => handleInputChange("telepon", e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                    <button style={styles.btnCancel} onClick={() => { setEditingProfil(false); setSettings({...savedSettings.current}); }}>Batal</button>
                    <button style={styles.btnSave} onClick={handleSaveProfil}>Simpan</button>
                  </div>
                </>
              ) : (
                <div style={styles.infoList}>
                  <div style={styles.infoItem}><span style={styles.infoLabel}>Nama Toko</span><span style={styles.infoValue}>{settings.namaToko}</span></div>
                  <div style={styles.infoDivider} />
                  <div style={styles.infoItem}><span style={styles.infoLabel}>Alamat</span><span style={styles.infoValue}>{settings.alamat}</span></div>
                  <div style={styles.infoDivider} />
                  <div style={styles.infoItem}><span style={styles.infoLabel}>No. Telepon</span><span style={styles.infoValue}>{settings.telepon}</span></div>
                </div>
              )}
            </div>

            <div style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ ...styles.cardTitle, margin: 0 }}>Pengaturan Aplikasi</h3>
                {!editingApp && <button style={styles.btnEdit} onClick={() => setEditingApp(true)}><Icon name="edit" /> Edit</button>}
              </div>
              {editingApp ? (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nama Admin</label>
                    <input 
                      style={styles.input}
                      value={settings.namaAdmin}
                      onChange={(e) => handleInputChange("namaAdmin", e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Jam Buka</label>
                    <input 
                      style={styles.input} 
                      type="time"
                      value={settings.jamBuka}
                      onChange={(e) => handleInputChange("jamBuka", e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Jam Tutup</label>
                    <input 
                      style={styles.input} 
                      type="time"
                      value={settings.jamTutup}
                      onChange={(e) => handleInputChange("jamTutup", e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                    <button style={styles.btnCancel} onClick={() => { setEditingApp(false); setSettings({...savedSettings.current}); }}>Batal</button>
                    <button style={styles.btnSave} onClick={handleSaveApp}>Simpan</button>
                  </div>
                </>
              ) : (
                <div style={styles.infoList}>
                  <div style={styles.infoItem}><span style={styles.infoLabel}>Nama Admin</span><span style={styles.infoValue}>{settings.namaAdmin}</span></div>
                  <div style={styles.infoDivider} />
                  <div style={styles.infoItem}><span style={styles.infoLabel}>Jam Buka</span><span style={styles.infoValue}>{settings.jamBuka}</span></div>
                  <div style={styles.infoDivider} />
                  <div style={styles.infoItem}><span style={styles.infoLabel}>Jam Tutup</span><span style={styles.infoValue}>{settings.jamTutup}</span></div>
                </div>
              )}
            </div>
          </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Pengaturan Notifikasi</h3>
          <div style={styles.toggleGroup}>
            <div style={styles.toggleItem} onClick={() => toggleSetting("notifEmail")}>
              <div>
                <div style={styles.toggleLabel}>Notifikasi Email</div>
                <div style={styles.toggleDesc}>Terima notifikasi transaksi via email</div>
              </div>
              <div style={settings.notifEmail ? styles.toggleOn : styles.toggleOff}>
                {settings.notifEmail ? <Icon name="bell" /> : <Icon name="bellOff" />}
              </div>
            </div>
            <div style={styles.toggleItem} onClick={() => toggleSetting("notifSMS")}>
              <div>
                <div style={styles.toggleLabel}>Notifikasi WhatsApp</div>
                <div style={styles.toggleDesc}>Terima notifikasi via WhatsApp</div>
              </div>
              <div style={settings.notifSMS ? styles.toggleOn : styles.toggleOff}>
                {settings.notifSMS ? <Icon name="bell" /> : <Icon name="bellOff" />}
              </div>
            </div>
            <div style={styles.toggleItem} onClick={() => toggleSetting("autoReminder")}>
              <div>
                <div style={styles.toggleLabel}>Auto Reminder</div>
                <div style={styles.toggleDesc}>Pengingat otomatis ke pelanggan</div>
              </div>
              <div style={settings.autoReminder ? styles.toggleOn : styles.toggleOff}>
                {settings.autoReminder ? <Icon name="bell" /> : <Icon name="bellOff" />}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>WhatsApp Notification</h3>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 16px 0" }}>Gunakan <a href="https://fonnte.com" target="_blank" rel="noreferrer">Fonnte</a> untuk notifikasi otomatis ke pelanggan via WhatsApp.</p>
          <div style={styles.formGroup}>
            <label style={styles.label}>Fonnte Token</label>
            <input style={styles.input} type="password" value={settings.fonnteToken} onChange={(e) => handleInputChange("fonnteToken", e.target.value)} placeholder="Masukkan token Fonnte" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>No. WhatsApp Admin</label>
            <input style={styles.input} value={settings.waAdmin} onChange={(e) => handleInputChange("waAdmin", e.target.value)} placeholder="08XXXXXXXXXX" />
          </div>
          <div style={styles.toggleGroup}>
            <div style={styles.toggleItem} onClick={() => setSettings(prev => ({ ...prev, waNotif: !prev.waNotif }))}>
              <div>
                <div style={styles.toggleLabel}>Aktifkan Notifikasi WA</div>
                <div style={styles.toggleDesc}>Kirim notifikasi otomatis ke pelanggan & admin</div>
              </div>
              <div style={settings.waNotif ? styles.toggleOn : styles.toggleOff}>
                {settings.waNotif ? <Icon name="bell" /> : <Icon name="bellOff" />}
              </div>
            </div>
          </div>
          <button style={{ ...styles.btnSave, marginTop: 20 }} onClick={handleSaveWA}>Simpan Pengaturan WA</button>
        </div>
      </main>
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
  main: { flex: 1, padding: "30px 40px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  welcome: { fontSize: 24, fontWeight: 700, margin: 0 },
  headerRight: { display: "flex", alignItems: "center", gap: 15 },
  dateBox: { padding: "10px 15px", background: "#fff", borderRadius: 12, fontSize: 12, fontWeight: 700, border: "1px solid #f1f5f9" },
  topAvatar: { width: 40, height: 40, background: "#cbd5e1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  gridRow: { display: "flex", gap: 24, marginBottom: 25, flexWrap: "wrap" },
  card: { background: "#fff", padding: "25px", borderRadius: 28, border: "1px solid #e2e8f0", flex: "1 1 300px" },
  cardTitle: { fontSize: 16, fontWeight: 600, margin: "0 0 20px 0" },
  formGroup: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6 },
  input: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 600, boxSizing: "border-box" },
  textarea: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 600, minHeight: 100, resize: "vertical", boxSizing: "border-box" },
  infoList: { display: "flex", flexDirection: "column" },
  infoItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" },
  infoLabel: { fontSize: 13, fontWeight: 600, color: "#64748b" },
  infoValue: { fontSize: 14, fontWeight: 700, color: "#1e293b", textAlign: "right", maxWidth: "60%" },
  infoDivider: { height: 1, backgroundColor: "#f1f5f9", margin: 0 },
  btnEdit: { padding: "8px 16px", borderRadius: 10, border: "2px solid #3b82f6", background: "transparent", color: "#3b82f6", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" },
  btnCancel: { flex: 1, padding: "12px 24px", borderRadius: 12, border: "2px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  btnSave: { background: "#3b82f6", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", flex: 1 },
  toggleGroup: { display: "flex", flexDirection: "column", gap: 12 },
  toggleItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "#f8fafc", borderRadius: 12, cursor: "pointer" },
  toggleLabel: { fontSize: 14, fontWeight: 700 },
  toggleDesc: { fontSize: 12, color: "#94a3b8" },
  toggleOn: { width: 40, height: 24, background: "#22c55e", borderRadius: 12, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 12, color: "#fff" },
  toggleOff: { width: 40, height: 24, background: "#94a3b8", borderRadius: 12, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 12, color: "#fff" }
};