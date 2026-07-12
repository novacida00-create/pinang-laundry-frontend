import { useState, useEffect, useRef } from "react";
import Icon from "../../utils/icons.jsx";

const faqData = [
  // Salam
  { keywords: ["halo", "hello", "hi", "hai", "hey", "assalam", "pagi", "siang", "sore", "malam"], 
    answer: "Halo!\nSelamat datang di Pinang Laundry.\nAda yang bisa saya bantu?" },
  
  // Harga
  { keywords: ["harga", "biaya", "tarif", "cost", "price", "berapa", "rpm", "rp"], 
    answer: "Harga Layanan Kami:\n\n• Cuci Kiloan: Rp 8.000/kg\n• Express: Rp 25.000/kg\n• Cuci Karpet: Rp 50.000/pcs\n• Cuci Sepatu: Rp 30.000/pcs\n• Cuci Boneka: Rp 10.000/pcs\n• Setrika Saja: Rp 5.000/kg" },
  
  // Layanan
  { keywords: ["layanan", "service", "jasa", "apa saja", "jenis"], 
    answer: "Layanan Kami:\n\n✓ Cuci Kiloan (per kg)\n✓ Express (4 jam jadi)\n✓ Cuci Karpet\n✓ Cuci Sepatu\n✓ Cuci Boneka\n✓ Cuci Jaket\n✓ Cuci Jas\n✓ Setrika Saja" },
  
  // Waktu
  { keywords: ["waktu", "lama", "proses", "selesai", "jam", "hari", "durasi", "estimasi"], 
    answer: "Waktu Proses:\n\n• Cuci Kiloan: 24 jam\n• Express: 4 jam\n• Cuci Karpet: 48 jam\n• Cuci Sepatu: 24 jam\n• Cuci Boneka: 24 jam\n• Cuci Jas: 48 jam" },
  
  // Cara Pesan
  { keywords: ["cara", "cara pesan", "cara order", "order", "booking", "pesanan", "Bagaimana"], 
    answer: "Cara Memesan:\n\n1. Login di halaman customer\n2. Pilih menu \"Layanan\"\n3. Klik \"Pesan\" pada layanan yang diinginkan\n4. Isi formulir (berat, telepon, alamat)\n5. Klik \"Kirim Pesanan\"\n6. Tunggu konfirmasi dari admin" },
  
  // Pembayaran
  { keywords: ["bayar", "pembayaran", "bayar bagaimana", "cash", "qris", "transfer", "tunai"], 
    answer: "Metode Pembayaran:\n\n✓ Cash - Bayar langsung di tempat\n✓ QRIS - Scan QR Code untuk pembayaran digital\n\nPembayaran dilakukan saat:\n• Setelah laundry selesai (pickup)\n• Atau saat penjemputan laundry" },
  
  // Status Pesanan
  { keywords: ["status", "cek status", "cek pesanan", "tracking", "kemana", "dimana"], 
    answer: "Cara Cek Status Pesanan:\n\n1. Login ke halaman customer\n2. Buka menu \"Pesanan Saya\"\n3. Lihat status pesanan Anda\n\nStatus Pesanan:\n• Menunggu - Pesanan baru, menunggu konfirmasi\n• Diproses - Laundry sedang dikerjakan\n• Selesai - Laundry siap diambil" },
  
  // Login
  { keywords: ["login", "masuk", "signin", "akun", "registrasi", "daftar"], 
    answer: "Login Customer:\n\n• Buka /customer/login\n• Masukkan nama dan password\n• Jika belum punya akun, hubungi admin" },
  
  // Alamat
  { keywords: ["alamat", "location", "lokasi", "alamat dimana", "alamat jalan"], 
    answer: "Pinang Laundry\n\nJl. Braga No. 56, Bandung\n\nJam Buka:\nSenin - Minggu: 07.00 - 20.00" },
  
  // Kontak
  { keywords: ["kontak", "hubungi", "telepon", "hp", "wa", "whatsapp", "email"], 
    answer: "Hubungi Kami:\n\n• Telepon: 0812-3456-7890\n• WhatsApp: 0812-3456-7890\n• Email: pinanglaundry@gmail.com" },
  
  // Complaint/Keluhan
  { keywords: ["complaint", "keluhan", "masalah", "kesal", "marah", "kecewa", "tidak puas"], 
    answer: "Mohon maaf atas ketidaknyamanan.\nSilakan hubungi kami:\n0812-3456-7890\nKami akan segera membantu menyelesaikan masalah Anda." },
  
  // Tentang Aplikasi
  { keywords: ["aplikasi", "app", "website", "sistem", "platform", "web", "program"], 
    answer: "Sistem Pinang Laundry:\n\n• Website untuk customer memesan layanan\n• Admin mengelola pesanan dan pelanggan\n• Chatbot ini untuk bantuan Anda\n\nMenu di Customer:\n- Dashboard: Ringkasan pesanan\n- Pesanan Saya: Riwayat & status\n- Layanan: Pilih layanan & pesan" },
  
  // FAQ
  { keywords: ["faq", "pertanyaan", "tanya", "bantuan", "help", "bantu"], 
    answer: "FAQ - Pertanyaan Umum:\n\n• Cara memesan layanan?\n• Berapa harga laundry?\n• Berapa lama waktu proses?\n• Bagaimana cara pembayaran?\n• Bagaimana cek status pesanan?\n\nKetik pertanyaan di atas untuk jawaban!" },
  
  // Penjemputan
  { keywords: ["jemput", "pickup", "antar", "delivery", "kirim"], 
    answer: "Layanan Penjemputan:\n\nYa, kami menyediakan layanan penjemputan laundry ke alamat Anda.\n\nSaat memesan, masukkan alamat lengkap pada formulir pesanan.\nTim kami akan menjemput laundry sesuai jadwal." },
  
  // Diskon
  { keywords: ["diskon", "promo", "promosi", "potongan", "bonus"], 
    answer: "Promo & Diskon:\n\nUntuk saat ini belum ada promo khusus.\nNantikan informasi promo di website kami!\n\nuntuk info promo, hubungi admin." },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [list, setList] = useState([
    { from: "bot", text: "Halo!\nSelamat datang di Pinang Laundry.\nKetik pertanyaan Anda atau pilih dari menu:\n\n• Cara pesan\n• Harga layanan\n• Status pesanan\n• Pembayaran" }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [list]);

  const getReply = (input) => {
    const lower = input.toLowerCase();
    
    for (const item of faqData) {
      for (const keyword of item.keywords) {
        if (lower.includes(keyword)) {
          return item.answer;
        }
      }
    }
    
    return "Maaf, saya tidak mengerti pertanyaan Anda.\n\nCoba tanyakan:\n• Cara pesan layanan\n• Harga laundry\n• Status pesanan\n• Pembayaran\n• Lama waktu proses\n• Cara hubungi kami";
  };

  const send = () => {
    if (!msg.trim()) return;
    
    const reply = getReply(msg);
    setList([...list, { from: "user", text: msg }, { from: "bot", text: reply }]);
    setMsg("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") send();
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={() => setOpen(!open)}>
        <Icon name="message" size={30} />
        <span style={styles.badge}>Chat</span>
      </button>

      {open && (
        <div style={styles.chatbox}>
          <div style={styles.header}>
            <span><Icon name="robot" size={18} /> Asisten Pinang Laundry</span>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}><Icon name="x" size={18} /></button>
          </div>
          
          <div style={styles.messages}>
            {list.map((m, i) => (
              <div key={i} style={m.from === "user" ? styles.userMsg : styles.botMsg}>
                <div style={m.from === "user" ? styles.userBubble : styles.botBubble}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={styles.inputArea}>
            <input 
              style={styles.input}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pertanyaan..."
            />
            <button style={styles.sendBtn} onClick={send}><Icon name="upload" size={16} /> Kirim</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { position: "fixed", bottom: 20, right: 20, zIndex: 1000 },
  button: { 
    width: 70, 
    height: 70, 
    borderRadius: "50%", 
    background: "#3b82f6", 
    border: "none", 
    color: "white", 
    fontSize: 30, 
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  badge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    background: "#22c55e",
    color: "white",
    fontSize: 10,
    padding: "3px 8px",
    borderRadius: 10,
    fontWeight: 700
  },
  chatbox: {
    position: "absolute",
    bottom: 70,
    right: 0,
    width: 350,
    height: 450,
    background: "white",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    background: "#3b82f6",
    color: "white",
    padding: "15px 20px",
    fontWeight: 700,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: 18,
    cursor: "pointer"
  },
  messages: {
    flex: 1,
    padding: 15,
    overflow: "auto",
    background: "#f8fafc"
  },
  userMsg: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 10
  },
  botMsg: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 10
  },
  userBubble: {
    background: "#3b82f6",
    color: "white",
    padding: "10px 14px",
    borderRadius: "16px 16px 4px 16px",
    maxWidth: "80%",
    fontSize: 13,
    whiteSpace: "pre-wrap"
  },
  botBubble: {
    background: "#e2e8f0",
    color: "#1e293b",
    padding: "10px 14px",
    borderRadius: "16px 16px 16px 4px",
    maxWidth: "80%",
    fontSize: 13,
    whiteSpace: "pre-wrap"
  },
  inputArea: {
    padding: 15,
    background: "white",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    gap: 10
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    fontSize: 13,
    outline: "none"
  },
  sendBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 24,
    fontWeight: 600,
    cursor: "pointer"
  }
};