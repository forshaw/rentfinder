export default function Offline() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div>
        <h2>You are offline</h2>
        <p style={{ marginTop: 12 }}>
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
}