function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#24262f",
        padding: "20px",
        borderRadius: "12px",
        color: "white",
        width: "220px",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

export default StatCard;