import { motion } from "framer-motion";

const RED = new Set(["h", "d"]);

function cardLabel(code: string) {
  if (code === "**" || !code || code.length < 2) return null;
  const rank = code[0].toUpperCase();
  const suit = code[1].toLowerCase();
  const color = RED.has(suit) ? "var(--card-red)" : "var(--card-black)";
  const suitSym = { c: "♣", d: "♦", h: "♥", s: "♠" }[suit] ?? suit;
  return { rank, suitSym, color };
}

type Props = {
  code?: string | null;
  faceDown?: boolean;
  layoutId?: string;
  small?: boolean;
  flipReveal?: boolean;
};

export function PlayingCard({ code, faceDown = false, layoutId, small, flipReveal }: Props) {
  const w = small ? 36 : 52;
  const h = small ? 50 : 72;
  const info = code ? cardLabel(code) : null;
  const showFace = !faceDown && info && (!flipReveal || flipReveal);

  return (
    <motion.div
      layoutId={layoutId}
      style={{
        width: w,
        height: h,
        perspective: 800,
        display: "inline-block",
      }}
      initial={false}
      animate={{ rotateY: showFace ? 180 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: showFace ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.5s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: 6,
            background: "linear-gradient(145deg, #1a2540, #0d1220)",
            border: "2px solid var(--accent-gold)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "var(--accent-gold)",
            letterSpacing: 2,
          }}
        >
          ◆
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 6,
            background: "#f8f6f0",
            border: "1px solid #ccc",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: info?.color,
          }}
        >
          {info && (
            <>
              <span style={{ fontSize: small ? 14 : 18 }}>{info.rank}</span>
              <span style={{ fontSize: small ? 16 : 22 }}>{info.suitSym}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
