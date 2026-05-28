import { useMatchStore } from "../store/matchStore";

export function HandHistory({ onReplay }: { onReplay: (handId: string) => void }) {
  const history = useMatchStore((s) => s.handHistory);

  return (
    <div className="glass-panel" style={{ padding: 12, height: "100%", overflowY: "auto" }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 13, color: "var(--accent-gold)" }}>Hand History</h3>
      {history.length === 0 && <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Hands appear as match runs.</div>}
      {history.map((h) => (
        <button
          key={h.handId}
          onClick={() => onReplay(h.handId)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "8px 10px",
            marginBottom: 4,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--glass-border)",
            borderRadius: 6,
            color: "var(--text-primary)",
            cursor: "pointer",
            fontSize: 11,
          }}
        >
          Hand #{h.handNumber}{" "}
          <span style={{ color: "var(--text-muted)" }}>
            — winner {(h.summary as { winner?: number })?.winner ?? "?"}
          </span>
        </button>
      ))}
    </div>
  );
}
