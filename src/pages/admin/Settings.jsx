import MainLayout from "../../components/layout/MainLayout";

export default function Settings() {
  return (
    <MainLayout>
      <h2>Pengaturan Sistem</h2>

      <div style={{ marginTop: 20 }}>
        <p>Nama Toko: Pinang Laundry</p>
        <p>Alamat: Jalan Contoh No. 1</p>
        <p>WhatsApp: 08123456789</p>
      </div>
    </MainLayout>
  );
}