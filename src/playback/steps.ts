import type { PokerEvent } from "../types";

export function stepsForEvent(
  ev: PokerEvent,
  onCommit: (e: PokerEvent) => void,
  reducedMotion: boolean
): { durationMs: number; commit: () => void }[] {
  const hints = ev.animationHints ?? {};
  const stagger = (hints.staggerMs as number) ?? 80;
  const flipMs = (hints.flipMs as number) ?? 500;

  const commit = () => onCommit(ev);

  if (reducedMotion) {
    return [{ durationMs: 0, commit }];
  }

  switch (ev.type) {
    case "hand_start":
      return [{ durationMs: 200, commit }];
    case "deal_hole":
      return [
        { durationMs: stagger, commit: () => {} },
        { durationMs: stagger, commit },
      ];
    case "deal_flop":
      return [
        { durationMs: hints.burn ? 120 : 0, commit: () => {} },
        { durationMs: stagger, commit: () => {} },
        { durationMs: stagger, commit: () => {} },
        { durationMs: stagger, commit },
      ];
    case "deal_turn":
    case "deal_river":
      return [{ durationMs: stagger + 40, commit }];
    case "action":
      return [{ durationMs: 300, commit }];
    case "showdown":
      return [
        { durationMs: flipMs, commit: () => {} },
        { durationMs: flipMs, commit },
      ];
    case "hand_end":
      return [{ durationMs: 400, commit }];
    default:
      return [{ durationMs: 80, commit }];
  }
}
