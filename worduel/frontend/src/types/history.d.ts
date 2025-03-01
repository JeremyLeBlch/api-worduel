export interface HistoryPlayer {
  id?: string;
  mode: string;
  avatarOpponent: string;
  usernameOpponent: string;
  scoreByTimeMe: number;
  scoreByGuessesMe: number;
  scoreBonusMe: number;
  scoreByTimeOpponent: number;
  scoreByGuessesOpponent: number;
  scoreBonusOpponent: number;
  succeeded: string;
  wordText: string;
  endedAt: string;
  guesses_count?: number;
  duration?: number; 
}
