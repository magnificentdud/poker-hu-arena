import { create } from "zustand";
import type { PlayerStats, PokerEvent, TableState } from "../types";

const initialTable: TableState = {
  handNumber: 0,
  pot: 0,
  board: [],
  stacks: [5000, 5000],
  holeCards: {},
  activeActor: null,
  dealerSeat: 0,
  live: false,
  ticker: "Waiting for match…",
  betPill: null,
};

type MatchStore = {
  matchId: string | null;
  matchStatus: string;
  speedMs: number;
  agents: [string, string];
  table: TableState;
  stats: Record<string, PlayerStats>;
  actionLog: string[];
  handHistory: { handId: string; handNumber: number; summary: unknown }[];
  replayMode: boolean;
  setMatchId: (id: string | null) => void;
  setSpeedMs: (ms: number) => void;
  setAgents: (a: [string, string]) => void;
  setMatchStatus: (s: string) => void;
  setStats: (s: Record<string, PlayerStats>) => void;
  pushLog: (line: string) => void;
  addHandHistory: (h: { handId: string; handNumber: number; summary: unknown }) => void;
  commitEvent: (ev: PokerEvent) => void;
  resetTable: () => void;
  setReplayMode: (v: boolean) => void;
};

export const useMatchStore = create<MatchStore>((set, get) => ({
  matchId: null,
  matchStatus: "idle",
  speedMs: 250,
  agents: ["tag", "calling_station"],
  table: { ...initialTable },
  stats: {},
  actionLog: [],
  handHistory: [],
  replayMode: false,
  setMatchId: (id) => set({ matchId: id }),
  setSpeedMs: (ms) => set({ speedMs: ms }),
  setAgents: (a) => set({ agents: a }),
  setMatchStatus: (s) => set({ matchStatus: s, table: { ...get().table, live: s === "live" } }),
  setStats: (s) => set({ stats: s }),
  pushLog: (line) => set({ actionLog: [...get().actionLog.slice(-200), line] }),
  addHandHistory: (h) => set({ handHistory: [...get().handHistory, h] }),
  resetTable: () =>
    set({
      table: { ...initialTable },
      actionLog: [],
      handHistory: [],
      stats: {},
    }),
  setReplayMode: (v) => set({ replayMode: v }),
  commitEvent: (ev) => {
    const table = { ...get().table };
    if (ev.pot !== undefined) table.pot = ev.pot;
    if (ev.board) table.board = [...ev.board];
    if (ev.stacks) table.stacks = [ev.stacks[0], ev.stacks[1]];
    if (ev.holeCards) table.holeCards = { ...ev.holeCards };
    if (ev.seatLayout?.dealer !== undefined) table.dealerSeat = ev.seatLayout.dealer;
    if (ev.extra?.handNumber) table.handNumber = ev.extra.handNumber as number;

    if (ev.type === "hand_start") {
      table.board = [];
      table.ticker = `Hand #${table.handNumber} — blinds posted`;
      table.betPill = null;
    } else if (ev.type === "action" && ev.actor) {
      table.activeActor = ev.actor;
      const amt = ev.amount ? ` ${(ev.amount / 50).toFixed(1)} BB` : "";
      table.ticker = `${ev.actor} ${ev.action}${amt}`;
      const seat = ev.actor === "player0" ? 0 : 5;
      table.betPill = { seat, text: `${ev.action}${amt}` };
      get().pushLog(`[${ev.street}] ${ev.actor} ${ev.action}${amt}`);
    } else if (ev.type.startsWith("deal_")) {
      table.ticker = `${ev.type.replace("deal_", "").toUpperCase()} dealt`;
      table.activeActor = null;
    } else if (ev.type === "showdown") {
      table.ticker = "Showdown";
      if (ev.holeCards) table.holeCards = { ...ev.holeCards };
    } else if (ev.type === "hand_end") {
      const w = (ev.extra as { winner?: string })?.winner ?? "?";
      table.ticker = `Hand over — ${w} wins`;
      table.activeActor = null;
      table.betPill = null;
    }

    set({ table });
  },
}));
