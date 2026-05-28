import type { PokerEvent } from "../types";
import { stepsForEvent } from "./steps";

export class PlaybackDirector {
  private paused = false;
  private speedMs = 250;
  private queue: Promise<void> = Promise.resolve();
  private reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  setSpeedMs(ms: number) {
    this.speedMs = ms;
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  enqueue(ev: PokerEvent, onCommit: (e: PokerEvent) => void) {
    const steps = stepsForEvent(ev, onCommit, this.reducedMotion);
    const scale = this.speedMs <= 0 ? 0 : this.speedMs / 250;

    for (const step of steps) {
      this.queue = this.queue.then(async () => {
        while (this.paused) await sleep(80);
        step.commit();
        const wait = step.durationMs * scale;
        if (wait > 0) await sleep(wait);
      });
    }
  }

  async flush() {
    await this.queue;
  }

  async replay(events: PokerEvent[], onCommit: (e: PokerEvent) => void) {
    for (const ev of events) {
      this.enqueue(ev, onCommit);
    }
    await this.flush();
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const director = new PlaybackDirector();
