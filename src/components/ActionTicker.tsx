import { motion, AnimatePresence } from "framer-motion";

export function ActionTicker({ text, live }: { text: string; live: boolean }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "10px 20px",
        marginTop: 8,
      }}
    >
      {live && (
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#e85d5d",
            marginRight: 8,
            boxShadow: "0 0 8px #e85d5d",
          }}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)" }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
