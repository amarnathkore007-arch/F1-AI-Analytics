import { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const [topDrivers, setTopDrivers] = useState([]);
  const [topConstructors, setTopConstructors] = useState([]);
  const [raceWinners, setRaceWinners] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const drivers = await axios.get(
      "https://f1-ai-analytics.onrender.com/analytics/top-drivers"
    );

    const constructors = await axios.get(
      "https://f1-ai-analytics.onrender.com/analytics/top-constructors"
    );

    const winners = await axios.get(
      "https://f1-ai-analytics.onrender.com/analytics/most-race-wins"
    );

    setTopDrivers(drivers.data);
    setTopConstructors(constructors.data);
    setRaceWinners(winners.data);
  };

  const cardStyle = {
    background: "#2a2d3a",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "30px",
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
      <h1 style={{ marginBottom: "40px" }}>
        📊 Analytics Dashboard
      </h1>

      <div style={cardStyle}>
        <Bar
          data={{
            labels: topDrivers.map((d) => d.name),
            datasets: [
              {
                label: "Driver Points",
                data: topDrivers.map((d) => d.total_points),
                backgroundColor: "#e10600",
              },
            ],
          }}
        />
      </div>

      <div style={cardStyle}>
        <Bar
          data={{
            labels: topConstructors.map((c) => c.name),
            datasets: [
              {
                label: "Constructor Points",
                data: topConstructors.map((c) => c.total_points),
                backgroundColor: "#00c853",
              },
            ],
          }}
        />
      </div>

      <div style={cardStyle}>
        <Bar
          data={{
            labels: raceWinners.map((d) => d.name),
            datasets: [
              {
                label: "Race Wins",
                data: raceWinners.map((d) => d.wins),
                backgroundColor: "#ff9800",
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default Analytics;