import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import {
  getDrivers,
  getConstructors,
  getRaces,
} from "../services/api";

function Dashboard() {
  const [drivers, setDrivers] = useState(0);
  const [constructors, setConstructors] = useState(0);
  const [races, setRaces] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const d = await getDrivers();
        const c = await getConstructors();
        const r = await getRaces();

        setDrivers(d.data.length);
        setConstructors(c.data.length);
        setRaces(r.data.length);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        background: "#1b1d24",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1>🏎️ Formula 1 AI Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        <StatCard title="Drivers" value={drivers} />
        <StatCard title="Constructors" value={constructors} />
        <StatCard title="Races" value={races} />
        <StatCard title="AI Accuracy" value="99.93%" />
      </div>
    </div>
  );
}

export default Dashboard;