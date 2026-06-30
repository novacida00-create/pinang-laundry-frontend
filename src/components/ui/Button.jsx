export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false
}) {

  const styles = {
    base: {
      padding: "10px 16px",
      borderRadius: 10,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 600,
      pointerEvents: disabled ? "none" : "auto", // penting
      opacity: disabled ? 0.5 : 1,
    },

    primary: {
      background: "#3b82f6",
      color: "#fff",
    },

    danger: {
      background: "#ef4444",
      color: "#fff",
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...styles.base, ...styles[variant] }}
    >
      {children}
    </button>
  );
}