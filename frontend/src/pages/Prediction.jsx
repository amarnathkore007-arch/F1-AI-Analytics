import { useEffect, useState } from "react";
import axios from "axios";

function Prediction() {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);

  const [formData, setFormData] = useState({
    driverId: "",
    constructorId: "",
    grid: "",
    year: 2024,
    points: "",
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    loadDrivers();
    loadConstructors();
  }, []);

  const loadDrivers = async () => {
    try {
      const res = await axios.get("https://f1-ai-analytics.onrender.com/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadConstructors = async () => {
    try {
      const res = await axios.get("https://f1-ai-analytics.onrender.com/constructors");
      setConstructors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#2a2d3a",
    color: "white",
    fontSize: "16px",
  };
    const predictWinner = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://f1-ai-analytics.onrender.com/predict",
        formData
      );

      setResult(response.data);

      const driver = drivers.find(
        (d) => d.driverId === formData.driverId
      );

      const constructor = constructors.find(
        (c) => c.constructorId === formData.constructorId
      );

      setHistory((prev) => [
        {
          driver: driver?.name || formData.driverId,
          constructor: constructor?.name || formData.constructorId,
          grid: formData.grid,
          confidence: response.data.confidence,
          prediction:
            response.data.winner_prediction === 1
              ? "Winner"
              : "Not Winner",
        },
        ...prev,
      ]);
    } catch (error) {
      console.log(error);
      alert("Prediction Failed");
    }

    setLoading(false);
  };
    return (
    <div
      style={{
        background: "#1b1d26",
        minHeight: "100vh",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#e10600",
          marginBottom: "40px",
        }}
      >
        🏎️ AI Race Winner Prediction
      </h1>

      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            background: "#2a2d3a",
            padding: "30px",
            borderRadius: "15px",
            width: "380px",
          }}
        >
          <h2>Prediction Input</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <select
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
              style={inputStyle}
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

            <select
              name="constructorId"
              value={formData.constructorId}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select Constructor</option>

              {constructors.map((team) => (
                <option
                  key={team.constructorId}
                  value={team.constructorId}
                >
                  {team.name}
                </option>
              ))}
            </select>

            <input
              style={inputStyle}
              type="number"
              name="grid"
              placeholder="Grid Position"
              value={formData.grid}
              onChange={handleChange}
            />

            <input
              style={inputStyle}
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />

            <input
              style={inputStyle}
              type="number"
              name="points"
              placeholder="Current Points"
              value={formData.points}
              onChange={handleChange}
            />

            <button
              onClick={predictWinner}
              disabled={loading}
              style={{
                padding: "14px",
                background: "#e10600",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {loading ? "Predicting..." : "🏁 Predict Winner"}
            </button>
          </div>
        </div>
                {/* RIGHT */}
        <div
          style={{
            background: "#2a2d3a",
            padding: "30px",
            borderRadius: "15px",
            flex: 1,
            minHeight: "350px",
          }}
        >
          <h2>Prediction Result</h2>

          {!result ? (
            <p
              style={{
                marginTop: "30px",
                color: "#999",
                fontSize: "18px",
              }}
            >
              Select driver details and click Predict Winner.
            </p>
          ) : (
            <>
              <h1
                style={{
                  color:
                    result.winner_prediction === 1
                      ? "#00ff88"
                      : "#ff4d4d",
                }}
              >
                {result.winner_prediction === 1
                  ? "🏆 Winner"
                  : "❌ Not Winner"}
              </h1>

              <h2>
                Winning Probability:
                <span style={{ color: "#FFD700" }}>
                  {" "}
                  {result.confidence}%
                </span>
              </h2>

              <div
                style={{
                  marginTop: "25px",
                  height: "20px",
                  background: "#444",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${result.confidence}%`,
                    background:
                      result.confidence >= 80
                        ? "#00ff88"
                        : result.confidence >= 50
                        ? "#FFD700"
                        : "#ff4d4d",
                    height: "100%",
                    transition: "0.5s",
                  }}
                />
              </div>

              <p
                style={{
                  marginTop: "20px",
                  fontSize: "18px",
                }}
              >
                {result.confidence >= 80
                  ? "🟢 Very High Chance of Winning"
                  : result.confidence >= 50
                  ? "🟡 Moderate Chance of Winning"
                  : "🔴 Low Chance of Winning"}
              </p>
            </>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div
          style={{
            marginTop: "40px",
            background: "#2a2d3a",
            padding: "20px",
            borderRadius: "15px",
          }}
        >
          <h2>📜 Prediction History</h2>

          <table
            style={{
              width: "100%",
              marginTop: "20px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "10px" }}>Driver</th>
                <th style={{ padding: "10px" }}>Constructor</th>
                <th style={{ padding: "10px" }}>Grid</th>
                <th style={{ padding: "10px" }}>Prediction</th>
                <th style={{ padding: "10px" }}>Confidence</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "10px" }}>{item.driver}</td>
                  <td style={{ padding: "10px" }}>{item.constructor}</td>
                  <td style={{ padding: "10px" }}>{item.grid}</td>
                  <td style={{ padding: "10px" }}>
                    {item.prediction}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {item.confidence}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Prediction;