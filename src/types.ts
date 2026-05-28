export type PokerEvent = {
  handId: string;
  seq: number;
  type: string;
  street?: string;
  actor?: string;
  action?: string;
  amount?: number;
  pot?: number;
  stacks?: number[];
  board?: string[];
  holeCards?: Record<string, string[] | null>;
  seatLayout?: { dealer: number; sb: number; bb: number };
  animationHints?: Record<string, unknown>;
  extra?: Record<string, unknown>;
};

export type PlayerStats = {
  hands: number;
  vpipPct: number;
  pfrPct: number;
  af: number;
  wtsdPct: number;
  wsdPct: number;
  bbPer100: number;
  net_chips: number;
};

export type TableState = {
  handNumber: number;
  pot: number;
  board: string[];
  stacks: [number, number];
  holeCards: Record<string, string[] | null>;
  activeActor: string | null;
  dealerSeat: number;
  live: boolean;
  ticker: string;
  betPill: { seat: number; text: string } | null;
};

export const SEAT_POSITIONS = [
  { x: 50, y: 88, active: true },
  { x: 12, y: 55, active: false },
  { x: 50, y: 12, active: false },
  { x: 88, y: 55, active: false },
  { x: 88, y: 72, active: false },
  { x: 50, y: 72, active: true },
];

export const PLAYER_SEATS: Record<string, number> = {
  player0: 0,
  player1: 5,
};
