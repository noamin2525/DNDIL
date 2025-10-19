export enum GameState {
  CHARACTER_CREATION = 'CHARACTER_CREATION',
  PARTY_ASSEMBLY = 'PARTY_ASSEMBLY',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export interface PlayerCharacter {
  name: string;
  race: string;
  class: string;
  gender: string;
  hp: number;
  maxHp: number;
  inventory: string[];
  backstory: string;
  // Adding stats for more interesting gameplay
  strength: number;
  dexterity: number;
  intelligence: number;
  imageUrl?: string;
}

export interface GameLogEntry {
  sender: string;
  message: string;
}

export interface GeminiResponse {
  narrative: string;
  updatedParty: PlayerCharacter[];
  isGameOver: boolean;
  gameOverReason?: string;
}

// New interface for saved game data
export interface SavedGame {
  gameState: GameState;
  party: PlayerCharacter[];
  gameLog: GameLogEntry[];
}

export const RACES = ["אנושי", "אלף", "גמד", "בן-מחצית"];
export const CLASSES = ["לוחם", "קוסם", "גנב", "כוהן"];
export const GENDERS = ["זכר", "נקבה"];
