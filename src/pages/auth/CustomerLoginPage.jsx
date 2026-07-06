import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetNewPass, setResetNewPass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
@media (max-width: 768px) {
.clp-wrap > div:nth-child(3) { flex-direction: column !important; width: 92% !important; max-width: 400px !important; border-radius: 24px !important; }
.clp-wrap > div:nth-child(3) > div:first-child { width: 100% !important; min-width: unset !important; padding: 28px 20px 20px !important; border-radius: 24px 24px 0 0 !important; }
.clp-wrap > div:nth-child(3) > div:first-child > div:first-child { font-size: 44px !important; }
.clp-wrap > div:nth-child(3) > div:first-child > div:nth-child(5) { gap: 12px !important; }
.clp-wrap > div:nth-child(3) > div:last-child { padding: 20px 16px 24px !important; }
.clp-wrap input { font-size: 16px !important; padding: 14px 16px !important; box-sizing: border-box !important; width: 100% !important; border-radius: 14px !important; }
.clp-wrap button { font-size: 16px !important; padding: 14px !important; border-radius: 14px !important; }
.clp-wrap > div:nth-child(3) > div:last-child h2 { font-size: 20px !important; }
.clp-wrap > div:nth-child(3) > div:last-child p { font-size: 15px !important; }
.clp-wrap > div:nth-child(1), .clp-wrap > div:nth-child(2) { width: 300px !important; height: 300px !important; }
.clp-wrap > div[style*="fixed"] > div { width: 90% !important; max-width: 360px !important; padding: 24px 20px !important; border-radius: 24px !important; margin: 0 auto !important; }
.clp-wrap > div:nth-child(3) > div:last-child > div:last-child { margin-top: 16px !important; }
.clp-wrap > div:nth-child(3) > div:last-child > div:last-child span { font-size: 15px !important; }
}
@media (max-width: 480px) {
.clp-wrap > div:nth-child(3) > div:first-child { padding: 20px 16px 16px !important; }
.clp-wrap > div:nth-child(3) > div:first-child > div:first-child { font-size: 36px !important; }
.clp-wrap > div:nth-child(3) > div:first-child h2 { font-size: 20px !important; }
.clp-wrap > div:nth-child(3) > div:last-child { padding: 16px 14px 20px !important; }
.clp-wrap > div:nth-child(3) > div:last-child h2 { font-size: 18px !important; }
.clp-wrap > div:nth-child(3) > div:last-child p { font-size: 14px !important; }
.clp-wrap input { font-size: 15px !important; padding: 12px 14px !important; border-radius: 12px !important; }
.clp-wrap button { font-size: 15px !important; padding: 13px !important; border-radius: 12px !important; }
.clp-wrap > div[style*="fixed"] > div { width: 92% !important; max-width: 340px !important; padding: 20px 16px !important; border-radius: 20px !important; }
.clp-wrap > div:nth-child(3) > div:last-child > div:last-child { margin-top: 14px !important; }
.clp-wrap > div:nth-child(3) > div:last-child > div:last-child span { font-size: 14px !important; }
}
`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Masukkan username dan password!");
      return;
    }
    const customers = JSON.parse(localStorage.getItem("customers") || "[]");
    const user = customers.find(c => c.username === username);
    if (!user) {
      setError("Username belum terdaftar!");
      return;
    }
    if (user.password !== password) {
      setError("Kata sandi salah!");
      return;
    }
    localStorage.setItem("customerName", user.name);
    localStorage.setItem("customerEmail", user.email);
    localStorage.setItem("customerLoggedIn", user.username);
    navigate("/customer/dashboard");
  };

  const handleResetPassword = () => {
    setError("");
    if (!resetUsername || !resetNewPass) {
      setError("Mohon isi username dan kata sandi baru!");
      return;
    }
    const customers = JSON.parse(localStorage.getItem("customers") || "[]");
    const idx = customers.findIndex(c => c.username === resetUsername);
    if (idx === -1) {
      setError("Username tidak ditemukan!");
      return;
    }
    customers[idx].password = resetNewPass;
    localStorage.setItem("customers", JSON.stringify(customers));
    alert("Kata sandi berhasil diubah! Silakan login.");
    setShowReset(false);
    setResetUsername("");
    setResetNewPass("");
    setError("");
  };

  const handleRegister = () => {
    setError("");
    if (!regUsername || !regEmail || !regPassword) {
      setError("Mohon isi semua data!");
      return;
    }
    const customers = JSON.parse(localStorage.getItem("customers") || "[]");
    if (customers.find(c => c.username === regUsername)) {
      setError("Username sudah digunakan!");
      return;
    }
    if (customers.find(c => c.email === regEmail)) {
      setError("Email sudah terdaftar!");
      return;
    }
    customers.push({ name: regUsername, username: regUsername, email: regEmail, password: regPassword });
    localStorage.setItem("customers", JSON.stringify(customers));
    alert("Pendaftaran berhasil! Silakan login.");
    setShowRegister(false);
    setRegUsername(""); setRegEmail(""); setRegPassword("");
  };

  return (
    <div className="clp-wrap" style={styles.container}>
      <div style={styles.leftBg}></div>
      <div style={styles.rightBg}></div>
      <div style={styles.card}>
        <div style={styles.cardLeft}>
          <div style={styles.cardLeftIcon}>&#x1F9FA;</div>
          <h2 style={styles.cardLeftTitle}>Pinang Laundry</h2>
          <p style={styles.cardLeftSub}>Bersih, Cepat, Terpercaya</p>
          <div style={styles.cardLeftIcons}>
            <span style={styles.cardLeftIconSmall}>&#x1F455;</span>
            <span style={styles.cardLeftIconSmall}>&#x1F456;</span>
            <span style={styles.cardLeftIconSmall}>&#x1F9E5;</span>
          </div>
          <div style={styles.cardLeftStats}>
            <div><span style={styles.cardLeftStatNum}>3000+</span><span style={styles.cardLeftStatLabel}>Pelanggan</span></div>
            <div><span style={styles.cardLeftStatNum}>4 Jam</span><span style={styles.cardLeftStatLabel}>Express</span></div>
          </div>
        </div>
        <div style={styles.cardRight}>
          <h2 style={{ ...styles.title, fontSize: 18 }}>Login Pelanggan</h2>

          {error && <div style={styles.errorBox}>{error}</div>}

          <label style={styles.label}>Username</label>
          <input type="text" placeholder="Masukkan nama anda" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={styles.label}>Password</label>
            <span style={{ fontSize: 13, color: "#3b82f6", cursor: "pointer" }} onClick={() => { setShowReset(true); setError(""); setResetUsername(username); }}>Lupa password?</span>
          </div>
          <div style={styles.passWrap}>
            <input type={showPass ? "text" : "password"} placeholder="Masukkan kata sandi" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
            <span onClick={() => setShowPass(!showPass)} style={styles.passToggle}>{showPass ? "\uD83D\uDE48" : "\uD83D\uDc41\uFE0F"}</span>
          </div>

          <button onClick={handleLogin} style={styles.button}>Login</button>

          <div style={styles.footer}>
            <span style={styles.footerText}>Belum punya akun? </span>
            <span style={styles.link} onClick={() => { setShowRegister(true); setError(""); }}>Daftar di sini</span>
          </div>
        </div>
      </div>

      {showRegister && (
        <div style={styles.modalOverlay} onClick={() => { setShowRegister(false); setError(""); }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.logoSection}>
              <div style={styles.logoIcon}>&#x1F9FA;</div>
              <div>
                <h2 style={{ ...styles.logoText, fontSize: 18 }}>Pinang Laundry</h2>
                <p style={styles.logoSub}>Buat akun baru</p>
              </div>
            </div>

            <h2 style={{ ...styles.title, fontSize: 18 }}>Daftar Akun Baru</h2>

            {error && <div style={styles.errorBox}>{error}</div>}

            <label style={styles.label}>Username</label>
            <input type="text" placeholder="Buat nama" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} style={styles.input} />

            <label style={styles.label}>Email</label>
            <input type="email" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} style={styles.input} />

            <label style={styles.label}>Password</label>
            <div style={styles.passWrap}>
              <input type={showPass ? "text" : "password"} placeholder="Buat kata sandi" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} style={styles.input} />
              <span onClick={() => setShowPass(!showPass)} style={styles.passToggle}>{showPass ? "\uD83D\uDE48" : "\uD83D\uDc41\uFE0F"}</span>
            </div>

            <button onClick={handleRegister} style={styles.button}>Daftar</button>

            <div style={styles.footer}>
              <span style={styles.footerText}>Sudah punya akun? </span>
              <span style={styles.link} onClick={() => { setShowRegister(false); setError(""); }}>Masuk di sini</span>
            </div>
          </div>
        </div>
      )}

      {showReset && (
        <div style={styles.modalOverlay} onClick={() => { setShowReset(false); setError(""); }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.logoSection}>
              <div style={styles.logoIcon}>&#x1F9FA;</div>
              <div>
                <h2 style={{ ...styles.logoText, fontSize: 18 }}>Pinang Laundry</h2>
                <p style={styles.logoSub}>Reset kata sandi</p>
              </div>
            </div>

            <h2 style={{ ...styles.title, fontSize: 18 }}>Ganti Kata Sandi</h2>

            {error && <div style={styles.errorBox}>{error}</div>}

            <label style={styles.label}>Username</label>
            <input type="text" placeholder="Nama" value={resetUsername} onChange={(e) => setResetUsername(e.target.value)} style={styles.input} />

            <label style={styles.label}>Password</label>
            <div style={styles.passWrap}>
              <input type={showPass ? "text" : "password"} placeholder="Password baru" value={resetNewPass} onChange={(e) => setResetNewPass(e.target.value)} style={styles.input} />
              <span onClick={() => setShowPass(!showPass)} style={styles.passToggle}>{showPass ? "\uD83D\uDE48" : "\uD83D\uDc41\uFE0F"}</span>
            </div>

            <button onClick={handleResetPassword} style={styles.button}>Ganti Password</button>

            <div style={styles.footer}>
              <span style={styles.link} onClick={() => { setShowReset(false); setError(""); }}>Kembali ke login</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif", position: "relative", overflow: "hidden", backgroundColor: "#f0f7ff" },
  leftBg: { position: "absolute", left: "-10%", top: "-20%", width: 500, height: 500, background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", borderRadius: "50%" },
  rightBg: { position: "absolute", right: "-10%", bottom: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", borderRadius: "50%" },
  card: { width: 780, background: "#ffffff", borderRadius: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "flex", flexDirection: "row", position: "relative", zIndex: 1, overflow: "hidden" },
  cardLeft: { width: 300, background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)", padding: "40px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#fff" },
  cardLeftIcon: { fontSize: 64, marginBottom: 4 },
  cardLeftTitle: { fontSize: 24, fontWeight: 700, margin: 0, textAlign: "center" },
  cardLeftSub: { fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, textAlign: "center" },
  cardLeftIcons: { display: "flex", gap: 8, marginTop: 8, marginBottom: 20 },
  cardLeftIconSmall: { fontSize: 28, opacity: 0.9 },
  cardLeftStats: { display: "flex", gap: 32, marginTop: 8 },
  cardLeftStatNum: { display: "block", fontSize: 22, fontWeight: 700, textAlign: "center" },
  cardLeftStatLabel: { display: "block", fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "center", letterSpacing: "+0.3px" },
  cardRight: { flex: 1, padding: "40px 36px", display: "flex", flexDirection: "column", gap: 12 },
  modal: { width: 400, background: "#ffffff", borderRadius: 32, padding: "36px", boxShadow: "0 25px 50px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: 12 },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  logoSection: { display: "flex", alignItems: "center", gap: 12, marginBottom: 4 },
  logoIcon: { width: 48, height: 48, background: "linear-gradient(135deg, #3b82f6, #6366f1)", borderRadius: 14, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 24, boxShadow: "0 4px 12px rgba(59,130,246,0.3)" },
  logoText: { fontSize: 18, fontWeight: 700, color: "#1e40af", margin: 0 },
  logoSub: { fontSize: 12, color: "#94a3b8", margin: 0, letterSpacing: "+0.3px" },
  title: { fontSize: 22, fontWeight: 600, color: "#1e293b", margin: 0, letterSpacing: "-0.5px" },

  label: { fontSize: 14, fontWeight: 400, color: "#475569", letterSpacing: "+0.3px" },
  errorBox: { padding: "12px 16px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: 12, fontSize: 14, fontWeight: 400, textAlign: "center", border: "1px solid #fecaca", lineHeight: 1.65 },
  input: { width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 16, outline: "none", background: "#f8fafc", boxSizing: "border-box", lineHeight: 1.65 },
  passWrap: { position: "relative", display: "flex", alignItems: "center" },
  passToggle: { position: "absolute", right: 14, cursor: "pointer", fontSize: 20, opacity: 0.7 },
  button: { width: "100%", padding: 14, marginTop: 12, background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(59,130,246,0.3)", transition: "all 0.2s ease" },
  footer: { textAlign: "center", marginTop: 8 },
  footerText: { fontSize: 14, color: "#64748b", lineHeight: 1.65 },
  link: { fontSize: 14, color: "#3b82f6", fontWeight: 400, cursor: "pointer" },
};
