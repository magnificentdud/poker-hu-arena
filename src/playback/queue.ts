export type AnimationStep = {
  id: string;
  durationMs: number;
  run: () => Promise<void>;
};

export class AnimationQueue {
  private queue: AnimationStep[] = [];
  private running = false;
  private paused = false;
  private speedScale = 1;

  setSpeedScale(scale: number) {
    this.speedScale = scale <= 0 ? 0.01 : scale;
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  enqueue(step: AnimationStep) {
    this.queue.push(step);
    void this.drain();
  }

  clear() {
    this.queue = [];
  }

  private async drain() {
    if (this.running) return;
    this.running = true;
    while (this.queue.length > 0) {
      while (this.paused) {
        await sleep(50);
      }
      const step = this.queue.shift()!;
      const dur = step.durationMs * this.speedScale;
      await step.run();
      if (dur > 0) await sleep(dur);
    }
    this.running = false;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
