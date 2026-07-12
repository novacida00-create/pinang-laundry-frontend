import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../utils/icons.jsx";

export default function LoginPage() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
@media (max-width: 768px) {
.alp-wrap > div[style*="z-index: 1"] { flex-direction: column !important; width: 92% !important; max-width: 420px !important; border-radius: 24px !important; }
.alp-wrap > div[style*="z-index: 1"] > div:first-child { width: 100% !important; min-width: unset !important; padding: 28px 20px 20px !important; border-radius: 24px 24px 0 0 !important; }
.alp-wrap > div[style*="z-index: 1"] > div:last-child { padding: 20px 16px 24px !important; }
.alp-wrap input { font-size: 16px !important; padding: 14px 16px !important; width: 100% !important; border-radius: 14px !important; box-sizing: border-box !important; }
.alp-wrap button { font-size: 16px !important; padding: 14px !important; border-radius: 14px !important; }
.alp-wrap, .alp-wrap > div[style*="z-index: 1"] { overflow: visible !important; }
}
@media (max-width: 480px) {
.alp-wrap > div[style*="z-index: 1"] { width: 94% !important; }
.alp-wrap > div[style*="z-index: 1"] > div:first-child { padding: 20px 16px 16px !important; }
.alp-wrap > div[style*="z-index: 1"] > div:first-child > div:first-child { font-size: 36px !important; }
.alp-wrap input { font-size: 15px !important; padding: 12px 14px !important; }
.alp-wrap button { font-size: 15px !important; padding: 13px !important; }
}
`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "admin@laundry.com" && password === "123456") {
      navigate("/admin");
    } else {
      alert("Email / password salah");
    }
  };

  return (
    <div className="alp-wrap" style={styles.container}>
      <div style={styles.leftBg}></div>
      <div style={styles.rightBg}></div>
      <div style={styles.card}>
        <div style={styles.cardLeft}>
          <div style={styles.cardLeftIcon}>🧺</div>
          <h2 style={styles.cardLeftTitle}>Pinang Laundry</h2>
          <p style={styles.cardLeftSub}>Bersih, Cepat, Terpercaya</p>
          <div style={styles.cardLeftIcons}>
            <span style={styles.cardLeftIconSmall}><Icon name="tshirt" size={28} /></span>
            <span style={styles.cardLeftIconSmall}><Icon name="shirt" size={28} /></span>
            <span style={styles.cardLeftIconSmall}><Icon name="jacket" size={28} /></span>
          </div>
          <div style={styles.cardLeftStats}>
            <div><span style={styles.cardLeftStatNum}>Admin</span><span style={styles.cardLeftStatLabel}>Panel</span></div>
            <div><span style={styles.cardLeftStatNum}>2020</span><span style={styles.cardLeftStatLabel}>Sejak</span></div>
          </div>
        </div>
        <div style={styles.cardRight}>
          <h2 style={styles.title}>Login Admin</h2>
          <p style={styles.subtitle}>Selamat datang kembali!</p>

          <label style={styles.label}><Icon name="user" size={14} /> Username</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}><Icon name="lock" size={14} /> Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button onClick={handleLogin} style={styles.button}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

  const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif", position: "relative", overflow: "hidden", backgroundColor: "#F5F7FB" },
  leftBg: { position: "absolute", left: "-10%", top: "-20%", width: 500, height: 500, background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", borderRadius: "50%" },
  rightBg: { position: "absolute", right: "-10%", bottom: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", borderRadius: "50%" },
  card: { width: 780, background: "#ffffff", borderRadius: 32, border: "1px solid #e2e8f0", display: "flex", flexDirection: "row", position: "relative", zIndex: 1, overflow: "hidden" },
  cardLeft: { width: 300, background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)", padding: "40px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#fff" },
  cardLeftIcon: { fontSize: 64, marginBottom: 4 },
  cardLeftTitle: { fontSize: 24, fontWeight: 700, margin: 0, textAlign: "center" },
  cardLeftSub: { fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, textAlign: "center" },
  cardLeftIcons: { display: "flex", gap: 8, marginTop: 8, marginBottom: 20 },
  cardLeftIconSmall: { fontSize: 28, opacity: 0.9 },
  cardLeftStats: { display: "flex", gap: 32, marginTop: 8 },
  cardLeftStatNum: { display: "block", fontSize: 22, fontWeight: 700, textAlign: "center" },
  cardLeftStatLabel: { display: "block", fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "center", letterSpacing: "+0.3px" },
  cardRight: { flex: 1, padding: "40px 36px", display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: 600, color: "#1e293b", margin: 0, letterSpacing: "-0.5px" },
  subtitle: { fontSize: 16, color: "#64748b", margin: 0, lineHeight: 1.65, letterSpacing: "+0.3px" },
  label: { fontSize: 14, fontWeight: 400, color: "#475569", letterSpacing: "+0.3px" },
  input: { width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 16, outline: "none", background: "#f8fafc", boxSizing: "border-box", lineHeight: 1.65 },
  button: { width: "100%", padding: 14, marginTop: 12, background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(59,130,246,0.3)", transition: "all 0.2s ease" },
};
