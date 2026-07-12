import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
@media (max-width: 768px) {
.clp-wrap{min-height:100dvh!important}
.clp-wrap > div[style*="z-index: 1"]{flex-direction:column!important;width:92%!important;max-width:400px!important;border-radius:24px!important}
.clp-wrap > div[style*="z-index: 1"] > div:first-child{width:100%!important;min-width:unset!important;padding:28px 20px 20px!important;border-radius:24px 24px 0 0!important}
.clp-wrap > div[style*="z-index: 1"] > div:first-child > div:first-child{font-size:44px!important}
.clp-wrap > div[style*="z-index: 1"] > div:last-child{padding:20px 16px 24px!important}
.clp-wrap input{font-size:16px!important;padding:14px 16px!important;box-sizing:border-box!important;width:100%!important;border-radius:14px!important}
.clp-wrap button{font-size:16px!important;padding:14px!important;border-radius:14px!important}
.clp-wrap > div[style*="z-index: 1"] > div:last-child h2{font-size:20px!important}
.clp-wrap > div[style*="position: fixed"]{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.clp-wrap,.clp-wrap > div[style*="z-index: 1"]{overflow:visible!important}
}
@media (max-width: 480px) {
.clp-wrap > div[style*="z-index: 1"] > div:first-child{padding:20px 16px 16px!important}
.clp-wrap > div[style*="z-index: 1"] > div:first-child > div:first-child{font-size:36px!important}
.clp-wrap > div[style*="z-index: 1"] > div:first-child h2{font-size:20px!important}
.clp-wrap > div[style*="z-index: 1"] > div:last-child{padding:16px 14px 20px!important}
.clp-wrap > div[style*="z-index: 1"] > div:last-child h2{font-size:18px!important}
.clp-wrap input{font-size:15px!important;padding:12px 14px!important;border-radius:12px!important}
.clp-wrap button{font-size:15px!important;padding:13px!important;border-radius:12px!important}
}
`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const handleRegister = async () => {
    setError("");
    if (!regUsername || !regEmail || !regPassword) {
      setError("Mohon isi semua data!");
      return;
    }
    try {
      const res = await fetch("/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regUsername, username: regUsername, email: regEmail, password: regPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Pendaftaran berhasil! Silakan login.");
      navigate("/customer/login");
    } catch (err) {
      setError(err.message);
    }
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
          <h2 style={{ ...styles.title, fontSize: 18 }}>Daftar Akun Baru</h2>

          {error && <div style={styles.errorBox}>{error}</div>}

          <label style={styles.label}>Username</label>
          <input type="text" placeholder="Buat nama" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} style={styles.input} />

          <label style={styles.label}>Email</label>
          <input type="email" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} style={styles.input} />

          <label style={styles.label}>Password</label>
          <div style={styles.passWrap}>
            <input type={showPass ? "text" : "password"} placeholder="Buat kata sandi" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} style={styles.input} />
            <span onClick={() => setShowPass(!showPass)} style={styles.passToggle}>{showPass ? "\uD83D\uDC41\u200D\uD83D\uDDE8\uFE0F" : "\uD83D\uDC41"}</span>
          </div>

          <button onClick={handleRegister} style={styles.button}>Daftar</button>

          <div style={styles.footer}>
            <span style={styles.footerText}>Sudah punya akun? </span>
            <span style={styles.link} onClick={() => navigate("/customer/login")}>Masuk di sini</span>
          </div>
        </div>
      </div>
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
