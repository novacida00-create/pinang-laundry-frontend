import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../utils/icons.jsx";

const serviceIcons = { "Cuci Kiloan": "👕", "Express": "⚡", "Cuci Karpet": "🟤", "Cuci Jaket": "🧥", "Cuci Jas": "🤵", "Setrika Saja": "👔" };

const services = [
  { icon: "tshirt", name: "Cuci Kiloan", price: "Rp 6.000", unit: "/kg", waktu: "24 jam", desc: "Cuci berdasarkan berat, cocok untuk baju harian. Paket lengkap meliputi cuci, rendam, dan bilas hingga bersih." },
  { icon: "bolt", name: "Express", price: "Rp 15.000", unit: "/kg", waktu: "4 jam", desc: "Layanan kilat! Laundry selesai dalam 4 jam saja. Cocok untuk kebutuhan mendesak." },
  { icon: "yarn", name: "Cuci Karpet", price: "Rp 50.000", unit: "/pcs", waktu: "48 jam", desc: "Cuci karpet besar dan tebal. Proses deep cleaning untuk karpet kesayangan Anda." },
  { icon: "jacket", name: "Cuci Jaket", price: "Rp 12.000", unit: "/pcs", waktu: "24 jam", desc: "Cuci jaket dan outerwear. Termasuk обработка khusus untuk материалу." },
  { icon: "shirt", name: "Cuci Jas", price: "Rp 35.000", unit: "/pcs", waktu: "48 jam", desc: "Cuci jas profesional dengan dry clean khusus. Hasil rapi dan wangi." },
  { icon: "flame", name: "Setrika Saja", price: "Rp 5.000", unit: "/kg", waktu: "6 jam", desc: "Hanya setrika, tanpa cucian. Pakaian Anda akan rapi seperti disetrika profesional." },
];

export default function Layanan() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={styles.container}>
      {/* STICKY NAVBAR */}
      <header style={{ ...styles.navbar, ...(isScrolled ? styles.navbarScrolled : {}) }}>
        <div style={styles.navContent}>
          <div style={styles.navLogo}>
            <span style={styles.navLogoIcon}>🧺</span>
            <div>
              <span style={styles.navLogoText}>Pinang Laundry</span>
              <span style={styles.navLogoSub}>Bersih, Cepat, Terpercaya</span>
            </div>
          </div>

          <nav style={styles.navLinks}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/layanan" style={{ ...styles.navLink, ...styles.navLinkActive }}>Layanan</a>
            <a href="/tentang" style={styles.navLink}>Tentang</a>
            <a href="/kontak" style={styles.navLink}>Kontak</a>
          </nav>

          <div style={styles.navButtons}>
            <button onClick={() => navigate("/login")} style={styles.navLoginBtn}>Login Admin</button>
            <button onClick={() => navigate("/customer/login")} style={styles.navOrderBtn}>Pesan Sekarang</button>
          </div>

          <button style={styles.mobileToggle} onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <Icon name="x" /> : <Icon name="menu2" />}
          </button>
        </div>

        {mobileMenu && (
          <div style={styles.mobileMenu}>
            <a href="/" style={styles.mobileNavLink} onClick={() => setMobileMenu(false)}>Home</a>
            <a href="/layanan" style={styles.mobileNavLink} onClick={() => setMobileMenu(false)}>Layanan</a>
            <a href="/tentang" style={styles.mobileNavLink} onClick={() => setMobileMenu(false)}>Tentang</a>
            <a href="/kontak" style={styles.mobileNavLink} onClick={() => setMobileMenu(false)}>Kontak</a>
            <button onClick={() => { setMobileMenu(false); navigate("/customer/login"); }} style={styles.mobileOrderBtn}>Pesan Sekarang</button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Layanan & Harga</h1>
          <p style={styles.heroSubtitle}>Pilihan lengkap layanan laundry dengan harga transparan dan berkualitas</p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section style={styles.servicesSection}>
        <div style={styles.servicesGrid}>
          {services.map((s, i) => (
            <div key={i} style={styles.serviceCard}>
              <div style={styles.serviceCardHeader}>
                <div style={styles.serviceIcon}>{serviceIcons[s.name] || "🧺"}</div>
                <div style={styles.serviceTime}>{s.waktu}</div>
              </div>
              <h3 style={styles.serviceName}>{s.name}</h3>
              <p style={styles.serviceDesc}>{s.desc}</p>
              <div style={styles.servicePriceRow}>
                <span style={styles.servicePrice}>{s.price}</span>
                <span style={styles.serviceUnit}>{s.unit}</span>
              </div>
              <button onClick={() => navigate("/customer/login")} style={styles.serviceOrderBtn}>
                Pesan Sekarang
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Siap Mencuci?</h2>
          <p style={styles.ctaSubtitle}>Hubungi kami sekarang untuk layanan terbaik!</p>
          <button onClick={() => navigate("/customer/login")} style={styles.ctaButton}>Mulai Pesan Sekarang 🧺</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <span style={styles.footerLogo}>🧺</span>
            <div>
              <h3 style={styles.footerBrandName}>Pinang Laundry</h3>
              <p style={styles.footerBrandTagline}>Bersih, Cepat, Terpercaya</p>
            </div>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerLinkTitle}>Menu</h4>
            <a href="/" style={styles.footerLink}>Home</a>
            <a href="/layanan" style={styles.footerLink}>Layanan</a>
            <a href="/tentang" style={styles.footerLink}>Tentang</a>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerLinkTitle}>Layanan</h4>
            <span style={styles.footerLink}>Cuci Kiloan</span>
            <span style={styles.footerLink}>Express</span>
            <span style={styles.footerLink}>Cuci Karpet</span>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerLinkTitle}>Kontak</h4>
            <span style={styles.footerLink}>0812-3456-7890</span>
            <span style={styles.footerLink}>Jl. Pinang Raya</span>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2026 Pinang Laundry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: { fontFamily: "'Segoe UI', -apple-system, sans-serif", background: "#FFF8F0", minHeight: "100vh" },
  
  navbar: { position: "sticky", top: 0, zIndex: 1000, background: "#ffffff", transition: "all 0.3s ease", borderBottom: "1px solid #f1f5f9" },
  navbarScrolled: { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  navContent: { maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navLogo: { display: "flex", alignItems: "center", gap: 12 },
  navLogoIcon: { fontSize: 32 },
  navLogoText: { display: "block", fontSize: 20, fontWeight: 800, color: "#1e40af" },
  navLogoSub: { display: "block", fontSize: 11, color: "#94a3b8" },
  navLinks: { display: "flex", gap: 32 },
  navLink: { color: "#64748b", textDecoration: "none", fontWeight: 600, fontSize: 14 },
  navLinkActive: { color: "#3b82f6", borderBottom: "2px solid #3b82f6", paddingBottom: "4px" },
  navButtons: { display: "flex", gap: 12 },
  navLoginBtn: { padding: "10px 20px", borderRadius: 10, border: "2px solid #3b82f6", background: "transparent", color: "#3b82f6", fontWeight: 700, cursor: "pointer", fontSize: 14 },
  navOrderBtn: { padding: "10px 20px", borderRadius: 10, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 },
  mobileToggle: { display: "none", background: "none", border: "none", fontSize: 24, cursor: "pointer" },
  mobileMenu: { display: "flex", flexDirection: "column", gap: 12, padding: "16px 24px", background: "#fff", borderTop: "1px solid #f1f5f9" },
  mobileNavLink: { padding: "12px 0", color: "#64748b", textDecoration: "none", fontWeight: 600 },
  mobileOrderBtn: { padding: "14px 20px", borderRadius: 10, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, textAlign: "center" },

  hero: { padding: "60px 24px 40px", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", textAlign: "center" },
  heroContent: { maxWidth: 600, margin: "0 auto" },
  heroTitle: { fontSize: 40, fontWeight: 700, color: "#1e293b", marginBottom: 12 },
  heroSubtitle: { fontSize: 16, color: "#64748b" },

  servicesSection: { padding: "60px 24px", maxWidth: 1200, margin: "0 auto" },
  servicesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 },
  serviceCard: { padding: 28, background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", transition: "all 0.3s ease" },
  serviceCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  serviceIcon: { fontSize: 48 },
  serviceTime: { padding: "6px 12px", background: "#dcfce7", color: "#22c55e", borderRadius: 10, fontSize: 12, fontWeight: 400 },
  serviceName: { fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 },
  serviceDesc: { fontSize: 16, color: "#64748b", marginBottom: 16, lineHeight: 1.65 },
  servicePriceRow: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 },
  servicePrice: { fontSize: 22, fontWeight: 700, color: "#3b82f6" },
  serviceUnit: { fontSize: 14, color: "#94a3b8" },
  serviceOrderBtn: { width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },

  ctaSection: { padding: "80px 24px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" },
  ctaContent: { textAlign: "center" },
  ctaTitle: { fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 8 },
  ctaSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.9)", marginBottom: 28 },
  ctaButton: { display: "inline-block", padding: "16px 32px", borderRadius: 14, border: "none", background: "#fff", color: "#3b82f6", fontSize: 16, fontWeight: 700, cursor: "pointer" },

  footer: { padding: "60px 24px 24px", background: "#1e293b" },
  footerContent: { display: "flex", justifyContent: "space-between", maxWidth: 1000, margin: "0 auto", gap: 48, flexWrap: "wrap" },
  footerBrand: { display: "flex", gap: 12 },
  footerLogo: { fontSize: 32 },
  footerBrandName: { fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 },
  footerBrandTagline: { fontSize: 12, color: "#94a3b8" },
  footerLinks: { display: "flex", flexDirection: "column", gap: 12 },
  footerLinkTitle: { fontSize: 14, fontWeight: 400, color: "#fff", marginBottom: 4 },
  footerLink: { fontSize: 14, color: "#94a3b8", textDecoration: "none" },
  footerBottom: { textAlign: "center", padding: "24px 0 0", marginTop: 48, borderTop: "1px solid #334155" },
};