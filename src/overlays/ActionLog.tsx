import { useMatchStore } from "../store/matchStore";

export function ActionLog() {
  const log = useMatchStore((s) => s.actionLog);
  return (
    <div className="glass-panel" style={{ padding: 12, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 13, color: "var(--accent-gold)" }}>Action Log</h3>
      <div style={{ flex: 1, overflowY: "auto", fontSize: 11, fontFamily: "ui-monospace, monospace", color: "var(--text-muted)" }}>
        {log.length === 0 && <div>No actions yet.</div>}
        {log.map((line, i) => (
          <div key={i} style={{ padding: "2px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
