export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  successMessage: string; // "Vay canına, hafızan fil gibi!"
  failMessage: string;    // "Ah be, bunu nasıl unutursun?"
  funFact?: string;       // Context from the chat logs
}

export enum GameState {
  INTRO,
  LOADING,
  PLAYING,
  GAME_OVER,
  VICTORY,
  CERTIFICATE
}

export const MONEY_LADDER = [
  "500 ❤️",
  "1.000 ❤️",
  "2.000 ❤️",
  "3.000 ❤️",
  "5.000 ❤️",
  "7.500 ❤️",
  "10.000 ❤️",
  "20.000 ❤️",
  "50.000 ❤️",
  "100.000 ❤️",
  "250.000 ❤️",
  "500.000 ❤️",
  "1 MİLYON ❤️"
];