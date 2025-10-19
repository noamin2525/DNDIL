import { GameState, PlayerCharacter, GameLogEntry, SavedGame } from '../types';

const getSaveKey = (username: string) => `hebrew_rpg_save_${username}`;

export const saveGame = (username: string, gameState: GameState, party: PlayerCharacter[], gameLog: GameLogEntry[]): void => {
  if (!username) return;
  try {
    const data: SavedGame = {
      gameState,
      party,
      gameLog,
    };
    localStorage.setItem(getSaveKey(username), JSON.stringify(data));
    console.log(`Game saved for user ${username}.`);
  } catch (error) {
    console.error("Failed to save game:", error);
  }
};

export const loadGame = (username: string): SavedGame | null => {
  if (!username) return null;
  try {
    const savedData = localStorage.getItem(getSaveKey(username));
    if (savedData) {
      console.log(`Game data found for user ${username}, loading.`);
      return JSON.parse(savedData) as SavedGame;
    }
    console.log(`No save data found for user ${username}.`);
    return null;
  } catch (error) {
    console.error("Failed to load game:", error);
    localStorage.removeItem(getSaveKey(username));
    return null;
  }
};

export const hasSavedGame = (username: string): boolean => {
  if (!username) return false;
  return localStorage.getItem(getSaveKey(username)) !== null;
};

export const clearSavedGame = (username: string): void => {
  if (!username) return;
  try {
    localStorage.removeItem(getSaveKey(username));
    console.log(`Saved game cleared for user ${username}.`);
    // FIX: Added opening brace for the catch block
  } catch (error) {
    console.error("Failed to clear saved game:", error);
  }
};