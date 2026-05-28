import { motion } from "framer-motion";
import { useMatchStore } from "../store/matchStore";
import { SEAT_POSITIONS } from "../types";
import { PlayingCard } from "./PlayingCard";
import { PotDisplay } from "./PotDisplay";
import { Seat } from "./Seat";
import { ActionTicker } from "./ActionTicker";

const BIG_BLIND = 50;

export function SixMaxTable() {
  const table = useMatchStore((s) => s.table);
  const agents = useMatchStore((s) => s.agents);
  const isShowdown = table.ticker.toLowerCase().includes("showdown") || Object.values(table.holeCards).some(
    (h) => h && h[0] !== "**"
  );

  const seatNames = ["", "", "", "", "", ""];
  seatNames[0] = agents[0];
  seatNames[5] = agents[1];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 420 }}>
      <div
        style={{
          position: "absolute",
          inset: "8% 12%",
          borderRadius: "50% / 42%",
          background: `radial-gradient(ellipse at center, var(--felt-table) 0%, var(--felt-inner) 100%)`,
          border: `4px solid var(--rail-table)`,
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.45), 0 8px 32px rgba(0,0,0,0.5)",
        }}
      />
      {SEAT_POSITIONS.map((pos, i) => {
        const isActive = pos.active;
        const playerKey = i === 0 ? "player0" : i === 5 ? "player1" : null;
        const stack = playerKey ? table.stacks[playerKey === "player0" ? 0 : 1] : 0;
        const hole = playerKey ? table.holeCards[playerKey] : null;
        const isActor = playerKey === table.activeActor;
        const betPill =
          table.betPill && table.betPill.seat === i ? table.betPill.text : null;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
          >
            <Seat
              seatIndex={i}
              name={isActive ? seatNames[i] : "—"}
              stack={stack}
              active={isActive}
              isActor={!!isActor}
              hole={hole}
              showCards={isActive}
              flipReveal={isShowdown}
              betPill={betPill}
              bigBlind={BIG_BLIND}
            />
            {table.dealerSeat === i && isActive && (
              <motion.div
                layoutId="dealer-btn"
                style={{
                  position: "absolute",
                  right: -8,
                  top: -8,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#f0e6c8",
                  border: "2px solid var(--rail-table)",
                  fontSize: 9,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#333",
                }}
              >
                D
              </motion.div>
            )}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "48%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PotDisplay pot={table.pot} bigBlind={BIG_BLIND} />
        <div style={{ display: "flex", gap: 6, minHeight: 72 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <PlayingCard
              key={i}
              code={table.board[i]}
              layoutId={`board-${i}`}
            />
          ))}
        </div>
      </div>

      <ActionTicker text={table.ticker} live={table.live} />
    </div>
  );
}
