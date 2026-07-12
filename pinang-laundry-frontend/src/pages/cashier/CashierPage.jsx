import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import useOrders from "../../hooks/useOrders";
import { QRCodeCanvas } from "qrcode.react";

export default function CashierPage() {
  const { orders, addOrder } = useOrders();

  const [customer, setCustomer] = useState("");
  const [service, setService] = useState("Cuci Kiloan");
  const [receipt, setReceipt] = useState(null);
  const [showQris, setShowQris] = useState(false);
  const [paid, setPaid] = useState(false);
  const [qrisData, setQrisData] = useState(() => localStorage.getItem("qrisMerchant") || "");

  const getPrice = (service) => {
    switch (service) {
      case "Cuci Kiloan": return 20000;
      case "Setrika": return 15000;
      case "Express": return 30000;
      default: return 20000;
    }
  };

  const handleCheckout = async () => {
    if (!customer) {
      alert("Nama pelanggan wajib diisi");
      return;
    }

    const newOrder = {
      customer,
      service,
      total: getPrice(service),
      status: "Proses",
    };

    try {
      const saved = await addOrder(newOrder);
      setReceipt(saved || newOrder);
      setPaid(false);
      setCustomer("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmPayment = () => {
    setPaid(true);
    setShowQris(false);
  };

  return (
    <MainLayout>
      <h2>🧺 Cashier POS Laundry</h2>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Nama pelanggan"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />

        <select
          style={styles.input}
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option>Cuci Kiloan</option>
          <option>Setrika</option>
          <option>Express</option>
        </select>

        <button style={styles.button} onClick={handleCheckout}>
          Checkout
        </button>
      </div>

      {receipt && (
        <div style={styles.receipt} id="receipt">
          <h3>🧺 PINANG LAUNDRY</h3>
          <p>No Transaksi: #{Date.now()}</p>

          <hr />

          <p><b>Pelanggan:</b> {receipt.customer}</p>
          <p><b>Layanan:</b> {receipt.service}</p>
          <p><b>Total:</b> Rp {receipt.total.toLocaleString("id-ID")}</p>
          <p><b>Status:</b>{" "}
            <span style={{ color: paid ? "#22c55e" : "#f97316", fontWeight: 700 }}>
              {paid ? "Lunas (QRIS)" : "Belum Bayar"}
            </span>
          </p>

          <hr />

          <small>Terima kasih 🙏</small>

          <br /><br />

          <div style={styles.receiptActions}>
            {!paid && (
              <button style={{ ...styles.button, background: "#22c55e" }} onClick={() => setShowQris(true)}>
                📱 Bayar QRIS
              </button>
            )}
            <button style={{ ...styles.button, background: "#64748b" }} onClick={() => window.print()}>
              🖨️ Print Struk
            </button>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: 30 }}>📦 Order Hari Ini</h3>

      {orders.map((o) => (
        <div key={o.id} style={styles.card}>
          <p><b>{o.customer}</b></p>
          <p>{o.service}</p>
          <p>Rp {o.total}</p>
          <p>Status: {o.status}</p>
        </div>
      ))}

      {showQris && (
        <div style={styles.modalOverlay} onClick={() => setShowQris(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.qrisHeader}>
              <span style={styles.qrisHeaderIcon}>📱</span>
              <h3 style={styles.qrisHeaderTitle}>Pembayaran QRIS</h3>
              <p style={styles.qrisHeaderSub}>Scan QR code untuk membayar</p>
            </div>

            <div style={styles.qrDisplay}>
              {qrisData ? (
                <div style={styles.qrWrap}>
                  <QRCodeCanvas value={qrisData} size={180} level="M" />
                </div>
              ) : (
                <div style={styles.qrBox}>
                  <span style={styles.qrIcon}>📱</span>
                  <p style={styles.qrText}>QRIS</p>
                  <p style={styles.qrHint}>Isi data merchant QRIS dulu</p>
                </div>
              )}
            </div>

            <div style={styles.qrInfo}>
              <div style={styles.qrInfoRow}>
                <span style={styles.qrInfoLabel}>Total</span>
                <span style={styles.qrInfoValue}>Rp {receipt?.total?.toLocaleString("id-ID")}</span>
              </div>
              <div style={styles.qrInfoRow}>
                <span style={styles.qrInfoLabel}>Pelanggan</span>
                <span style={styles.qrInfoValue}>{receipt?.customer}</span>
              </div>
            </div>

            <details style={styles.qrisSettings}>
              <summary style={styles.qrisSummary}>⚙️ Atur Data Merchant QRIS</summary>
              <input
                style={styles.qrisInput}
                placeholder="Tempel data QRIS merchant Anda di sini"
                value={qrisData}
                onChange={(e) => { setQrisData(e.target.value); localStorage.setItem("qrisMerchant", e.target.value); }}
              />
              <p style={styles.qrisNote}>
                Data QRIS dari bank/e-wallet Anda (teks panjang mulai "000201010211...")
              </p>
            </details>

            <button style={styles.qrisConfirm} onClick={handleConfirmPayment}>
              ✅ Konfirmasi Sudah Bayar
            </button>
            <button style={styles.qrisCancel} onClick={() => setShowQris(false)}>
              Batal
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

const styles = {
  form: { display: "flex", gap: 10, marginTop: 20 },
  input: { padding: 8, border: "1px solid #ccc", borderRadius: 5 },
  button: { padding: "8px 12px", background: "#1e88e5", color: "white", border: "none", borderRadius: 5, cursor: "pointer" },
  receipt: { marginTop: 20, padding: 15, width: 260, border: "1px dashed black", background: "#fff" },
  receiptActions: { display: "flex", gap: 8 },
  card: { padding: 10, marginTop: 10, border: "1px solid #ddd", borderRadius: 5 },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "white", borderRadius: 24, width: 380, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },

  qrisHeader: { background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)", padding: "28px 24px 24px", textAlign: "center" },
  qrisHeaderIcon: { fontSize: 40, display: "block", marginBottom: 8 },
  qrisHeaderTitle: { fontSize: 20, fontWeight: 800, color: "#fff", margin: 0 },
  qrisHeaderSub: { fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "4px 0 0" },

  qrDisplay: { display: "flex", justifyContent: "center", padding: "24px 24px 0" },
  qrWrap: { padding: 16, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" },
  qrBox: { width: 180, height: 180, background: "#f8fafc", borderRadius: 16, border: "2px dashed #cbd5e1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
  qrIcon: { fontSize: 48 },
  qrText: { fontSize: 18, fontWeight: 800, color: "#1e293b", margin: "4px 0" },
  qrHint: { fontSize: 11, color: "#94a3b8" },

  qrInfo: { background: "#eff6ff", borderRadius: 12, margin: "16px 24px", padding: "14px 16px" },
  qrInfoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" },
  qrInfoLabel: { fontSize: 13, color: "#64748b" },
  qrInfoValue: { fontSize: 14, fontWeight: 700, color: "#1e293b" },

  qrisSettings: { margin: "0 24px 16px", textAlign: "left" },
  qrisSummary: { fontSize: 13, color: "#3b82f6", fontWeight: 700, cursor: "pointer", marginBottom: 8 },
  qrisInput: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12, boxSizing: "border-box" },
  qrisNote: { fontSize: 11, color: "#94a3b8", marginTop: 6 },

  qrisConfirm: { display: "block", width: "calc(100% - 48px)", margin: "0 24px 12px", padding: 14, borderRadius: 12, border: "none", background: "#22c55e", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  qrisCancel: { display: "block", width: "calc(100% - 48px)", margin: "0 24px 24px", padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  qrisNote: { fontSize: 11, color: "#94a3b8", marginTop: 6 },
  modalButtons: { display: "flex", gap: 12 },
  modalCancel: { flex: 1, padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  modalConfirm: { flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#22c55e", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 },
};
