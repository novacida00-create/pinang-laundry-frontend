import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../../components/chatbot/chatbot.jsx";


const API_URL = import.meta.env.VITE_API_URL || "/api";

const formatTanggalIndonesia = () => {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const today = new Date();
  const namaHari = hari[today.getDay()];
  const namaBulan = bulan[today.getMonth()];
  const tanggal = today.getDate();
  const tahun = today.getFullYear();
  
  return `${tanggal} ${namaBulan} ${tahun}, ${namaHari}`;
};

const getStatusBadge = (status) => {
  if (status === "Selesai") return { bg: "#dcfce7", color: "#16a34a" };
  if (status === "Diproses") return { bg: "#dbeafe", color: "#2563eb" };
  if (status === "Menunggu") return { bg: "#fef3c7", color: "#d97706" };
  return { bg: "#f1f5f9", color: "#64748b" };
};

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const currentDate = formatTanggalIndonesia();
  const customerName = localStorage.getItem("customerName") || "Pelanggan";
  
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [orderForm, setOrderForm] = useState({ weight: "", phone: "", address: "" });
  const getUnit = (name) => name === "Cuci Karpet" || name === "Cuci Baton" ? "pcs" : "kg";
  const [deliveryMode, setDeliveryMode] = useState("kurir");
  const [distance, setDistance] = useState("2-4");
  const ongkirPrices = { "0-1": 0, "1-2": 5000, "2-4": 10000, "4-6": 15000, "6-10": 25000 };
  const getOngkir = (d) => ongkirPrices[d] || 0;
  const getDistanceLabel = (d) => {
    const labels = { "0-1": "Radius 0 - 1 km (Gratis)", "1-2": "Radius 1 - 2 km (Rp 5.000)", "2-4": "Radius 2 - 4 km (Ongkir +Rp 10.000)", "4-6": "Radius 4 - 6 km (Ongkir +Rp 15.000)", "6-10": "Radius 6 - 10 km (Ongkir +Rp 25.000)" };
    return labels[d] || "";
  };
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [qrisImageUrl, setQrisImageUrl] = useState("");
  const [qrisOrderId, setQrisOrderId] = useState("");
  const snapRef = useRef(null);
  const [testimoniText, setTestimoniText] = useState("");
  const [testimoniRating, setTestimoniRating] = useState(0);
  const [testimonials, setTestimonials] = useState(() => JSON.parse(localStorage.getItem("testimonials") || "[]"));
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const savedOrders = localStorage.getItem("customerOrders");
    if (savedOrders) {
      const parsed = JSON.parse(savedOrders);
      const customerOrders = parsed.filter(o => o.customer_name === customerName);
      setOrders(customerOrders);
    }

    const savedServices = localStorage.getItem("layananData");
    if (savedServices) {
      let parsed = JSON.parse(savedServices).filter(s => s.status === "Aktif" && s.name !== "Cuci Gold");
      const seen = new Set();
      parsed = parsed.filter(s => {
        if (seen.has(s.name)) return false;
        seen.add(s.name);
        return true;
      });
      parsed = parsed.map(s => {
        if (s.name === "Cuci Kiloan" && s.harga === "8000") return { ...s, harga: "6000" };
        if (s.name === "Cuci Setrika" && s.harga === "75000") return { ...s, harga: "12000" };
        if (s.name === "Express" && s.harga === "25000") return { ...s, harga: "7500" };
        return s;
      });
      localStorage.setItem("layananData", JSON.stringify(parsed));
      setServices(parsed);
    } else {
      setServices([
        { no: 1, name: "Cuci Kiloan", jenis: "Kiloan", harga: "6000", waktu: "24 jam" },
        { no: 2, name: "Cuci Satuan", jenis: "Satuan", harga: "15000", waktu: "12 jam" },
        { no: 3, name: "Express", jenis: "Express", harga: "15000", waktu: "4 jam" },
        { no: 4, name: "Cuci Karpet", jenis: "Spesial", harga: "50000", waktu: "48 jam" },
        { no: 5, name: "Cuci Sepatu", jenis: "Spesial", harga: "30000", waktu: "24 jam" },
        { no: 6, name: "Cuci Boneka", jenis: "Satuan", harga: "10000", waktu: "24 jam" },
        { no: 7, name: "Cuci Setrika", jenis: "Kiloan", harga: "12000", waktu: "24 jam" },
      ]);
    }
  }, [customerName]);

  useEffect(() => {
    if (document.getElementById("midtrans-script")) return;
    const script = document.createElement("script");
    script.id = "midtrans-script";
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "Mid-client-iy94PTFa4fsV-L8G");
    script.onload = () => {
      snapRef.current = window.snap;
    };
    document.body.appendChild(script);
  }, []);

  const handlePesan = (service) => {
    setSelectedService(service);
    setOrderForm({ weight: "", phone: "", address: "" });
    setDeliveryMode("kurir");
    setDistance("2-4");
    setShowOrderModal(true);
  };

  const handleSubmitOrder = () => {
    if (!orderForm.phone) {
      alert("Mohon isi nomor telepon!");
      return;
    }
    if (deliveryMode === "kurir" && !orderForm.address) {
      alert("Mohon isi alamat penjemputan!");
      return;
    }
    if (!orderForm.weight || parseFloat(orderForm.weight) <= 0) {
      alert("Mohon masukkan jumlah yang valid!");
      return;
    }
    if (deliveryMode === "kurir" && !distance) {
      alert("Mohon pilih jarak rumah ke toko!");
      return;
    }

    const biayaCuci = parseFloat(orderForm.weight) * parseInt(selectedService.harga);
    const ongkir = deliveryMode === "kurir" ? getOngkir(distance) : 0;
    const total = biayaCuci + ongkir;
    const newOrder = {
      id: Date.now(),
      order_code: "INV-" + Date.now(),
      customer_name: customerName,
      service_name: selectedService.name,
      weight: parseFloat(orderForm.weight),
      price: parseInt(selectedService.harga),
      biaya_cuci: biayaCuci,
      ongkir: ongkir,
      delivery_mode: deliveryMode,
      jarak: deliveryMode === "kurir" ? distance : null,
      total: total,
      status: "Menunggu",
      created_at: new Date().toISOString(),
      phone: orderForm.phone,
      address: orderForm.address
    };

    const savedOrders = localStorage.getItem("customerOrders");
    const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
    allOrders.push(newOrder);
    localStorage.setItem("customerOrders", JSON.stringify(allOrders));

    // Sync to pelanggan data
    const savedPelanggan = localStorage.getItem("pelangganData");
    let allPelanggan = savedPelanggan ? JSON.parse(savedPelanggan) : [];
    const exists = allPelanggan.some(p => p.name === customerName);
    if (!exists) {
      allPelanggan.push({
        no: allPelanggan.length + 1,
        name: customerName,
        email: customerName.toLowerCase().replace(/\s+/g, '') + '@gmail.com',
        phone: orderForm.phone,
        address: orderForm.address,
        order: 1,
        status: "Aktif"
      });
    } else {
      allPelanggan = allPelanggan.map(p => 
        p.name === customerName 
          ? { ...p, order: p.order + 1, phone: orderForm.phone, address: orderForm.address, email: p.email || (customerName.toLowerCase().replace(/\s+/g, '') + '@gmail.com') }
          : p
      );
    }
    localStorage.setItem("pelangganData", JSON.stringify(allPelanggan));

    // Sync to laporan data
    const savedLaporan = localStorage.getItem("laporanData");
    const allLaporan = savedLaporan ? JSON.parse(savedLaporan) : [];
    const formatTanggal = () => {
      const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const t = new Date();
      return `${t.getDate().toString().padStart(2, "0")} ${bulan[t.getMonth()]} ${t.getFullYear()}`;
    };
    allLaporan.push({
      no: allLaporan.length + 1,
      tanggal: formatTanggal(),
      pelanggan: customerName,
      layanan: selectedService.name,
      berat: orderForm.weight,
      harga: selectedService.harga,
      total: total.toString(),
      ongkir: ongkir.toString(),
      delivery_mode: deliveryMode,
      status: "Baru"
    });
    localStorage.setItem("laporanData", JSON.stringify(allLaporan));

    setOrders([...orders, newOrder]);
    setShowOrderModal(false);
    alert("Pesanan berhasil dibuat! Tim kami akan segera menghubungi Anda.");
    setCurrentTab("pesanan");
  };

  const markOrderAsPaid = (order, method) => {
    const savedOrders = localStorage.getItem("customerOrders");
    if (!savedOrders || !order) return false;
    const allOrders = JSON.parse(savedOrders);
    const updatedOrders = allOrders.map(o =>
      o.id === order.id
        ? { ...o, status: "Selesai", payment: method, payment_status: "Lunas", paid_at: new Date().toISOString() }
        : o
    );
    localStorage.setItem("customerOrders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders.filter(o => o.customer_name === customerName));

    const formatTanggalFromISO = (iso) => {
      const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const t = new Date(iso);
      return `${t.getDate().toString().padStart(2, "0")} ${bulan[t.getMonth()]} ${t.getFullYear()}`;
    };
    const tanggalOrder = formatTanggalFromISO(order.created_at);
    const savedLaporan = localStorage.getItem("laporanData");
    let allLaporan = savedLaporan ? JSON.parse(savedLaporan) : [];
    if (!allLaporan.some(l => l.pelanggan === order.customer_name && l.tanggal === tanggalOrder)) {
      allLaporan.push({
        tanggal: tanggalOrder,
        pelanggan: order.customer_name,
        layanan: order.service_name,
        berat: order.weight.toString(),
        harga: order.price.toString(),
        total: order.total.toString(),
        status: "Selesai"
      });
      allLaporan = allLaporan.map((l, i) => ({ ...l, no: i + 1 }));
      localStorage.setItem("laporanData", JSON.stringify(allLaporan));
    }
    return true;
  };

  const handlePayment = (order) => {
    setSelectedOrderForPayment(order);
    setPaymentMethod("cash");
    setPaymentError("");
    setShowPaymentModal(true);
  };

  const confirmCashPayment = () => {
    if (!selectedOrderForPayment) return;
    markOrderAsPaid(selectedOrderForPayment, "cash");
    setShowPaymentModal(false);
    setReceiptOrder({ ...selectedOrderForPayment, payment: "cash", payment_status: "Lunas", paid_at: new Date().toISOString() });
    setShowReceiptModal(true);
  };

  const handleMidtransPayment = async () => {
    if (!selectedOrderForPayment) return;
    setPaymentLoading(true);
    setPaymentError("");
    setQrisImageUrl("");
    try {
      const orderId = `QRIS-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const res = await fetch(`${API_URL}/midtrans/qris`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          gross_amount: selectedOrderForPayment.total,
          customer_details: {
            first_name: selectedOrderForPayment.customer_name,
            phone: selectedOrderForPayment.phone || "",
          },
        }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Backend server tidak merespon. Pastikan server sudah jalan.");
      }
      if (!res.ok) throw new Error(data.error || "Gagal mendapatkan QRIS");

      setQrisImageUrl(data.qr_url);
      setQrisOrderId(data.order_id);
    } catch (err) {
      setPaymentError(err.message || "Terjadi kesalahan.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const closeSidebar = () => {
    const cb = document.getElementById("mt");
    if (cb) cb.checked = false;
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `.mt-overlay{display:none}@media(max-width:768px){.mt-i:checked~.mt-overlay{display:block!important;position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;z-index:9999!important;background:rgba(0,0,0,0.3)!important;cursor:pointer!important}}`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const pendingOrders = orders.filter(o => o.status === "Menunggu");
  const processOrders = orders.filter(o => o.status === "Diproses");
  const completedOrders = orders.filter(o => o.status === "Selesai");

  return (
    <>
    <div className="customer-layout" style={styles.app}>
      <input type="checkbox" id="mt" className="mt-i" />

      <label htmlFor="mt" className="mt-overlay"></label>

      <aside className="customer-sidebar" style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <div style={styles.logoSection}>
            <div style={styles.logoIcon}>🧺</div>
            <div>
              <h1 style={styles.logoText}>Pinang Laundry</h1>
              <p style={styles.logoSub}>Bersih, Cepat, Terpercaya</p>
            </div>
          </div>

          <nav style={styles.nav}>
            <div onClick={() => { setCurrentTab("dashboard"); closeSidebar(); }} style={{ ...styles.navItem, ...(currentTab === "dashboard" ? styles.navActive : {}) }}>
              🏠 Dashboard
            </div>
            <div onClick={() => { setCurrentTab("pesanan"); closeSidebar(); }} style={{ ...styles.navItem, ...(currentTab === "pesanan" ? styles.navActive : {}) }}>
              📦 Pesanan Saya {pendingOrders.length > 0 && <span style={styles.badge}>{pendingOrders.length}</span>}
            </div>
            <div onClick={() => { setCurrentTab("layanan"); closeSidebar(); }} style={{ ...styles.navItem, ...(currentTab === "layanan" ? styles.navActive : {}) }}>
              🏷️ Layanan
            </div>
            <div onClick={() => { setCurrentTab("testimoni"); closeSidebar(); }} style={{ ...styles.navItem, ...(currentTab === "testimoni" ? styles.navActive : {}) }}>
              💬 Testimoni
            </div>
            <div onClick={() => { setCurrentTab("pengaturan"); closeSidebar(); }} style={{ ...styles.navItem, ...(currentTab === "pengaturan" ? styles.navActive : {}) }}>
              ⚙️ Pengaturan
            </div>
          </nav>
        </div>

          <div style={styles.profileWidget}>
            <div style={styles.avatarCircle}>👤</div>
            <div style={{ flex: 1 }}>
              <div style={styles.profName}>{customerName}</div>
              <div style={styles.profRole}>Pelanggan</div>
            </div>
            <button onClick={() => { localStorage.removeItem("customerLoggedIn"); navigate("/login"); }} style={styles.logoutBtn}>🚪</button>
          </div>
      </aside>

      <main className="customer-main" style={styles.main}>
        <label htmlFor="mt" className="mt-l">☰</label>
        <header style={styles.header}>
          <h2 style={styles.welcome}>Selamat datang, {customerName} 👋</h2>
          <div style={styles.headerRight}>
            <div style={styles.dateBox}>📅 {currentDate}</div>
          </div>
        </header>

        {currentTab === "dashboard" && (
          <div>
            <div style={styles.statsRow}>
              <div style={{ ...styles.statCard, background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <div style={styles.statIcon}>⏳</div>
                <div>
                  <div style={styles.statLabel}>Menunggu</div>
                  <div style={styles.statValue}>{pendingOrders.length}</div>
                </div>
              </div>
              <div style={{ ...styles.statCard, background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                <div style={styles.statIcon}>🔄</div>
                <div>
                  <div style={styles.statLabel}>Diproses</div>
                  <div style={styles.statValue}>{processOrders.length}</div>
                </div>
              </div>
              <div style={{ ...styles.statCard, background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                <div style={styles.statIcon}>✅</div>
                <div>
                  <div style={styles.statLabel}>Selesai</div>
                  <div style={styles.statValue}>{completedOrders.length}</div>
                </div>
              </div>
            </div>

            <section style={styles.card}>
              <h3 style={styles.cardTitle}>Layanan Populer</h3>
              <div style={styles.serviceGrid}>
                {services.slice(0, 3).map((s) => {
                  const iconMap = { "Cuci Kiloan": "👕", "Cuci Satuan": "👔", "Express": "⚡", "Cuci Karpet": "🟤", "Cuci Sepatu": "👟", "Cuci Boneka": "🧸" };
                  return (
                    <div key={s.no} style={styles.serviceCard}>
                      <div style={styles.serviceIcon}>{iconMap[s.name] || "🧺"}</div>
                      <div style={styles.serviceName}>{s.name}</div>
                      <div style={styles.servicePrice}>Rp {parseInt(s.harga).toLocaleString('id-ID')}/{s.jenis === "Satuan" ? "pcs" : "kg"}</div>
                      <div style={styles.serviceTime}><span>⏱️</span> <span>{s.waktu}</span></div>
                      <button onClick={() => { setSelectedService(s); setOrderForm({ weight: "", phone: "", address: "" }); setShowOrderModal(true); }} style={styles.pesanBtn}>Pesan Sekarang</button>
                    </div>
                  );
                })}
              </div>
            </section>

            {pendingOrders.length > 0 && (
              <section style={styles.card}>
                <h3 style={styles.cardTitle}>Pesanan Menunggu Diproses</h3>
                <div style={styles.orderList}>
                  {pendingOrders.slice(0, 3).map(order => (
                    <div key={order.id} style={styles.orderItem}>
                      <div style={styles.orderHeader}>
                        <span style={styles.orderCode}>{order.order_code}</span>
                        <span style={{ ...styles.orderStatus, backgroundColor: "#fef3c7", color: "#d97706" }}>
                          <span style={{ ...styles.orderStatusDot, backgroundColor: "#d97706" }}></span>
                          Menunggu
                        </span>
                      </div>
                      <div style={styles.orderDetail}>
                        <div style={styles.orderDetailRow}>
                          <span>{order.service_name}</span>
                          <span>Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                        <div style={styles.orderDetailRow}>
                          {order.address && <span style={{ color: "#94a3b8", fontSize: 12 }}>📍 {order.address}</span>}
                        </div>
                      </div>
                      <div style={styles.orderDate}>
                        <span>📅 {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {order.payment_status !== "Lunas" && (
                          <button onClick={() => handlePayment(order)} style={styles.bayarBtn}>Bayar</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {currentTab === "pesanan" && (
          <section style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ ...styles.cardTitle, margin: 0 }}>Riwayat Pesanan</h3>
              {orders.length > 0 && (
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{orders.length} pesanan</span>
              )}
            </div>
            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📦</div>
                <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>Belum ada pesanan</p>
                <p style={{ color: "#94a3b8", fontSize: 12, margin: "4px 0 20px" }}>Pilih layanan untuk memesan</p>
                <button onClick={() => setCurrentTab("layanan")} style={{ ...styles.submitBtn, width: "auto", padding: "12px 24px" }}>Lihat Layanan</button>
              </div>
            ) : (
              <div style={styles.orderList}>
                {orders.map(order => {
                  const statusStyle = getStatusBadge(order.status);
                  const isPaid = order.payment_status === "Lunas";
                  const paidStyle = isPaid
                    ? { backgroundColor: "#dcfce7", color: "#16a34a" }
                    : { backgroundColor: "#fef2f2", color: "#ef4444" };
                  return (
                    <div key={order.id} style={styles.orderItem}>
                      <div style={styles.orderHeader}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={styles.orderCode}>{order.order_code}</span>
                          {isPaid && <span style={{ fontSize: 10, color: "#22c55e" }}>✓ Paid</span>}
                        </div>
                        <span style={{ ...styles.orderStatus, backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                          <span style={{ ...styles.orderStatusDot, backgroundColor: statusStyle.color }}></span>
                          {order.status}
                        </span>
                      </div>
                      <div style={styles.orderDetail}>
                        <div style={styles.orderDetailRow}>
                          <strong>{order.service_name}</strong>
                          <span style={{ fontWeight: 700, color: "#1e293b" }}>Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                        <div style={styles.orderDetailRow}>
                          <span>Berat: {order.weight} {getUnit(order.service_name)}</span>
                          <span style={{ ...styles.orderPaymentPill, ...paidStyle }}>
                            {isPaid ? `✓ ${order.payment === "cash" ? "Tunai" : "QRIS"}` : "Belum Bayar"}
                          </span>
                        </div>
                        <div style={styles.orderDetailRow}>
                          {order.address && <span style={{ color: "#94a3b8", fontSize: 12 }}>📍 {order.address}</span>}
                          {order.phone && <span style={{ color: "#94a3b8", fontSize: 12 }}>📞 {order.phone}</span>}
                        </div>
                      </div>
                      <div style={styles.orderDate}>
                        <span>📅 {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <div style={{ display: "flex", gap: 8 }}>
                          {!isPaid && order.status !== "Selesai" && (
                            <button onClick={() => handlePayment(order)} style={styles.bayarBtn}>💳 Bayar</button>
                          )}
                          {isPaid && (
                            <button 
                              onClick={() => { setReceiptOrder(order); setShowReceiptModal(true); }} 
                              style={{ ...styles.cancelBtn, fontSize: 12, padding: "8px 14px" }}
                            >🧾 Struk</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {currentTab === "layanan" && (
          <section style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ ...styles.cardTitle, margin: 0 }}>Daftar Layanan</h3>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{services.length} layanan</span>
            </div>
            <div style={styles.serviceGridFull}>
              {services.map((s) => {
                const iconMap = { "Cuci Kiloan": "👕", "Cuci Satuan": "👔", "Express": "⚡", "Cuci Karpet": "🟤", "Cuci Sepatu": "👟", "Cuci Boneka": "🧸" };
                const categoryColors = {
                  "Kiloan": { border: "#3b82f6", badge: "#dbeafe", badgeText: "#2563eb" },
                  "Satuan": { border: "#8b5cf6", badge: "#ede9fe", badgeText: "#7c3aed" },
                  "Express": { border: "#f59e0b", badge: "#fef3c7", badgeText: "#d97706" },
                  "Spesial": { border: "#ec4899", badge: "#fce7f3", badgeText: "#db2777" },
                };
                const cc = categoryColors[s.jenis] || { border: "#64748b", badge: "#f1f5f9", badgeText: "#64748b", icon: "🧺" };
                return (
                  <div key={s.no} style={{ ...styles.serviceCardFull, borderTopColor: cc.border }}>
                    <div style={styles.serviceIconFull}>{iconMap[s.name] || "🧺"}</div>
                    <div style={{ ...styles.serviceBadge, background: cc.badge, color: cc.badgeText }}>{s.jenis}</div>
                    <div style={styles.serviceNameFull}>{s.name}</div>
                    <div style={styles.servicePriceFull}>Rp {parseInt(s.harga).toLocaleString('id-ID')}</div>
                    <div style={styles.serviceTimeFull}><span>⏱️</span> <span>Estimasi: {s.waktu}</span></div>
                    <button onClick={() => handlePesan(s)} style={styles.pesanBtnFull}>Pesan Sekarang</button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {currentTab === "testimoni" && (
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>💬 Testimoni</h3>

            {testimonials.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {testimonials.slice(-3).reverse().map((t, i) => (
                  <div key={i} style={{ padding: 16, background: "#f8fafc", borderRadius: 16, border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{t.name}</span>
                      <span style={{ fontSize: 14 }}>{Array(t.rating).fill("⭐").join("")}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.65, fontStyle: "italic" }}>"{t.text}"</p>
                  </div>
                ))}
              </div>
            )}

            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16, lineHeight: 1.65 }}>
              Bagikan pengalaman kamu menggunakan Pinang Laundry!
            </p>
            <textarea placeholder="Tulis testimoni kamu di sini..." value={testimoniText} onChange={e => setTestimoniText(e.target.value)} style={styles.textarea} />
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 12 }}>
              <span style={{ fontSize: 14, color: "#64748b", marginRight: 4 }}>Rating:</span>
              {[1,2,3,4,5].map(r => (
                <span key={r} onClick={() => setTestimoniRating(r)} style={{ fontSize: 24, cursor: "pointer", opacity: r <= testimoniRating ? 1 : 0.3, transition: "all 0.2s" }}>⭐</span>
              ))}
            </div>
            <button onClick={() => {
              if (!testimoniText || !testimoniRating) { alert("Isi testimoni dan rating!"); return; }
              const newT = { name: customerName, text: testimoniText, rating: testimoniRating };
              const updated = [...testimonials, newT];
              setTestimonials(updated);
              localStorage.setItem("testimonials", JSON.stringify(updated));
              setTestimoniText(""); setTestimoniRating(0);
              alert("Terima kasih! Testimoni kamu sudah dikirim.");
            }} style={{ ...styles.submitBtn, marginTop: 16 }}>Kirim Testimoni</button>
          </section>
        )}

        {currentTab === "pengaturan" && (
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>⚙️ Pengaturan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "username", label: "Username", value: localStorage.getItem("customerLoggedIn") || "-" },
                { key: "email", label: "Email", value: localStorage.getItem("customerEmail") || "-" },
                { key: "password", label: "Kata Sandi", value: "********" },
              ].map(field => (
                <div key={field.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "#f8fafc", borderRadius: 16, border: "1px solid #f1f5f9" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{field.label}</div>
                    <div style={{ fontSize: 14, color: "#64748b" }}>{field.value}</div>
                  </div>
                  <button style={styles.editBtn} onClick={() => { setEditField(field.key); setEditValue(""); }}>Edit</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {editField && (
          <div style={styles.modalOverlay} onClick={() => setEditField(null)}>
            <div style={{ ...styles.modal, width: 400 }} onClick={e => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>
                Edit {editField === "password" ? "Kata Sandi" : editField.charAt(0).toUpperCase() + editField.slice(1)}
              </h3>
              <div style={styles.modalContent}>
                <label style={styles.label}>
                  {editField === "password" ? "Kata Sandi Baru" : editField === "email" ? "Email Baru" : "Username Baru"}
                </label>
                <input
                  type={editField === "password" ? "text" : "text"}
                  placeholder={
                    editField === "password" ? "Masukkan kata sandi baru" :
                    editField === "name" ? "Masukkan nama baru" :
                    editField === "email" ? "Masukkan email baru" :
                    "Masukkan username baru"
                  }
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  style={styles.input}
                  autoFocus
                />
                <div style={styles.modalButtons}>
                  <button style={styles.cancelBtn} onClick={() => setEditField(null)}>Batal</button>
                  <button style={styles.submitBtn} onClick={() => {
                    if (!editValue.trim()) { alert("Mohon isi data!"); return; }
                    const customers = JSON.parse(localStorage.getItem("customers") || "[]");
                    const loggedInUser = localStorage.getItem("customerLoggedIn");
                    const idx = customers.findIndex(c => c.username === loggedInUser);
                    if (idx === -1) { alert("Data tidak ditemukan!"); return; }
                    const updated = [...customers];
                    if (editField === "name") {
                      updated[idx].name = editValue.trim();
                      localStorage.setItem("customerName", editValue.trim());
                    } else if (editField === "username") {
                      const exists = customers.some((c, i) => i !== idx && c.username === editValue.trim());
                      if (exists) { alert("Username sudah digunakan!"); return; }
                      updated[idx].username = editValue.trim();
                      localStorage.setItem("customerLoggedIn", editValue.trim());
                    } else if (editField === "email") {
                      updated[idx].email = editValue.trim();
                      localStorage.setItem("customerEmail", editValue.trim());
                    } else if (editField === "password") {
                      updated[idx].password = editValue.trim();
                    }
                    localStorage.setItem("customers", JSON.stringify(updated));
                    setEditField(null);
                    window.location.reload();
                  }}>Simpan</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showOrderModal && (
        <div style={styles.orderModalOverlay} onClick={() => setShowOrderModal(false)}>
          <div style={styles.orderModal} onClick={e => e.stopPropagation()}>
            <div style={styles.orderModalHeader}>
              <span>Pesan {selectedService?.name}</span>
              <button style={styles.orderModalClose} onClick={() => setShowOrderModal(false)}>✕</button>
            </div>
            <div style={styles.orderModalBody}>
              <div style={styles.infoHarga}>Harga: Rp {parseInt(selectedService?.harga || 0).toLocaleString('id-ID')}/{getUnit(selectedService?.name)}</div>

              <div style={styles.sectionLabel}>1. MASUKKAN JUMLAH ESTIMASI</div>
              <div style={styles.fieldBox}>
                <div style={styles.fieldRow}>
                  <span style={styles.fieldLabel}>Jumlah ({getUnit(selectedService?.name)})</span>
                  <input type="number" min="0" step="0.1" placeholder="0" value={orderForm.weight} onChange={e => setOrderForm({ ...orderForm, weight: e.target.value })} style={styles.orderInput} />
                </div>
              </div>

              <div style={styles.sectionLabel}>2. OPSI PENGIRIMAN</div>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel} onClick={() => setDeliveryMode("mandiri")}>
                  <input type="radio" name="delivery" checked={deliveryMode === "mandiri"} onChange={() => setDeliveryMode("mandiri")} style={styles.radio} />
                  <span>Antar Mandiri ke Outlet</span>
                </label>
                <label style={styles.radioLabel} onClick={() => setDeliveryMode("kurir")}>
                  <input type="radio" name="delivery" checked={deliveryMode === "kurir"} onChange={() => setDeliveryMode("kurir")} style={styles.radio} />
                  <span style={{ fontWeight: deliveryMode === "kurir" ? 700 : 400, color: deliveryMode === "kurir" ? "#2563eb" : "#1e293b" }}>Request Antar-Jemput Kurir</span>
                </label>
              </div>

              {deliveryMode === "kurir" && (
                <>
                  <div style={styles.sectionLabel}>3. INFORMASI PENJEMPUTAN</div>
                  <div style={styles.fieldBox}>
                    <div style={styles.fieldRow}>
                      <span style={styles.fieldLabel}>Nomor Telepon Aktif</span>
                      <input type="tel" placeholder="0812-3456-7890" value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} style={styles.orderInput} />
                    </div>
                    <div style={styles.fieldRow}>
                      <span style={styles.fieldLabel}>Pilih Jarak Rumah ke Toko</span>
                      <select value={distance} onChange={e => setDistance(e.target.value)} style={styles.orderSelect}>
                        <option value="0-1">Radius 0 - 1 km (Gratis)</option>
                        <option value="1-2">Radius 1 - 2 km (Rp 5.000)</option>
                        <option value="2-4">Radius 2 - 4 km (Ongkir +Rp 10.000)</option>
                        <option value="4-6">Radius 4 - 6 km (Ongkir +Rp 15.000)</option>
                        <option value="6-10">Radius 6 - 10 km (Ongkir +Rp 25.000)</option>
                      </select>
                    </div>
                    <div style={styles.fieldRow}>
                      <span style={styles.fieldLabel}>Alamat Lengkap Penjemputan</span>
                      <textarea placeholder="Jalan, Kelurahan, Kecamatan, Kota" value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} style={styles.orderTextarea} />
                    </div>
                  </div>
                </>
              )}

              {deliveryMode === "mandiri" && (
                <>
                  <div style={styles.sectionLabel}>3. INFORMASI PEMESAN</div>
                  <div style={styles.fieldBox}>
                    <div style={styles.fieldRow}>
                      <span style={styles.fieldLabel}>Nomor Telepon Aktif</span>
                      <input type="tel" placeholder="0812-3456-7890" value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} style={styles.orderInput} />
                    </div>
                  </div>
                </>
              )}

              <div style={styles.divider}></div>
              <div style={styles.ringkasan}>
                <div style={styles.ringkasanTitle}>RINGKASAN BIAYA</div>
                <div style={styles.ringkasanRow}>
                  <span>Total Cuci ({orderForm.weight || 0} {getUnit(selectedService?.name)} x Rp {parseInt(selectedService?.harga || 0).toLocaleString('id-ID')})</span>
                  <span>Rp {((parseFloat(orderForm.weight) || 0) * parseInt(selectedService?.harga || 0)).toLocaleString('id-ID')}</span>
                </div>
                {deliveryMode === "kurir" && (
                  <div style={styles.ringkasanRow}>
                    <span>Ongkos Kirim ({getDistanceLabel(distance)})</span>
                    <span>Rp {getOngkir(distance).toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div style={styles.divider}></div>
                <div style={styles.ringkasanTotal}>
                  <span>TOTAL ESTIMASI BAYAR</span>
                  <span>Rp {(((parseFloat(orderForm.weight) || 0) * parseInt(selectedService?.harga || 0)) + (deliveryMode === "kurir" ? getOngkir(distance) : 0)).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            <div style={styles.orderModalFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowOrderModal(false)}>Batal</button>
              <button style={styles.submitBtn} onClick={handleSubmitOrder}>Kirim Pesanan</button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && selectedOrderForPayment && (
        <div style={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Pembayaran Pesanan</h3>
            <div style={styles.modalContent}>
              <div style={styles.paymentOrderInfo}>
                <p><strong>{selectedOrderForPayment.service_name}</strong></p>
                <p>Kode: {selectedOrderForPayment.order_code}</p>
                <p style={styles.paymentTotal}>Total: Rp {selectedOrderForPayment.total.toLocaleString('id-ID')}</p>
              </div>
              
              <label style={styles.label}>Pilih Metode Pembayaran</label>
              <div style={styles.paymentOptions}>
                <div 
                  onClick={() => setPaymentMethod("cash")}
                  style={{ ...styles.paymentOption, ...(paymentMethod === "cash" ? styles.paymentOptionActive : {}) }}
                >
                  <span style={styles.paymentIcon}>💵</span>
                  <span>Cash</span>
                  <span style={styles.paymentDesc}>Bayar di tempat</span>
                </div>
                <div 
                  onClick={() => setPaymentMethod("qris")}
                  style={{ ...styles.paymentOption, ...(paymentMethod === "qris" ? styles.paymentOptionActive : {}) }}
                >
                  <span style={styles.paymentIcon}>📱</span>
                  <span>QRIS</span>
                  <span style={styles.paymentDesc}>Scan QR Code</span>
                </div>
              </div>

              {paymentMethod === "qris" && (
                <div style={styles.qrisSection}>
                  {!qrisImageUrl && !paymentLoading && (
                    <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
                      <div style={{ fontSize: 32, marginBottom: 8, display: "flex", justifyContent: "center", gap: 12 }}>
                        <span style={{ padding: "4px 8px", background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 700, color: "#1e293b" }}>QRIS</span>
                        <span style={{ padding: "4px 8px", background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 700, color: "#06b6d4" }}>GoPay</span>
                        <span style={{ padding: "4px 8px", background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 700, color: "#8b5cf6" }}>OVO</span>
                        <span style={{ padding: "4px 8px", background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 700, color: "#059669" }}>DANA</span>
                        <span style={{ padding: "4px 8px", background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 700, color: "#e11d48" }}>SPay</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0 0" }}>
                        Scan QRIS dengan aplikasi pembayaran
                      </p>
                    </div>
                  )}
                  {paymentError && (
                    <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: 10, borderRadius: 8, fontSize: 12, marginBottom: 12, textAlign: "center" }}>
                      {paymentError}
                    </div>
                  )}
                  {qrisImageUrl && (
                    <div style={{ textAlign: "center", padding: "8px 0" }}>
                      <img
                        src={qrisImageUrl}
                        alt="QRIS"
                        style={{ width: 250, height: 250, objectFit: "contain" }}
                      />
                      <p style={{ fontSize: 12, color: "#475569", margin: "8px 0" }}>
                        Scan QR Code di atas dengan aplikasi pembayaran
                      </p>
                      <button
                        style={{ ...styles.submitBtn, width: "100%" }}
                        onClick={() => {
                          markOrderAsPaid(selectedOrderForPayment, "qris");
                          setShowPaymentModal(false);
                          setReceiptOrder({ ...selectedOrderForPayment, payment: "qris", payment_status: "Lunas", paid_at: new Date().toISOString(), order_code: qrisOrderId });
                          setShowReceiptModal(true);
                          setQrisImageUrl("");
                          setQrisOrderId("");
                        }}
                      >
                        Saya Sudah Bayar
                      </button>
                    </div>
                  )}
                  {!qrisImageUrl && (
                    <button
                      style={{ ...styles.midtransBtn, opacity: paymentLoading ? 0.6 : 1 }}
                      onClick={handleMidtransPayment}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? "Memproses..." : "Bayar via Midtrans"}
                    </button>
                  )}
                </div>
              )}

              <div style={styles.modalButtons}>
                <button style={styles.cancelBtn} onClick={() => setShowPaymentModal(false)}>Batal</button>
                {paymentMethod === "cash" && (
                  <button style={styles.submitBtn} onClick={confirmCashPayment}>Konfirmasi Bayar Cash</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showReceiptModal && receiptOrder && (
        <div style={styles.modalOverlay} onClick={() => setShowReceiptModal(false)}>
          <div style={{ ...styles.modal, width: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 4 }}>🧺</div>
              <h3 style={{ margin: 0, color: "#1e40af", fontSize: 18 }}>PINANG LAUNDRY</h3>
              <p style={{ margin: "2px 0", fontSize: 11, color: "#64748b" }}>Bersih, Cepat, Terpercaya</p>
              <p style={{ margin: "2px 0", fontSize: 10, color: "#94a3b8" }}>Jl. Pinang Raya, Margonda Depok</p>
            </div>
            <div style={{ borderTop: "2px dashed #e2e8f0", borderBottom: "2px dashed #e2e8f0", padding: "16px 0", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#64748b" }}>Invoice</span>
                <span style={{ fontWeight: 700 }}>{receiptOrder.order_code}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#64748b" }}>Tanggal</span>
                <span style={{ fontWeight: 700 }}>{new Date(receiptOrder.paid_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#64748b" }}>Pelanggan</span>
                <span style={{ fontWeight: 700 }}>{receiptOrder.customer_name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#64748b" }}>Metode</span>
                <span style={{ fontWeight: 700 }}>{receiptOrder.payment === "cash" ? "Tunai" : "QRIS (Midtrans)"}</span>
              </div>
            </div>
            <table style={{ width: "100%", fontSize: 12, marginBottom: 16, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ textAlign: "left", padding: "6px 4px", color: "#64748b", fontWeight: 600 }}>Layanan</th>
                  <th style={{ textAlign: "center", padding: "6px 4px", color: "#64748b", fontWeight: 600 }}>Berat</th>
                  <th style={{ textAlign: "center", padding: "6px 4px", color: "#64748b", fontWeight: 600 }}>Harga</th>
                  <th style={{ textAlign: "right", padding: "6px 4px", color: "#64748b", fontWeight: 600 }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "6px 4px", fontWeight: 700 }}>{receiptOrder.service_name}</td>
                  <td style={{ textAlign: "center", padding: "6px 4px" }}>{receiptOrder.weight} {getUnit(receiptOrder.service_name)}</td>
                  <td style={{ textAlign: "center", padding: "6px 4px" }}>Rp {receiptOrder.price.toLocaleString('id-ID')}</td>
                  <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 700 }}>Rp {receiptOrder.total.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #1e293b", paddingTop: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>TOTAL</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#166534" }}>Rp {receiptOrder.total.toLocaleString('id-ID')}</span>
            </div>
            <div style={{ textAlign: "center", padding: "8px", background: "#f0fdf4", borderRadius: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>✓ LUNAS</span>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>
              Terima kasih telah memilih Pinang Laundry!<br />
              Bersih, Cepat, Terpercaya.<br />
              Sampai jumpa di cucian bersih berikutnya, ya! 👋
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={styles.cancelBtn} onClick={() => setShowReceiptModal(false)}>Tutup</button>
              <button style={styles.submitBtn} onClick={() => {
                const pw = window.open('', '_blank');
                if (!pw) { alert("Izinkan popup untuk mencetak struk"); return; }
                const tgl = new Date(receiptOrder.paid_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                pw.document.write(`
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Struk Pembayaran - Pinang Laundry</title>
<style>
  @page { margin: 10mm; size: 80mm auto; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; font-size: 12px; color: #1e293b; padding: 10px; }
  .center { text-align: center; }
  .header { text-align: center; margin-bottom: 12px; }
  .header h2 { font-size: 16px; margin: 2px 0; }
  .header p { font-size: 10px; color: #64748b; }
  .divider { border-top: 1px dashed #94a3b8; margin: 8px 0; }
  .row { display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0; }
  .label { color: #64748b; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { text-align: left; padding: 4px 2px; border-bottom: 1px solid #94a3b8; }
  td { padding: 4px 2px; }
  .total { display: flex; justify-content: space-between; font-size: 14px; font-weight: 800; padding: 8px 0; border-top: 2px solid #1e293b; }
  .lunas { text-align: center; padding: 6px; background: #f0fdf4; font-weight: 800; color: #16a34a; font-size: 13px; margin: 8px 0; }
  .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 8px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
  <div class="header">
    <div style="font-size:24px">🧺</div>
    <h2>PINANG LAUNDRY</h2>
    <p>Bersih, Cepat, Terpercaya</p>
    <p>Jl. Pinang Raya, Margonda Depok</p>
  </div>
  <div class="divider"></div>
  <div class="row"><span class="label">Invoice</span><span>${receiptOrder.order_code}</span></div>
  <div class="row"><span class="label">Tanggal</span><span>${tgl}</span></div>
  <div class="row"><span class="label">Pelanggan</span><span>${receiptOrder.customer_name}</span></div>
  <div class="row"><span class="label">Pembayaran</span><span>${receiptOrder.payment === "cash" ? "Tunai" : "QRIS"}</span></div>
  <div class="divider"></div>
  <table>
    <thead><tr><th>Layanan</th><th style="text-align:center">Berat</th><th style="text-align:center">Harga</th><th style="text-align:right">Subtotal</th></tr></thead>
    <tbody><tr><td>${receiptOrder.service_name}</td><td style="text-align:center">${receiptOrder.weight} ${getUnit(receiptOrder.service_name)}</td><td style="text-align:center">Rp ${receiptOrder.price.toLocaleString('id-ID')}</td><td style="text-align:right">Rp ${receiptOrder.total.toLocaleString('id-ID')}</td></tr></tbody>
  </table>
  <div class="total"><span>TOTAL</span><span>Rp ${receiptOrder.total.toLocaleString('id-ID')}</span></div>
  <div class="lunas">✓ LUNAS</div>
  <div class="footer">
    Terima kasih telah memilih Pinang Laundry!<br/>
    Bersih, Cepat, Terpercaya.<br/>
    Sampai jumpa di cucian bersih berikutnya, ya! 👋
  </div>
  <script>window.print()</script>
</body></html>`);
                pw.document.close();
              }}>🖨️ Cetak</button>
            </div>
          </div>
        </div>
      )}

    </div>

      <Chatbot />
    </>
  );
}

const styles = {
  app: { display: "flex", minHeight: "100vh", backgroundColor: "#f0f7ff", color: "#1e293b" },

  sidebar: { width: 260, backgroundColor: "#fff", padding: "30px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #e2e8f0", position: "relative", zIndex: 1 },
  sidebarTop: { display: "flex", flexDirection: "column", gap: 40 },
  logoSection: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { width: 40, height: 40, background: "linear-gradient(135deg, #3b82f6, #6366f1)", borderRadius: 12, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" },
  logoText: { fontSize: 18, fontWeight: 700, color: "#1e40af", margin: 0 },
  logoSub: { fontSize: 10, color: "#94a3b8", margin: 0 },
  nav: { display: "flex", flexDirection: "column", gap: 6 },
  navItem: { padding: "12px 16px", borderRadius: 12, color: "#64748b", fontSize: 14, fontWeight: 400, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navActive: { background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)" },
  badge: { backgroundColor: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: 10, fontSize: 12, fontWeight: 400, letterSpacing: "+0.3px" },
  profileWidget: { display: "flex", alignItems: "center", gap: 12, padding: 14, background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", borderRadius: 18, border: "1px solid #e2e8f0" },
  avatarCircle: { width: 40, height: 40, background: "linear-gradient(135deg, #c7d2fe, #818cf8)", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 18 },
  profName: { fontSize: 14, fontWeight: 400 },
  profRole: { fontSize: 10, color: "#94a3b8" },
  logoutBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 18, transition: "all 0.2s", opacity: 0.6, ":hover": { opacity: 1 } },

  main: { flex: 1, padding: "30px 40px", overflowY: "auto", minWidth: 0, position: "relative", zIndex: 1 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  welcome: { fontSize: 28, fontWeight: 700, margin: 0, color: "#1e293b" },
  headerRight: { display: "flex", alignItems: "center", gap: 15 },
  dateBox: { padding: "10px 18px", background: "#fff", borderRadius: 14, fontSize: 14, fontWeight: 400, border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", letterSpacing: "+0.3px" },

  statsRow: { display: "flex", gap: 20, marginBottom: 25 },
  statCard: { flex: 1, padding: "20px 24px", borderRadius: 20, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" },
  statIcon: { fontSize: 32, width: 56, height: 56, borderRadius: 16, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,0.9)" },
  statLabel: { fontSize: 14, color: "#fff", fontWeight: 400, opacity: 0.9, letterSpacing: "+0.3px" },
  statValue: { fontSize: 28, fontWeight: 700, color: "#fff" },

  card: { background: "#fff", padding: 28, borderRadius: 28, boxShadow: "0 4px 16px rgba(0,0,0,0.04)", minWidth: 0, marginBottom: 24 },
  cardTitle: { fontSize: 22, fontWeight: 600, margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: 8, letterSpacing: "-0.5px" },

  serviceGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
  serviceCard: { padding: 20, background: "#f8fafc", borderRadius: 20, textAlign: "center", border: "1px solid #f1f5f9", transition: "all 0.3s", cursor: "default", ":hover": { transform: "translateY(-4px)", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" } },
  serviceIcon: { fontSize: 36, marginBottom: 10 },
  serviceName: { fontSize: 20, fontWeight: 600, marginBottom: 6 },
  servicePrice: { fontSize: 22, fontWeight: 700, color: "#3b82f6", marginBottom: 4 },
  serviceTime: { fontSize: 14, color: "#64748b", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 },
  pesanBtn: { background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" },

  orderList: { display: "flex", flexDirection: "column", gap: 14 },
  orderItem: { padding: 20, background: "#f8fafc", borderRadius: 20, border: "1px solid #f1f5f9", transition: "all 0.2s", ":hover": { borderColor: "#cbd5e1" } },
  orderHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  orderCode: { fontSize: 14, fontWeight: 400, color: "#1e293b" },
  orderStatus: { padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 400, display: "flex", alignItems: "center", gap: 5, letterSpacing: "+0.3px" },
  orderDetail: { display: "flex", flexDirection: "column", gap: 6, fontSize: 16, color: "#475569", lineHeight: 1.65 },
  orderDetailRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  orderDate: { marginTop: 14, fontSize: 14, color: "#94a3b8", display: "flex", justifyContent: "space-between", alignItems: "center", letterSpacing: "+0.3px" },
  orderPaymentPill: { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 400, letterSpacing: "+0.3px" },
  bayarBtn: { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" },

  serviceGridFull: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 },
  serviceCardFull: { padding: 24, background: "#f8fafc", borderRadius: 20, textAlign: "center", borderTop: "4px solid #3b82f6", transition: "all 0.3s", ":hover": { transform: "translateY(-6px)", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" } },
  serviceBadge: { display: "inline-block", padding: "4px 12px", background: "#e0f2fe", color: "#0284c7", borderRadius: 20, fontSize: 12, fontWeight: 400, marginBottom: 10, letterSpacing: "+0.3px" },
  serviceIconFull: { fontSize: 40, marginBottom: 10 },
  serviceNameFull: { fontSize: 20, fontWeight: 600, marginBottom: 8 },
  servicePriceFull: { fontSize: 22, fontWeight: 700, color: "#3b82f6", marginBottom: 4 },
  serviceTimeFull: { fontSize: 14, color: "#64748b", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 },
  pesanBtnFull: { background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: "pointer", width: "100%", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "white", borderRadius: 28, padding: 32, width: 440, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" },
  modalTitle: { fontSize: 22, fontWeight: 600, margin: "0 0 20px 0", textAlign: "center", letterSpacing: "-0.5px" },
  modalContent: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 14, fontWeight: 400, color: "#64748b", letterSpacing: "+0.3px" },
  priceDisplay: { fontSize: 28, fontWeight: 700, color: "#3b82f6" },
  input: { padding: "12px 16px", borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 16, lineHeight: 1.65 },
  totalDisplay: { fontSize: 24, fontWeight: 700, color: "#059669" },
  textarea: { padding: "12px 16px", borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 16, lineHeight: 1.65, minHeight: 80, resize: "vertical" },
  modalButtons: { display: "flex", gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 14, border: "2px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 16, fontWeight: 400, color: "#64748b" },
  submitBtn: { flex: 1, padding: 14, borderRadius: 14, border: "none", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", cursor: "pointer", fontSize: 16, fontWeight: 700, boxShadow: "0 4px 12px rgba(59,130,246,0.3)" },

  orderModalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  orderModal: { background: "#fff", borderRadius: 20, width: 520, maxHeight: "90vh", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" },
  orderModalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #e2e8f0", fontSize: 18, fontWeight: 700, color: "#1e293b" },
  orderModalClose: { width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f1f5f9", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" },
  orderModalBody: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", flex: 1 },
  infoHarga: { textAlign: "center", fontSize: 15, color: "#64748b", padding: "10px 16px", background: "#f0f7ff", borderRadius: 10, fontWeight: 600 },
  sectionLabel: { fontSize: 13, fontWeight: 700, color: "#3b82f6", letterSpacing: "0.5px" },
  fieldBox: { background: "#f8fafc", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  fieldRow: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: 600, color: "#475569" },
  orderInput: { padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" },
  orderSelect: { padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", background: "#fff", width: "100%", cursor: "pointer", boxSizing: "border-box" },
  orderTextarea: { padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", background: "#fff", width: "100%", minHeight: 70, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" },
  radioGroup: { display: "flex", flexDirection: "column", gap: 8 },
  radioLabel: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 14, fontWeight: 500, background: "#fff", transition: "all 0.2s" },
  radio: { width: 18, height: 18, accentColor: "#3b82f6", cursor: "pointer" },
  divider: { height: 1, background: "#e2e8f0", margin: "4px 0" },
  ringkasan: { display: "flex", flexDirection: "column", gap: 8 },
  ringkasanTitle: { fontSize: 13, fontWeight: 700, color: "#1e293b", letterSpacing: "0.5px" },
  ringkasanRow: { display: "flex", justifyContent: "space-between", fontSize: 14, color: "#475569" },
  ringkasanTotal: { display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#059669", padding: "8px 0" },
  orderModalFooter: { display: "flex", gap: 12, padding: "16px 24px", borderTop: "1px solid #e2e8f0" },
  editBtn: { padding: "8px 20px", borderRadius: 10, border: "2px solid #3b82f6", background: "transparent", color: "#3b82f6", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" },
  paymentOrderInfo: { background: "#f8fafc", padding: 16, borderRadius: 16, textAlign: "center" },
  paymentTotal: { fontSize: 22, fontWeight: 700, color: "#059669", margin: 0 },
  qrisSection: { textAlign: "center", padding: 16, background: "#f8fafc", borderRadius: 16, marginTop: 12 },
  midtransBtn: { width: "100%", padding: 14, borderRadius: 14, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", cursor: "pointer", fontSize: 16, fontWeight: 700, boxShadow: "0 4px 12px rgba(99,102,241,0.3)" },
  paymentOptions: { display: "flex", gap: 12, marginBottom: 12 },
  paymentOption: { flex: 1, padding: 18, borderRadius: 16, border: "2px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "all 0.2s" },
  paymentOptionActive: { borderColor: "#3b82f6", background: "#eff6ff" },
  paymentIcon: { fontSize: 32, marginBottom: 8 },
  paymentDesc: { fontSize: 14, color: "#64748b", marginTop: 4, letterSpacing: "+0.3px" }
};