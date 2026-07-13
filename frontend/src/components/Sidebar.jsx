import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Prediction", path: "/prediction", icon: "🤖" },
    { name: "Analytics", path: "/analytics", icon: "📈" },
    { name: "Driver Stats", path: "/driver-stats", icon: "🏎️" },
  ];

  return (
    <div
      style={{
        width: "250px",
        background: "#11141d",
        color: "white",
        minHeight: "100vh",
        padding: "25px",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2
        style={{
          color: "#e10600",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        🏎️ F1 AI
      </h2>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display: "block",
            textDecoration: "none",
            color:
              location.pathname === item.path ? "#e10600" : "white",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
            background:
              location.pathname === item.path
                ? "#222938"
                : "transparent",
            fontWeight: "bold",
          }}
        >
          {item.icon} {item.name}
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;