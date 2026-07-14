import { useEffect, useState } from "react";
import axios from "axios";

function DriverStats() {
  const [drivers, setDrivers] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    const res = await axios.get("https://f1-ai-analytics.onrender.com/drivers");
    setDrivers(res.data);
  };

  const loadStats = async () => {
    if (!driverId) return;

    const res = await axios.get(
      `https://f1-ai-analytics.onrender.com/analytics/driver/${driverId}/stats`
    );

    setStats(res.data);
  };

  return (
    <div
      style={{
        padding: "40px",
        background: "#1b1d26",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1>🏎 Driver Statistics</h1>

      <select
        value={driverId}
        onChange={(e) => setDriverId(e.target.value)}
        style={{
          width: "350px",
          padding: "12px",
          marginTop: "30px",
          borderRadius: "8px",
        }}
      >
        <option value="">Select Driver</option>

        {drivers.map((driver) => (
          <option
            key={driver.driverId}
            value={driver.driverId}
          >
            {driver.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <button
        onClick={loadStats}
        style={{
          padding: "12px 25px",
          background: "#e10600",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Load Statistics
      </button>

      {stats && (
        <div
          style={{
            marginTop: "40px",
            background: "#2a2d3a",
            padding: "30px",
            borderRadius: "12px",
            width: "450px",
          }}
        >
          <h2>{stats.name}</h2>

          <p>🏁 Total Races: {stats.total_races}</p>

          <p>🏆 Wins: {stats.wins}</p>

          <p>⭐ Average Points: {stats.average_points}</p>

          <p>🥇 Total Points: {stats.total_points}</p>
        </div>
      )}
    </div>
  );
}

export default DriverStats;