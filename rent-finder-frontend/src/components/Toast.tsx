type ToastProps = {
  message: string;
  onClose?: () => void; // ✅ ADD THIS
};

export default function Toast({ message, onClose }: ToastProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: "#333",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 6,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <span>{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            marginLeft: 10,
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
      )}
    </div>
  );
}
