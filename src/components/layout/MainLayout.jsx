import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="main-layout"
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <input type="checkbox" id="mt" className="mt-i" />
      {/* SIDEBAR */}
      <div className="main-sidebar-wrap" style={{ width: 260, flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content"
        style={{
          flex: 1,
          padding: 20,
          background: "#f0f7ff",
          position: "relative",
        }}
      >
        <label htmlFor="mt" className="mt-l">☰</label>
        {children}
      </div>
    </div>
  );
}