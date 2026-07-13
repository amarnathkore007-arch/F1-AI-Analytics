import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";
import DriverStats from "./pages/DriverStats";

function App() {
  return (
    <div
      style={{
        display: "flex",
        background: "#1b1d26",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          width: "100%",
          padding: "30px",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/driver-stats" element={<DriverStats />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;