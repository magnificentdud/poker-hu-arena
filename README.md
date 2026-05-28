# Poker HU Arena

Heads-up No-Limit Texas Hold'em with AI agents and a broadcast-style web UI.

## Quick start

```bash
# Backend
cd /Users/woochanjung/Projects/poker-hu-arena
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn backend.api.main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend && npm install && npm run dev

# CLI play
python scripts/play.py --agent-a tag --agent-b calling_station --hands 10

# Train
python scripts/train.py --steps 5000
```

Open http://localhost:5173
