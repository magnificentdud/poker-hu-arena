import { motion, AnimatePresence } from "framer-motion";

export function BetPill({ text }: { text: string }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        style={{
          position: "absolute",
          top: -28,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "4px 10px",
          borderRadius: 20,
          background: "var(--glass-panel)",
          border: "1px solid var(--accent-gold)",
          color: "var(--accent-gold)",
          fontSize: 11,
          fontWeight: 600,
          whiteSpace: "nowrap",
          zIndex: 20,
        }}
      >
        {text}
      </motion.div>
    </AnimatePresence>
  );
}
