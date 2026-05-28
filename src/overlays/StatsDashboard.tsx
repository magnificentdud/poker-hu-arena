import { useMatchStore } from "../store/matchStore";

export function StatsDashboard() {
  const stats = useMatchStore((s) => s.stats);
  const agents = useMatchStore((s) => s.agents);

  const renderPlayer = (key: string, label: string) => {
    const s = stats[key];
    if (!s) {
      return (
        <div key={key} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Waiting…</div>
        </div>
      );
    }
    return (
      <div key={key} style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, color: "var(--accent-gold)" }}>{label}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11, marginTop: 6 }}>
          <Stat label="VPIP" value={`${s.vpipPct}%`} />
          <Stat label="PFR" value={`${s.pfrPct}%`} />
          <Stat label="AF" value={String(s.af)} />
          <Stat label="bb/100" value={String(s.bbPer100)} />
          <Stat label="WTSD" value={`${s.wtsdPct}%`} />
          <Stat label="W$SD" value={`${s.wsdPct}%`} />
        </div>
        <div style={{ marginTop: 6, fontSize: 11 }}>
          Net: <span style={{ color: s.net_chips >= 0 ? "#6fcf97" : "var(--accent-danger)" }}>{s.net_chips}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: 12, height: "100%", overflowY: "auto" }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 13, color: "var(--accent-gold)" }}>Stats HUD</h3>
      {renderPlayer("player0", agents[0])}
      {renderPlayer("player1", agents[1])}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ color: "var(--text-muted)" }}>{label}: </span>
      <span>{value}</span>
    </div>
  );
}
