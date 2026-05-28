import { PlayingCard } from "./PlayingCard";
import { BetPill } from "./BetPill";

type Props = {
  seatIndex: number;
  name: string;
  stack: number;
  active: boolean;
  isActor: boolean;
  hole?: string[] | null;
  showCards?: boolean;
  flipReveal?: boolean;
  betPill?: string | null;
  bigBlind: number;
};

export function Seat({
  seatIndex,
  name,
  stack,
  active,
  isActor,
  hole,
  showCards,
  flipReveal,
  betPill,
  bigBlind,
}: Props) {
  const stackBb = (stack / bigBlind).toFixed(1);

  return (
    <div
      className={isActor ? "seat-active" : undefined}
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: active ? 1 : 0.35,
        transform: "translate(-50%, -50%)",
        zIndex: isActor ? 10 : 1,
      }}
    >
      {betPill && <BetPill text={betPill} />}
      <div
        style={{
          padding: "6px 14px",
          borderRadius: 8,
          background: "var(--glass-panel)",
          border: `1px solid ${isActor ? "var(--accent-gold)" : "var(--glass-border)"}`,
          minWidth: 90,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: active ? "var(--text-primary)" : "var(--text-muted)" }}>
          {name}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-gold)" }}>{stackBb} BB</div>
      </div>
      {active && showCards && (
        <div style={{ display: "flex", gap: 4 }}>
          <PlayingCard code={hole?.[0]} faceDown={!flipReveal && hole?.[0] === "**"} flipReveal={flipReveal} layoutId={`c-${seatIndex}-0`} small />
          <PlayingCard code={hole?.[1]} faceDown={!flipReveal && hole?.[1] === "**"} flipReveal={flipReveal} layoutId={`c-${seatIndex}-1`} small />
        </div>
      )}
      {!active && (
        <div style={{ fontSize: 20, opacity: 0.2 }}>◎</div>
      )}
    </div>
  );
}
