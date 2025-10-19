import { GameState, PlayerCharacter, GameLogEntry, SavedGame } from '../types';

const SAVE_KEY = 'hebrew_rpg_save';

export const saveGame = (gameState: GameState, party: PlayerCharacter[], gameLog: GameLogEntry[]): void => {
  try {
    const data: SavedGame = {
      gameState,
      party,
      gameLog,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    console.log("Game saved successfully.");
  } catch (error) {
    console.error("Failed to save game:", error);
  }
};

export const loadGame = (): SavedGame | null => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      console.log("Game data found, loading.");
      return JSON.parse(savedData) as SavedGame;
    }
    console.log("No save data found.");
    return null;
  } catch (error) {
    console.error("Failed to load game:", error);
    // If loading fails, it's safer to remove the corrupted data
    localStorage.removeItem(SAVE_KEY);
    return null;
  }
};

export const hasSavedGame = (): boolean => {
  return localStorage.getItem(SAVE_KEY) !== null;
};

export const clearSavedGame = (): void => {
  try {
    localStorage.removeItem(SAVE_KEY);
    console.log("Saved game cleared.");
  } catch (error) {
    console.error("Failed to clear saved game:", error);
  }
};
