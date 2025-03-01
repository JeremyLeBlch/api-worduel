export type StatsMode = "global" | "solo" | "duel";

export interface ComputedStats {
  totalGames: number;
  totalLosses: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
  averageGuesses: number;
  medianGuesses: number;
  winsByGuesses: Record<number, number>;
  averageDurationSec: number;
  minDurationSec: number;
  maxDurationSec: number;
  bestWinStreak: number;
  worstLossStreak: number;
  ongoingStreakCount: number;
  ongoingStreakType: string | null;
}