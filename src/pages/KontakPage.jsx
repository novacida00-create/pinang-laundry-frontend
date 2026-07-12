import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../utils/icons.jsx";

export default function KontakPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="contact-wrap" style={styles.container}>
      <header style={{ ...styles.navbar, ...(isScrolled ? styles.navbarScrolled : {}) }}>
        <div style={styles.navContent}>
          <div style={styles.navLogo}>
            <span style={styles.navLogoIcon}>🧺</span>
            <div>
              <span style={styles.navLogoText}>Pinang Laundry</span>
              <span style={styles.navLogoSub}>Bersih, Cepat, Terpercaya</span>
            </div>
          </div>
          <nav className="lp-nav-links" style={styles.navLinks}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/layanan" style={styles.navLink}>Layanan</a>
            <a href="/tentang" style={styles.navLink}>Tentang</a>
            <a href="/kontak" style={{ ...styles.navLink, ...styles.navLinkActive }}>Kontak</a>
          </nav>
          <div className="lp-nav-btns" style={styles.navButtons}>
            <button onClick={() => navigate("/login")} style={styles.navLoginBtn}>Login Admin</button>
            <button onClick={() => navigate("/customer/login")} style={styles.navOrderBtn}>Pesan Sekarang</button>
          </div>
          <button className="lp-mobile-toggle" style={styles.mobileToggle} onClick={() => setMobileMenu(!mobileMenu)}>
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

      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Hubungi Kami</h1>
          <p style={styles.heroSubtitle}>Kami siap membantu Anda 24/7</p>
        </div>
      </section>

      <section style={styles.contactSection}>
        <div style={styles.contactGrid}>
          <div style={styles.contactCard}>
            <span style={styles.contactIcon}><Icon name="phone" size={48} /></span>
            <h3 style={styles.contactLabel}>Telepon / WhatsApp</h3>
            <p style={styles.contactValue}>0812-3456-7890</p>
            <p style={styles.contactDesc}>Senin - Sabtu (08.00 - 20.00)</p>
          </div>
          <div style={styles.contactCard}>
            <span style={styles.contactIcon}><Icon name="mapPin" size={48} /></span>
            <h3 style={styles.contactLabel}>Alamat</h3>
            <p style={styles.contactValue}>Jl. Pinang Raya No. 123</p>
            <p style={styles.contactDesc}>Margonda, Depok 16423</p>
          </div>
          <div style={styles.contactCard}>
            <span style={styles.contactIcon}><Icon name="mail" size={48} /></span>
            <h3 style={styles.contactLabel}>Email</h3>
            <p style={styles.contactValue}>info@pinanglaundry.com</p>
            <p style={styles.contactDesc}>Kami akan membalas dalam 1x24 jam</p>
          </div>
          <div style={styles.contactCard}>
            <span style={styles.contactIcon}><Icon name="clock" size={48} /></span>
            <h3 style={styles.contactLabel}>Jam Operasional</h3>
            <p style={styles.contactValue}>Senin - Sabtu</p>
            <p style={styles.contactDesc}>08.00 - 20.00 WIB</p>
          </div>
          <div style={styles.contactCard}>
            <span style={styles.contactIcon}><Icon name="car" size={48} /></span>
            <h3 style={styles.contactLabel}>Layanan Jemput</h3>
            <p style={styles.contactValue}>Gratis Ongkir</p>
            <p style={styles.contactDesc}>Area Depok dan sekitarnya</p>
          </div>
          <div style={styles.contactCard}>
            <span style={styles.contactIcon}><Icon name="message" size={48} /></span>
            <h3 style={styles.contactLabel}>Media Sosial</h3>
            <p style={styles.contactValue}>@pinanglaundry</p>
            <p style={styles.contactDesc}>Instagram / Facebook / TikTok</p>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Siap Mencuci?</h2>
          <p style={styles.ctaSubtitle}>Hubungi kami sekarang dan nikmati layanan gratis ongkir!</p>
          <button onClick={() => navigate("/customer/login")} style={styles.ctaButton}>Mulai Pesan Sekarang 🧺</button>
        </div>
      </section>

      <footer style={styles.footer}>
        <div className="footer-content" style={styles.footerContent}>
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
  container: { fontFamily: "'Segoe UI', -apple-system, sans-serif", background: "#ffffff", minHeight: "100vh" },

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

  hero: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "40px 24px", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" },
  heroContent: { maxWidth: 600 },
  heroTitle: { fontSize: 40, fontWeight: 700, color: "#1e293b", marginBottom: 12 },
  heroSubtitle: { fontSize: 16, color: "#64748b" },

  contactSection: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "40px 24px", maxWidth: 1200, margin: "0 auto" },
  contactGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  contactCard: { padding: 32, background: "#fff", borderRadius: 24, textAlign: "center", border: "1px solid #bfdbfe", transition: "all 0.3s" },
  contactIcon: { width: 72, height: 72, background: "linear-gradient(135deg, #eff6ff, #dbeafe)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px", color: "#2563eb" },
  contactLabel: { fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 },
  contactValue: { fontSize: 16, color: "#3b82f6", fontWeight: 400, marginBottom: 4 },
  contactDesc: { fontSize: 14, color: "#94a3b8" },

  ctaSection: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "40px 24px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" },
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
