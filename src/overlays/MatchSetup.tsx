import { useEffect, useState } from "react";
import { useMatchStore } from "../store/matchStore";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type Agent = { id: string; name: string };

export function MatchSetup({ onStart }: { onStart: (matchId: string) => void }) {
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const agentsSel = useMatchStore((s) => s.agents);
  const speedMs = useMatchStore((s) => s.speedMs);
  const setAgentPair = useMatchStore((s) => s.setAgents);
  const setSpeedMs = useMatchStore((s) => s.setSpeedMs);
  const resetTable = useMatchStore((s) => s.resetTable);
  const [hands, setHands] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/agents`)
      .then((r) => r.json())
      .then((d) => setAgentList(d.agents ?? []));
  }, []);

  const start = async () => {
    setLoading(true);
    resetTable();
    const res = await fetch(`${API}/api/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentA: agentsSel[0],
        agentB: agentsSel[1],
        hands,
        stackBb: 100,
        speedMs,
        seed: 42,
      }),
    });
    const data = await res.json();
    setLoading(false);
    onStart(data.matchId);
  };

  return (
    <div className="glass-panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 14, color: "var(--accent-gold)" }}>Match Setup</h3>
      <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Agent A (seat 0)</label>
      <select
        value={agentsSel[0]}
        onChange={(e) => setAgentPair([e.target.value, agentsSel[1]])}
        style={selectStyle}
      >
        {agentList.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <label style={{ display: "block", fontSize: 12, margin: "10px 0 4px" }}>Agent B (seat 5)</label>
      <select
        value={agentsSel[1]}
        onChange={(e) => setAgentPair([agentsSel[0], e.target.value])}
        style={selectStyle}
      >
        {agentList.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <label style={{ display: "block", fontSize: 12, margin: "10px 0 4px" }}>Hands: {hands}</label>
      <input type="range" min={5} max={200} value={hands} onChange={(e) => setHands(+e.target.value)} style={{ width: "100%" }} />
      <label style={{ display: "block", fontSize: 12, margin: "10px 0 4px" }}>
        Speed: {speedMs === 0 ? "Instant" : speedMs <= 80 ? "Fast" : speedMs <= 250 ? "Live" : "Slow"} ({speedMs}ms)
      </label>
      <input
        type="range"
        min={0}
        max={600}
        step={10}
        value={speedMs}
        onChange={(e) => setSpeedMs(+e.target.value)}
        style={{ width: "100%" }}
      />
      <button onClick={start} disabled={loading} style={btnStyle}>
        {loading ? "Starting…" : "Start Match"}
      </button>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  background: "#0d1220",
  color: "var(--text-primary)",
  border: "1px solid var(--glass-border)",
  borderRadius: 6,
};

const btnStyle: React.CSSProperties = {
  marginTop: 14,
  width: "100%",
  padding: "10px 16px",
  background: "linear-gradient(180deg, #c9a227, #8b7355)",
  border: "none",
  borderRadius: 8,
  color: "#0a0e14",
  fontWeight: 700,
  cursor: "pointer",
};
