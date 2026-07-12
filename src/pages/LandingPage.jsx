import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/chatbot/chatbot.jsx";
import Icon from "../utils/icons.jsx";

const testimonials = [
  { name: "Siti Aminah", text: "Pelayanannya cepat dan cucian selalu bersih! Servis excelente!", rating: 5 },
  { name: "Budi Santoso", text: "Layanan Antar Jemput beneran membantu. Recomended!", rating: 5 },
  { name: "Dewi Lestari", text: "Sudah 2 tahun langganan, tidak pernah kecewa.", rating: 5 },
];

const serviceIcons = { "Cuci Kiloan": "👕", "Express": "⚡", "Cuci Lipat": "📦", "Cuci Setrika": "🔥", "Cuci Karpet": "🟤", "Cuci Jaket": "🧥", "Cuci Jas": "🤵", "Setrika Saja": "👔" };

const allServices = [
  { icon: "tshirt", name: "Cuci Kiloan", price: "Rp 6.000/kg", waktu: "24 jam", desc: "Cuci berdasarkan berat, cocok untuk baju harian" },
  { icon: "bolt", name: "Express", price: "Rp 15.000/kg", waktu: "4 jam", desc: "Laundry selesai dalam 4 jam" },
  { icon: "package", name: "Cuci Lipat", price: "Rp 10.000/kg", waktu: "24 jam", desc: "Cuci + lipat rapi, siap pakai" },
  { icon: "flame", name: "Cuci Setrika", price: "Rp 15.000/kg", waktu: "6 jam", desc: "Cuci + setrika cepat, wangi dan rapi" },
  { icon: "yarn", name: "Cuci Karpet", price: "Rp 50.000/pcs", waktu: "48 jam", desc: "Cuci karpet besar dan tebal" },
  { icon: "jacket", name: "Cuci Jaket", price: "Rp 12.000/kg", waktu: "24 jam", desc: "Cuci jaket dan outerwear" },
  { icon: "shirt", name: "Cuci Jas", price: "Rp 35.000/pcs", waktu: "48 jam", desc: "Cuci jas profesional" },
  { icon: "flame", name: "Setrika Saja", price: "Rp 5.000/kg", waktu: "6 jam", desc: "Hanya setrika, tanpa cucian" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const benefits = [
    { icon: "clock", title: "Cepat", desc: "Proses cepat dengan layanan express 4 jam" },
    { icon: "diamond", title: "Bersih", desc: "Hasil cucian bersih dan wangi" },
    { icon: "car", title: "Antar & Jemput", desc: "Jasa layanan antar & jemput ini sangat memudahkan" },
    { icon: "moneybag", title: "Terjangkau", desc: "Harga murah dan terjangkau" },
  ];

  return (
    <div style={styles.container} className="landing-wrap container-wrap">
      {/* STICKY NAVBAR */}
      <header style={{ ...styles.navbar, ...(isScrolled ? styles.navbarScrolled : {}) }}>
        <div style={styles.navContent} className="nav-content">
          <div style={styles.navLogo}>
            <span style={styles.navLogoIcon}>🧺</span>
            <div>
              <span style={styles.navLogoText}>Pinang Laundry</span>
              <span style={styles.navLogoSub}>Bersih, Cepat, Terpercaya</span>
            </div>
          </div>

          <nav style={styles.navLinks} className="lp-nav-links nav-link">
            <a href="#home" className="nav-link" style={styles.navLink}>Home</a>
            <a href="#services" className="nav-link" style={styles.navLink}>Layanan</a>
            <a href="#about" className="nav-link" style={styles.navLink}>Tentang</a>
            <a href="#contact" className="nav-link" style={styles.navLink}>Kontak</a>
          </nav>

          <div style={styles.navButtons} className="lp-nav-btns nav-btns">
            <button onClick={() => navigate("/login")} style={styles.navLoginBtn}>Login Admin</button>
            <button onClick={() => navigate("/customer/login")} style={styles.navOrderBtn}>Pesan Sekarang</button>
          </div>

          <button className="lp-mobile-toggle mobile-toggle" style={styles.mobileToggle} onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <Icon name="x" /> : <Icon name="menu2" />}
          </button>
        </div>

        {mobileMenu && (
          <div style={styles.mobileMenu} className="mobile-menu-wrap">
            <a href="#home" style={styles.mobileNavLink} onClick={() => setMobileMenu(false)}>Home</a>
            <a href="#services" style={styles.mobileNavLink} onClick={() => setMobileMenu(false)}>Layanan</a>
            <a href="#about" style={styles.mobileNavLink} onClick={() => setMobileMenu(false)}>Tentang</a>
            <a href="#contact" style={styles.mobileNavLink} onClick={() => setMobileMenu(false)}>Kontak</a>
            <button onClick={() => { setMobileMenu(false); navigate("/customer/login"); }} style={styles.mobileOrderBtn}>Pesan Sekarang</button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="home" style={styles.hero} className="hero-wrap">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.2) 100%)", zIndex: 1 }}></div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 60, width: "100%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={styles.heroContent} className="hero-content">
          <h1 style={styles.heroTitle} className="hero-title">Pinang Laundry</h1>
          <p style={styles.heroSubtitle} className="hero-subtitle">Kilat Hasilnya, Bersih Bajunya.</p>
          <div style={styles.heroButtons} className="hero-buttons">
            <button onClick={() => navigate("/customer/login")} style={styles.heroCtaBtn} className="hero-cta">
              <span>Pesan Sekarang</span>
              <span style={styles.heroCtaArrow}>→</span>
            </button>
            <a href="#services" style={styles.heroSecondaryBtn} className="hero-secondary">Lihat Layanan</a>
          </div>
          <div style={styles.heroStats} className="hero-stats">
            <div style={styles.heroStat}>
              <span style={styles.heroStatNumber} className="hero-stat-number">3000+</span>
              <span style={styles.heroStatLabel} className="hero-stat-label">Pelanggan Puas</span>
            </div>
            <div style={styles.heroStatDivider}></div>
            <div style={styles.heroStat} className="hero-stat">
              <span style={styles.heroStatNumber} className="hero-stat-number">4 Jam</span>
              <span style={styles.heroStatLabel} className="hero-stat-label">Layanan Express</span>
            </div>
            <div style={styles.heroStatDivider} className="hero-stat-divider"></div>
            <div style={styles.heroStat} className="hero-stat">
              <span style={styles.heroStatNumber} className="hero-stat-number">100%</span>
              <span style={styles.heroStatLabel} className="hero-stat-label">Garansi Bersih</span>
            </div>
          </div>
        </div>
        <div style={styles.heroVisual} className="hero-visual">
          <div style={styles.heroVisualCard}>
            <div style={styles.heroVisualIcon}>🧺</div>
            <div style={styles.heroVisualBadge1}><Icon name="star" size={14} /> Bersih & Wangi</div>
            <div style={styles.heroVisualBadge2}><Icon name="car" size={14} /> Antar & Jemput</div>
            <div style={styles.heroVisualBadge3}><Icon name="clock" size={14} /> 4 Jam Express</div>
          </div>
        </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" style={{ padding: "80px 24px", minHeight: "100vh", background: "#EFF6FF" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Layanan Kami</span>
          <h2 style={styles.sectionTitle} className="section-title">Pilihan Layanan Terbaik</h2>
          <p style={styles.sectionSubtitle} className="section-subtitle">Cucian numpuk? Pilih paket laundry terbaikmu dan nikmati hari bebas mencuci!</p>
        </div>
        <div style={styles.servicesGrid} className="services-grid">
          {allServices.map((s, i) => (
            <div key={i} style={styles.serviceCard}>
              <div style={styles.serviceCardTop}>
                <div style={styles.serviceIcon}>{serviceIcons[s.name] || "🧺"}</div>
                <div style={styles.serviceTime}>{s.waktu}</div>
              </div>
              <h3 style={styles.serviceName}>{s.name}</h3>
              <p style={styles.serviceDesc}>{s.desc}</p>
              <div style={styles.servicePriceRow}>
                <span style={styles.servicePrice}>{s.price}</span>
              </div>
              <button onClick={() => navigate("/customer/login")} style={styles.serviceOrderBtn}>Pesan Sekarang</button>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="about" style={styles.benefits}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Keunggulan</span>
          <h2 style={styles.sectionTitle} className="section-title">Mengapa Memilih Pinang Laundry?</h2>
          <p style={styles.sectionSubtitle} className="section-subtitle">Kami memberikan pengalaman laundry terbaik untuk Anda</p>
        </div>
        <div style={styles.benefitsGrid} className="benefits-grid">
          {benefits.map((b, i) => (
            <div key={i} style={styles.benefitCard}>
              <div style={styles.benefitIconBg}>
                <span style={styles.benefitIcon}><Icon name={b.icon} size={32} /></span>
              </div>
              <h3 style={styles.benefitTitle}>{b.title}</h3>
              <p style={styles.benefitDesc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section style={styles.howToOrder}>
        <div style={styles.sectionHeader}>
          <span style={{ ...styles.sectionBadge, fontSize: 14, fontWeight: 600, letterSpacing: "1px" }}>Cara Memesan</span>
          <h2 className="section-title" style={{ ...styles.sectionTitle, fontSize: 40, fontWeight: 700 }}>Mudah & Praktis</h2>
        </div>
        <div style={styles.steps} className="steps-wrap">
          {[
            { num: "1", title: "Login / Daftar", desc: "Daftar akun pelanggan" },
            { num: "2", title: "Pilih Layanan", desc: "Tentukan layanan & berat" },
            { num: "3", title: "Isi Alamat", desc: "Masukkan alamat jemput" },
            { num: "4", title: "Kami antar & jemput", desc: "Harga murah meriah" },
          ].map((step, i) => (
            <div key={i} style={styles.stepItem}>
              <div style={{ ...styles.stepCircle, width: 64, height: 64, fontSize: 22, fontWeight: 700 }}>{step.num}</div>
              <h4 style={{ ...styles.stepTitle, fontSize: 18, fontWeight: 600 }}>{step.title}</h4>
              <p style={{ ...styles.stepDesc, fontSize: 15 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={styles.testimonials}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Testimoni</span>
          <h2 style={styles.sectionTitle} className="section-title">Apa Kata Pelanggan Kami?</h2>
        </div>
        <div style={styles.testimonialGrid} className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div key={i} style={styles.testimonialCard}>
              <div style={styles.testimonialStars}>
                {Array(t.rating).fill().map((_, j) => <Icon key={j} name="star" size={16} />)}
              </div>
              <p style={styles.testimonialText}>"{t.text}"</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.testimonialAvatar}>{t.name[0]}</div>
                <span style={styles.testimonialName}>{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Siap Mencuci?</h2>
          <p style={styles.ctaSubtitle}>Jangan lewatkan promo hari ini!</p>
          <button onClick={() => navigate("/customer/login")} style={styles.ctaButton}>Mulai Pesan Sekarang 🧺</button>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={styles.contact}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Hubungi Kami</span>
          <h2 style={styles.sectionTitle} className="section-title">Get In Touch</h2>
        </div>
        <div style={styles.contactGrid} className="contact-grid">
          <div style={styles.contactCard}>
            <span style={styles.contactIcon}><Icon name="phone" size={40} /></span>
            <h4 style={styles.contactLabel}>Telepon / WA</h4>
            <p style={styles.contactValue}>0895-4293-50001</p>
          </div>
          <div style={styles.contactCard}>
            <span style={styles.contactIcon}><Icon name="mapPin" size={40} /></span>
            <h4 style={styles.contactLabel}>Alamat</h4>
            <a href="https://www.google.com/maps/search/?api=1&query=Jl.+Pinang+Raya+Margonda+Depok" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <p style={styles.contactValue}>Jl. Pinang Raya, Margonda Depok</p>
            </a>
          </div>
          <div style={styles.contactCard}>
            <span style={styles.contactIcon}><Icon name="clock" size={40} /></span>
            <h4 style={styles.contactLabel}>Jam Operasional</h4>
            <p style={styles.contactValue}>Senin-Sabtu (08.00-20.00)</p>
          </div>
        </div>
        <div style={{ width: "100%", maxWidth: 800, margin: "32px auto 0", borderRadius: 16, overflow: "hidden", border: "1px solid #e2e8f0" }}>
          <iframe
            src="https://maps.google.com/maps?q=Jl.+Pinang+Raya+Margonda+Depok&output=embed"
            width="100%" height="300" style={{ border: 0, display: "block" }}
            allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title="Pinang Laundry Location"
          ></iframe>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent} className="footer-content">
          <div style={styles.footerBrand}>
            <span style={styles.footerLogo}>🧺</span>
            <div>
              <h3 style={styles.footerBrandName}>Pinang Laundry</h3>
              <p style={styles.footerBrandTagline}>Bersih, Cepat, Terpercaya</p>
            </div>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerLinkTitle}>Menu</h4>
            <a href="#home" style={styles.footerLink}>Home</a>
            <a href="#services" style={styles.footerLink}>Layanan</a>
            <a href="#about" style={styles.footerLink}>Tentang</a>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerLinkTitle}>Layanan</h4>
            <span style={styles.footerLink}>Cuci Kiloan</span>
            <span style={styles.footerLink}>Express</span>
            <span style={styles.footerLink}>Cuci Karpet</span>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerLinkTitle}>Kontak</h4>
            <span style={styles.footerLink}>0895-4293-50001</span>
            <a href="https://www.google.com/maps/search/?api=1&query=Jl.+Pinang+Raya+Margonda+Depok" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}><span style={styles.footerLink}>Jl. Pinang Raya, Margonda Depok</span></a>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>@2026 Pinang Laundry. All Rights Reserved.</p>
        </div>
      </footer>

      <Chatbot />

      <style>{`
        @media (max-width: 768px) {
          .nav-link, .nav-btns { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-wrap { display: none !important; }
        }
        @media (max-width: 768px) {
          .container-wrap { padding-top: 64px !important; }
          .hero-wrap { flex-direction: column !important; padding: 0 24px !important; text-align: center !important; min-height: 90vh !important; }
          .hero-content { padding-left: 0 !important; }

          .hero-title { font-size: 36px !important; margin-bottom: 16px !important; }
          .hero-subtitle { font-size: 15px !important; margin-bottom: 28px !important; max-width: 100% !important; }
          .hero-buttons { flex-direction: column !important; gap: 12px !important; align-items: center !important; margin-bottom: 32px !important; }
          .hero-cta, .hero-secondary { padding: 14px 32px !important; font-size: 15px !important; text-align: center !important; }
          .hero-stats { gap: 20px !important; justify-content: center !important; }
          .hero-stat { min-width: auto !important; }
          .hero-stat-number { font-size: 24px !important; }
          .hero-stat-label { font-size: 12px !important; }
          .hero-stat-divider { height: 32px !important; }
          .hero-visual { display: none !important; }
          .services-grid { grid-template-columns: repeat(2,1fr) !important; }
          .benefits-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .testimonial-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .footer-content { flex-direction: column !important; gap: 24px !important; }

          @media (max-width: 480px) {
            .services-grid { grid-template-columns: 1fr !important; }
            .benefits-grid { grid-template-columns: 1fr !important; }
          }
          .steps-wrap { gap: 24px !important; }
          .section-subtitle { white-space: normal !important; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 28px !important; }
          .benefits-grid { grid-template-columns: 1fr !important; }
          .section-title { font-size: 24px !important; }
          .nav-content { padding: 12px 16px !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { background: "linear-gradient(180deg, #F5F7FB 0%, #ffffff 30%, #f8fafc 60%, #F5F7FB 100%)", minHeight: "100vh", paddingTop: 72 },
  
  navbar: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", transition: "all 0.3s ease", borderBottom: "1px solid rgba(241,245,249,0.8)" },
  navbarScrolled: { boxShadow: "0 4px 20px rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" },
  navContent: { maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navLogo: { display: "flex", alignItems: "center", gap: 12, cursor: "default" },
  navLogoIcon: { fontSize: 32 },
  navLogoText: { display: "block", fontSize: 20, fontWeight: 800, color: "#1e40af" },
  navLogoSub: { display: "block", fontSize: 11, color: "#94a3b8" },
  navLinks: { display: "flex", gap: 8 },
  navLink: { color: "#475569", textDecoration: "none", fontWeight: 700, fontSize: 24, letterSpacing: "0.3px", cursor: "pointer", padding: "8px 16px", transition: "all 0.2s ease" },
  navButtons: { display: "flex", gap: 12 },
  navLoginBtn: { padding: "10px 20px", borderRadius: 10, border: "2px solid #3b82f6", background: "transparent", color: "#3b82f6", fontWeight: 700, cursor: "pointer", fontSize: 14 },
  navOrderBtn: { padding: "10px 20px", borderRadius: 10, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 },
  mobileToggle: { display: "none", background: "none", border: "none", fontSize: 24, cursor: "pointer" },
  mobileMenu: { display: "flex", flexDirection: "column", gap: 12, padding: "16px 24px", background: "#fff", borderTop: "1px solid #f1f5f9" },
  mobileNavLink: { padding: "12px 0", color: "#64748b", textDecoration: "none", fontWeight: 600, cursor: "pointer" },
  mobileOrderBtn: { padding: "14px 20px", borderRadius: 10, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, textAlign: "center" },

  hero: { display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10%", backgroundImage: "url('/store-bg.png')", backgroundSize: "cover", backgroundPosition: "center", position: "relative", minHeight: "100vh", width: "100%" },
  heroContent: { flex: 1, paddingLeft: 120 },

  heroTitle: { fontSize: 72, fontWeight: 700, color: "#ffffff", marginBottom: 32, lineHeight: 1.1, letterSpacing: "-1.5px" },
  heroHighlight: { color: "#93c5fd" },
  heroSubtitle: { fontSize: 20, color: "#ffffff", marginBottom: 48, maxWidth: 700, lineHeight: 1.8, letterSpacing: 0 },
  heroButtons: { display: "flex", gap: 24, marginBottom: 56 },
  heroCtaBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "18px 40px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(59,130,246,0.4)" },
  heroCtaArrow: { fontSize: 22 },
  heroSecondaryBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "18px 40px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer", textDecoration: "none", boxShadow: "0 6px 20px rgba(59,130,246,0.4)" },
  heroStats: { display: "flex", gap: 56 },
  heroStat: { display: "flex", flexDirection: "column", textAlign: "center", minWidth: 100 },
  heroStatNumber: { fontSize: 40, fontWeight: 700, color: "#ffffff" },
  heroStatLabel: { fontSize: 16, color: "rgba(255,255,255,0.75)", letterSpacing: "+0.3px" },
  heroStatDivider: { width: 1, height: 48, background: "rgba(255,255,255,0.3)" },
  heroVisual: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center" },
  heroVisualCard: { position: "relative", width: 280, height: 280, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", borderRadius: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  heroVisualIcon: { fontSize: 80, lineHeight: 1 },
  heroVisualBadge1: { position: "absolute", top: -10, right: -20, padding: "8px 16px", background: "#22c55e", color: "#fff", borderRadius: 16, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 12px rgba(34,197,94,0.4)" },
  heroVisualBadge2: { position: "absolute", bottom: 30, left: -30, padding: "8px 16px", background: "#3b82f6", color: "#fff", borderRadius: 16, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 12px rgba(59,130,246,0.4)" },
  heroVisualBadge3: { position: "absolute", bottom: -10, right: -10, padding: "8px 16px", background: "#f59e0b", color: "#fff", borderRadius: 16, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 12px rgba(245,158,11,0.4)" },

  section: { padding: "80px 24px", maxWidth: 1200, margin: "0 auto", minHeight: "100vh" },
  sectionHeader: { textAlign: "center", marginBottom: 48 },
  sectionBadge: { display: "inline-block", padding: "8px 18px", background: "#eff6ff", color: "#3b82f6", borderRadius: 20, fontSize: 16, fontWeight: 400, letterSpacing: "+0.3px", marginBottom: 16 },
  sectionTitle: { fontSize: 32, fontWeight: 700, color: "#1e293b", marginBottom: 8, letterSpacing: "-0.5px" },
  sectionSubtitle: { fontSize: 16, color: "#64748b", margin: "0 auto", lineHeight: 1.65, letterSpacing: 0, whiteSpace: "nowrap" },

  servicesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 },
  serviceCard: { padding: 24, background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", transition: "all 0.3s ease", cursor: "default" },
  serviceCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  serviceIcon: { fontSize: 40 },
  serviceTime: { padding: "4px 10px", background: "#dcfce7", color: "#22c55e", borderRadius: 8, fontSize: 12, fontWeight: 400, letterSpacing: "+0.3px" },
  serviceName: { fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 },
  serviceDesc: { fontSize: 16, color: "#64748b", marginBottom: 16, lineHeight: 1.65, letterSpacing: 0 },
  servicePriceRow: { marginBottom: 16 },
  servicePrice: { fontSize: 22, fontWeight: 700, color: "#3b82f6" },
  serviceOrderBtn: { display: "block", width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "#3b82f6", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" },

  benefits: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "40px 24px", background: "linear-gradient(135deg, #f8fafc 0%, #e8f4f8 100%)" },
  benefitsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, maxWidth: 1000, margin: "0 auto" },
  benefitCard: { padding: 28, background: "#fff", borderRadius: 20, textAlign: "center", border: "1px solid #bfdbfe", transition: "all 0.3s ease" },
  benefitIconBg: { width: 72, height: 72, background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },
  benefitIcon: { fontSize: 32, color: "#2563eb" },
  benefitTitle: { fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 },
  benefitDesc: { fontSize: 16, color: "#64748b", lineHeight: 1.65, letterSpacing: 0 },

  howToOrder: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "40px 24px", background: "linear-gradient(135deg, #ffffff 0%, #F5F7FB 100%)" },
  steps: { display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", marginTop: 40 },
  stepItem: { textAlign: "center", flex: "0 0 auto" },
  stepCircle: { width: 60, height: 60, background: "#3b82f6", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, margin: "0 auto 16px" },
  stepTitle: { fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 4 },
  stepDesc: { fontSize: 16, color: "#64748b", lineHeight: 1.65, letterSpacing: 0 },

  testimonials: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "40px 24px", background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" },
  testimonialGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1000, margin: "0 auto" },
  testimonialCard: { padding: 24, background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0" },
  testimonialStars: { marginBottom: 12 },
  testimonialText: { fontSize: 16, color: "#64748b", lineHeight: 1.65, marginBottom: 16, fontStyle: "italic", letterSpacing: 0 },
  testimonialAuthor: { display: "flex", alignItems: "center", gap: 12 },
  testimonialAvatar: { width: 36, height: 36, background: "#3b82f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 },
  testimonialName: { fontSize: 14, fontWeight: 400, color: "#1e293b" },

  ctaSection: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "40px 24px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" },
  ctaContent: { textAlign: "center" },
  ctaTitle: { fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: "-0.5px" },
  ctaSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.9)", marginBottom: 28, lineHeight: 1.65, letterSpacing: 0 },
  ctaButton: { display: "inline-block", padding: "16px 32px", borderRadius: 14, border: "none", background: "#fff", color: "#3b82f6", fontSize: 16, fontWeight: 700, cursor: "pointer" },

  contact: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "40px 24px", background: "linear-gradient(135deg, #f8fafc 0%, #F5F7FB 100%)" },
  contactGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 900, margin: "0 auto" },
  contactCard: { padding: 32, background: "#fff", borderRadius: 24, textAlign: "center", border: "1px solid #bfdbfe", transition: "all 0.3s", cursor: "default" },
  contactIcon: { width: 72, height: 72, background: "linear-gradient(135deg, #eff6ff, #dbeafe)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px", color: "#2563eb" },
  contactLabel: { fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 4 },
  contactValue: { fontSize: 16, color: "#64748b", lineHeight: 1.65, letterSpacing: 0 },

  footer: { padding: "60px 24px 24px", background: "#1e293b" },
  footerContent: { display: "flex", justifyContent: "space-between", maxWidth: 1000, margin: "0 auto", gap: 48, flexWrap: "wrap" },
  footerBrand: { display: "flex", gap: 12 },
  footerLogo: { fontSize: 32 },
  footerBrandName: { fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 },
  footerBrandTagline: { fontSize: 12, color: "#94a3b8" },
  footerLinks: { display: "flex", flexDirection: "column", gap: 12 },
  footerLinkTitle: { fontSize: 14, fontWeight: 400, color: "#fff", marginBottom: 4 },
  footerLink: { fontSize: 14, color: "#94a3b8", textDecoration: "none", cursor: "default", lineHeight: 1.65 },
  footerBottom: { textAlign: "center", padding: "24px 0 0", marginTop: 48, borderTop: "1px solid #334155", color: "#94a3b8", fontSize: 14 },
};