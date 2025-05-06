import React, { useState } from "react";
import axios from "axios";

type Stop = {
  name: string;
  lat: number;
  lon: number;
};

type OptimizeResponse = {
  order: number[];
  total_minutes: number;
  return_to_start: boolean;
};

export default function StopForm() {
  const [stops, setStops] = useState<Stop[]>([
    { name: "Home", lat: 29.7604, lon: -95.3698 },
    { name: "Trader Joes", lat: 29.7374, lon: -95.4189 },
    { name: "UPS", lat: 29.742, lon: -95.3812 },
  ]);
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (i: number, field: keyof Stop, value: string) => {
    const updated = [...stops];
    updated[i][field] = field === "name" ? value : Number(value);
    setStops(updated);
  };

  const addStop = () => {
    if (stops.length < 10)
      setStops([...stops, { name: "", lat: 0, lon: 0 }]);
  };

  const removeStop = (i: number) => {
    if (stops.length > 2)
      setStops(stops.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const resp = await axios.post("http://localhost:8000/optimize", { stops });
      setResult(resp.data);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Stops</h2>
      {stops.map((stop, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <input
            required
            placeholder="Name"
            value={stop.name}
            onChange={e => handleChange(i, "name", e.target.value)}
            style={{ width: 120 }}
          />
          <input
            required
            type="number"
            step="any"
            placeholder="Lat"
            value={stop.lat}
            onChange={e => handleChange(i, "lat", e.target.value)}
            style={{ width: 100 }}
          />
          <input
            required
            type="number"
            step="any"
            placeholder="Lon"
            value={stop.lon}
            onChange={e => handleChange(i, "lon", e.target.value)}
            style={{ width: 100 }}
          />
          <button type="button" onClick={() => removeStop(i)} disabled={stops.length <= 2}>
            –
          </button>
        </div>
      ))}
      <button type="button" onClick={addStop} disabled={stops.length >= 10}>
        + Add Stop
      </button>
      <br />
      <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
        {loading ? "Optimizing..." : "Optimize Route"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 16, background: "#fff", color: "#111", padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div><b>Optimized Order:</b></div>
          <ol>
            {result.order.map((idx: number, i: number) => (
              <li key={i}>
                {stops[idx].name}
                <span style={{ color: '#888', marginLeft: 8 }}>
                  ({stops[idx].lat}, {stops[idx].lon})
                </span>
              </li>
            ))}
          </ol>
          <div><b>Total Minutes:</b> {result.total_minutes}</div>
          <div><b>Returns to Start:</b> {result.return_to_start ? 'Yes' : 'No'}</div>
        </div>
      )}
    </form>
  );
}
