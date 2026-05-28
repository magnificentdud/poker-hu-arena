# Poker HU Arena
Heads-up No-Limit Texas Hold'em (NLHE) with AI agents and a **broadcast-style** web UI. Two bots play on a 6-max–style oval table (two active seats, four dim empty seats), with live animations, stats, and hand replay.
This is **not** an LLM-based poker bot. Agents are either **hand-written heuristics** or a **small PyTorch neural policy** trained with **PPO** (Proximal Policy Optimization).
---
## Features
| Area | What you get |
|------|----------------|
| **Game** | HU NLHE: blinds, bet/raise/all-in, side-pot logic, showdown evaluation |
| **Agents** | Random, TAG heuristic, Calling Station, Neural (checkpoint) |
| **Training** | Offline PPO self-play vs a fixed opponent (default: TAG) |
| **Web UI** | Dark casino theme, card deal/flip animations, action ticker, stats HUD |
| **API** | FastAPI + WebSocket streaming, SQLite hand/event storage |
| **Replay** | Click a hand in history → same animation pipeline replays stored events |
---
## Architecture
┌─────────────────┐ events ┌──────────────────┐ │ HoldemEngine │ ───────────────► │ MatchRunner │ │ (HU NLHE) │ │ + StatsAgg │ └────────┬────────┘ └────────┬─────────┘ │ │ WebSocket │ used by ▼ ┌────────▼────────┐ ┌──────────────────┐ │ Agents │ │ React UI │ │ random/tag/ │ │ PlaybackDirector│ │ calling_station│ │ SixMaxTable │ │ neural (.pt) │ └──────────────────┘ └─────────────────┘ ▲ │ train offline ┌────────┴────────┐ │ PPOTrainer │ │ PolicyNet MLP │ └─────────────────┘

**Design principle:** The engine emits an **append-only event log**. The UI never simulates poker rules—it only **animates** and **displays** events from the server.
---
## Agents & models
### 1. Baseline bots (no ML)
| Agent ID | Name | Strategy |
|----------|------|----------|
| `random` | Random | Uniform random legal action |
| `tag` | TAG Heuristic | Tight-aggressive: preflop hand-strength buckets, pot-odds calls, occasional raises |
| `calling_station` | Calling Station | Checks/calls often (~85% call), rarely raises |
**TAG** uses a simple preflop strength score from ranks, suitedness, and connectivity (`backend/agents/tag.py`). Postflop it uses a noisy strength estimate plus pot-odds thresholds.
### 2. Neural agent (`neural:<checkpoint>`)
| Component | Detail |
|-----------|--------|
| **Framework** | PyTorch 2.x |
| **Architecture** | `PolicyNet` — 2×128 ReLU MLP + linear policy head (6 actions) + separate value head (`backend/training/model.py`) |
| **Observation** | 128-dim float vector: normalized stacks, pot, street one-hot, board/hole card rank+suit encodings, button/actor flags |
| **Action space** | 6 types: `fold`, `check`, `call`, `bet`, `raise`, `all_in` — illegal actions masked at inference |
| **Checkpoint** | `models/checkpoints/latest.pt` (or `neural:<name>` for other `.pt` files) |
There is **no** GPT/Claude/Llama or other language model in the loop. The “model” is this small feedforward network only.
### 3. Hand evaluation (not a player model)
- **[phevaluator](https://github.com/HenryRLee/PokerHandEvaluator)** — fast 7-card hand strength (used at showdown to pick winners).
---
## Training
Training is **offline** via `scripts/train.py`. The web app only **loads** checkpoints for matches.
### Algorithm: PPO (simplified)
Implemented in `backend/training/ppo.py`:
| Hyperparameter | Value |
|----------------|-------|
| Optimizer | Adam, learning rate `3e-4` |
| Discount γ | `0.99` |
| PPO clip ε | `0.2` |
| Batch size | 256 transitions |
| Reward | Chip delta for **player 0** at end of hand, divided by big blind |
| Opponent | Fixed bot (default `tag`) controls player 1 |
### Training loop (per step)
1. Start a new hand in `HoldemEngine` (100 BB stacks default, blinds 25/50).
2. **Player 0 (neural):** encode state → policy network → sample legal action (masked softmax).
3. **Player 1 (opponent):** TAG / Calling Station / etc. acts from heuristics.
4. Repeat until hand ends; assign the same terminal reward to all transitions in that hand.
5. Every 256 transitions → PPO update (policy + value loss).
6. After N steps → save `models/checkpoints/latest.pt`.
### Commands
```bash
# Default: 5000 hands vs TAG
python scripts/train.py
# Longer run
python scripts/train.py --steps 50000 --opponent tag --seed 42
# Benchmark two agents (no training)
python scripts/benchmark.py --agent-a tag --agent-b calling_station --hands 1000
Suggested training progression
Sanity: pytest — engine chip conservation, blinds, folds.
Baselines: python scripts/play.py --agent-a tag --agent-b calling_station --hands 100
Neural: python scripts/train.py --steps 20000 --opponent calling_station (easier opponent)
Harder: --opponent tag, then compare with benchmark.py
Watch: UI → select neural:latest vs tag
Training is CPU-friendly; no GPU required for the default MLP size.

Web UI
Stack: React 19, TypeScript, Vite, Framer Motion, Zustand
Look: Dark room gradient, emerald felt, gold accents, glass panels
Table: 6 seat positions; player0 = seat 0 (bottom), player1 = seat 5; seats 1–4 empty/dimmed
Animations: PlaybackDirector queues steps per event (deal, flip, bet pill, pot tick); speed slider (Instant → Slow)
Stats: VPIP, PFR, AF, WTSD, W$SD, bb/100, net chips (updated live over WebSocket)
Project structure
poker-hu-arena/
├── backend/
│   ├── engine/          # Cards, deck, HU state machine, events
│   ├── agents/            # random, tag, calling_station, neural
│   ├── training/          # PolicyNet, PPO trainer
│   ├── stats/             # VPIP / PFR / AF aggregator
│   └── api/               # FastAPI, WebSocket match runner, SQLite
├── frontend/              # React broadcast UI
├── scripts/
│   ├── play.py            # CLI heads-up match
│   ├── train.py           # PPO training entrypoint
│   └── benchmark.py       # Win-rate / bb benchmarking
├── models/checkpoints/    # Saved .pt weights
├── data/                  # arena.db (SQLite, created at runtime)
└── tests/                 # Engine tests
Requirements
Python 3.11+
Node.js 18+ (for frontend)
Python dependencies (main)
fastapi, uvicorn — API server
torch — neural policy + PPO
phevaluator — showdown hand strength
aiosqlite — match/event persistence
numpy, pydantic
Frontend dependencies
react, framer-motion, zustand, vite
Setup & run
1. Backend
cd poker-hu-arena
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
uvicorn backend.api.main:app --reload --port 8000
2. Frontend
cd frontend
npm install
npm run dev
Open http://localhost:5173

3. Start a match in the UI
Choose Agent A and Agent B (e.g. tag vs calling_station, or neural:latest after training).
Set number of hands and animation speed.
Click Start Match.
Use Pause / Resume in the header; click hands in Hand History to replay.
4. CLI (no UI)
python scripts/play.py --agent-a tag --agent-b calling_station --hands 20 --seed 42
API overview
Method	Path	Purpose
GET
/api/agents
List bots + neural checkpoints
POST
/api/matches
Start match { agentA, agentB, hands, stackBb, speedMs, seed }
GET
/api/matches/{id}
Status + stats
GET
/api/matches/{id}/hands
Hand list
GET
/api/matches/{id}/hands/{handId}
Events for replay
POST
/api/matches/{id}/pause
{ "paused": true/false }
WS
/ws/matches/{id}
Live event, stats_update, hand_complete
Event types (for UI / replay)
Type	Meaning
hand_start
Blinds posted, new hand
deal_hole
Hole cards dealt (masked as ** for spectators)
action
fold / check / call / bet / raise / all_in
deal_flop / deal_turn / deal_river
Board cards
showdown
Hole cards revealed
hand_end
Winner + payout
Tests
pytest -v
Covers blind posting, fold-to-end, and chip conservation over many random hands.

Limitations (v1)
Heads-up only in the engine (6-max layout is visual).
No CFR / Deep CFR — PPO + heuristics only.
No tournaments, ICM, or real-money integration.
Neural bet sizing is coarse (action type only; engine picks legal amounts for raise/bet).
Training is single-opponent self-play, not a full opponent pool (yet).
License
Add your license here (project currently unlicensed).

---
**Summary:** The “models” are (1) three heuristic bots, (2) one **128→128 MLP policy** in PyTorch trained with **PPO vs TAG**, and (3) **phevaluator** for showdowns—not an LLM.
Switch to **Agent mode** and say “apply the README” if you want this saved over the existing short `README.md`.
