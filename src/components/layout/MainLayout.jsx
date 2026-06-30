import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* SIDEBAR */}
      <div style={{ width: 260, flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: 20,
          background: "#f0f7ff",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}