import { motion } from "framer-motion";

export function PotDisplay({ pot, bigBlind }: { pot: number; bigBlind: number }) {
  const bb = (pot / bigBlind).toFixed(1);
  return (
    <motion.div
      key={pot}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 0.3 }}
      style={{
        textAlign: "center",
        marginBottom: 8,
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1 }}>POT</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent-gold)" }}>{bb} BB</div>
    </motion.div>
  );
}
