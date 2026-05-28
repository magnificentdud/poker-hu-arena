import { useCallback, useEffect, useRef } from "react";
import { director } from "../playback/director";
import { useMatchStore } from "../store/matchStore";
import type { PokerEvent } from "../types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const WS_BASE = import.meta.env.VITE_WS_URL ?? "ws://localhost:8000";

export function useMatchSocket(matchId: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const commitEvent = useMatchStore((s) => s.commitEvent);
  const setMatchStatus = useMatchStore((s) => s.setMatchStatus);
  const setStats = useMatchStore((s) => s.setStats);
  const addHandHistory = useMatchStore((s) => s.addHandHistory);
  const speedMs = useMatchStore((s) => s.speedMs);

  useEffect(() => {
    director.setSpeedMs(speedMs);
  }, [speedMs]);

  const connect = useCallback(
    (id: string) => {
      if (wsRef.current) wsRef.current.close();
      const ws = new WebSocket(`${WS_BASE}/ws/matches/${id}`);
      wsRef.current = ws;

      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === "event" && data.payload) {
          director.enqueue(data.payload as PokerEvent, commitEvent);
        } else if (data.type === "stats_update") {
          setStats(data.stats);
        } else if (data.type === "hand_complete") {
          addHandHistory({
            handId: data.handId,
            handNumber: data.handNumber,
            summary: data.summary,
          });
        } else if (data.type === "match_status") {
          setMatchStatus(data.status);
        }
      };

      ws.onclose = () => setMatchStatus("disconnected");
    },
    [commitEvent, setMatchStatus, setStats, addHandHistory]
  );

  useEffect(() => {
    if (matchId) connect(matchId);
    return () => wsRef.current?.close();
  }, [matchId, connect]);

  const pause = async (paused: boolean) => {
    director.setPaused(paused);
    if (matchId) {
      await fetch(`${API}/api/matches/${matchId}/pause`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paused }),
      });
    }
  };

  const replayHand = async (handId: string) => {
    if (!matchId) return;
    useMatchStore.getState().resetTable();
    useMatchStore.getState().setReplayMode(true);
    const res = await fetch(`${API}/api/matches/${matchId}/hands/${handId}`);
    const data = await res.json();
    await director.replay(data.events as PokerEvent[], commitEvent);
    useMatchStore.getState().setReplayMode(false);
  };

  return { pause, replayHand };
}
