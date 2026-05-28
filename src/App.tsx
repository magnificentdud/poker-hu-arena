import { useState } from "react";
import { SixMaxTable } from "./components/SixMaxTable";
import { useMatchSocket } from "./hooks/useMatchSocket";
import { ActionLog } from "./overlays/ActionLog";
import { HandHistory } from "./overlays/HandHistory";
import { MatchSetup } from "./overlays/MatchSetup";
import { StatsDashboard } from "./overlays/StatsDashboard";
import { useMatchStore } from "./store/matchStore";

function App() {
  const [matchId, setMatchId] = useState<string | null>(null);
  const setStoreMatchId = useMatchStore((s) => s.setMatchId);
  const matchStatus = useMatchStore((s) => s.matchStatus);
  const table = useMatchStore((s) => s.table);
  const { pause, replayHand } = useMatchSocket(matchId);

  const onStart = (id: string) => {
    setMatchId(id);
    setStoreMatchId(id);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: 12, gap: 12 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
        }}
        className="glass-panel"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {table.live && (
            <span style={{ color: "#e85d5d", fontWeight: 700, fontSize: 12 }}>● LIVE</span>
          )}
          <span style={{ fontWeight: 700, letterSpacing: 1 }}>POKER HU ARENA</span>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Hand #{table.handNumber} · {matchStatus}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => pause(true)} style={hdrBtn}>
            Pause
          </button>
          <button type="button" onClick={() => pause(false)} style={hdrBtn}>
            Resume
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12, flex: 1, minHeight: 0 }}>
        <div className="glass-panel" style={{ padding: 16, minHeight: 480 }}>
          <SixMaxTable />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <MatchSetup onStart={onStart} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, height: 220 }}>
        <ActionLog />
        <StatsDashboard />
        <HandHistory onReplay={replayHand} />
      </div>
    </div>
  );
}

const hdrBtn: React.CSSProperties = {
  padding: "6px 12px",
  background: "transparent",
  border: "1px solid var(--glass-border)",
  borderRadius: 6,
  color: "var(--text-primary)",
  cursor: "pointer",
  fontSize: 12,
};

export default App;
