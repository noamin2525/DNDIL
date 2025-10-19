import React, { useState, useCallback, useEffect } from 'react';
import { GameState, PlayerCharacter, GameLogEntry, RACES, CLASSES, GENDERS } from './types';
import { generateCharacter, getGameUpdate, generateCharacterImage, getInitialScenario } from './services/geminiService';
import { saveGame, loadGame, hasSavedGame, clearSavedGame } from './services/storageService';
import CharacterCreation from './components/CharacterCreation';
import { GameUI } from './components/GameUI';
import LoadingSpinner from './components/LoadingSpinner';

// --- Party Assembly Component ---
interface PartyAssemblyProps {
  mainCharacter: PlayerCharacter;
  onFinalizeParty: (companions: { race: string; class: string; gender: string }[]) => void;
  isLoading: boolean;
  error: string | null;
  party: PlayerCharacter[];
}

const CharacterCard: React.FC<{ character: PlayerCharacter }> = ({ character }) => (
    <div className="bg-gray-700 p-4 rounded-lg border border-yellow-600/30 text-center transform hover:scale-105 transition-transform duration-300">
        {character.imageUrl ? (
          <img src={character.imageUrl} alt={character.name} className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-2 border-yellow-500" />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-2 bg-gray-800 border-2 border-yellow-500 flex items-center justify-center">
            <LoadingSpinner/>
          </div>
        )}
        <h3 className="text-xl font-bold text-yellow-400">{character.name}</h3>
        <p className="text-gray-300">{character.gender} {character.race} {character.class}</p>
    </div>
);

const PartyAssembly: React.FC<PartyAssemblyProps> = ({ mainCharacter, onFinalizeParty, isLoading, error, party }) => {
    const [companions, setCompanions] = useState<{ race: string; class: string; gender: string }[]>([]);

    const addCompanionSlot = () => {
        if (companions.length < 3) {
            setCompanions([...companions, { race: RACES[0], class: CLASSES[0], gender: GENDERS[0] }]);
        }
    };

    const updateCompanion = (index: number, field: 'race' | 'class' | 'gender', value: string) => {
        const newCompanions = [...companions];
        newCompanions[index][field] = value;
        setCompanions(newCompanions);
    };
    
    const removeCompanionSlot = (index: number) => {
        const newCompanions = companions.filter((_, i) => i !== index);
        setCompanions(newCompanions);
    };

    const handleSubmit = () => {
        onFinalizeParty(companions);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 transition-opacity duration-500">
            <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-2xl p-8 border-2 border-yellow-600/50">
                <h1 className="text-4xl font-bold text-center text-yellow-400 mb-2">הרכבת הקבוצה</h1>
                <p className="text-center text-gray-300 mb-8">ההרפתקה מסוכנת, אל תצא אליה לבד. בחר עד שלושה בני לוויה למסע.</p>

                <div className="mb-8">
                    <h2 className="text-2xl text-yellow-300 mb-4 text-center">הצוות הנוכחי</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {party.map(member => <CharacterCard key={member.name} character={member} />)}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl text-yellow-300 mb-4 text-center">הוסף חברים לקבוצה</h2>
                    <div className="space-y-4 max-w-lg mx-auto">
                        {companions.map((comp, index) => (
                            <div key={index} className="bg-gray-700 p-3 rounded-md border border-gray-600 flex items-center gap-2">
                                <div className="flex-grow grid grid-cols-3 gap-2">
                                    <select
                                        value={comp.race}
                                        onChange={(e) => updateCompanion(index, 'race', e.target.value)}
                                        className="w-full bg-gray-600 border border-gray-500 rounded-md px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                    >
                                        {RACES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                     <select
                                        value={comp.gender}
                                        onChange={(e) => updateCompanion(index, 'gender', e.target.value)}
                                        className="w-full bg-gray-600 border border-gray-500 rounded-md px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                    >
                                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                    <select
                                        value={comp.class}
                                        onChange={(e) => updateCompanion(index, 'class', e.target.value)}
                                        className="w-full bg-gray-600 border border-gray-500 rounded-md px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                    >
                                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <button onClick={() => removeCompanionSlot(index)} className="text-red-400 hover:text-red-300 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        ))}
                        {companions.length < 3 && (
                            <button
                                onClick={addCompanionSlot}
                                className="w-full border-2 border-dashed border-gray-600 text-gray-400 font-bold py-2 px-4 rounded-md hover:border-yellow-500 hover:text-yellow-500 transition-colors duration-300"
                            >
                                + הוסף בן לוויה
                            </button>
                        )}
                    </div>
                </div>

                 {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md my-4 text-center">{error}</p>}

                <div className="mt-8 text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || companions.length === 0}
                        className="bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-md hover:bg-yellow-500 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex justify-center items-center text-lg mx-auto"
                    >
                        {isLoading ? <LoadingSpinner /> : `צור ${companions.length} דמויות והתחל!`}
                    </button>
                    {companions.length === 0 &&
                      <button
                          onClick={() => onFinalizeParty([])}
                          disabled={isLoading}
                          className="mt-4 text-gray-400 hover:text-yellow-400"
                      >
                        או, צא להרפתקה לבד...
                      </button>
                    }
                </div>
            </div>
        </div>
    );
}

// --- Main App Component ---
const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.CHARACTER_CREATION);
  const [party, setParty] = useState<PlayerCharacter[]>([]);
  const [gameLog, setGameLog] = useState<GameLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [hasSave, setHasSave] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setHasSave(hasSavedGame());
  }, []);

  const handleRestart = () => {
    setGameState(GameState.CHARACTER_CREATION);
    setParty([]);
    setGameLog([]);
    setIsLoading(false);
    setError(null);
    setGameOverReason(null);
    clearSavedGame();
    setHasSave(false);
  };
  
  const handleCreateCharacter = useCallback(async (name: string, race: string, characterClass: string, gender: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const mainCharacter = await generateCharacter(name, race, characterClass, gender);
      setParty([{...mainCharacter, imageUrl: ''}]); // set party with placeholder image
      const imageUrl = await generateCharacterImage(mainCharacter);
      const finalCharacter = { ...mainCharacter, imageUrl };
      
      setParty([finalCharacter]);
      setGameState(GameState.PARTY_ASSEMBLY);
    } catch (e: any) {
      setError(e.message || 'שגיאה לא צפויה ביצירת הדמות.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFinalizeParty = useCallback(async (companionsToCreate: { race: string, class: string, gender: string }[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const finalParty = [...party];
        for (const companion of companionsToCreate) {
            const newCharacter = await generateCharacter('', companion.race, companion.class, companion.gender);
            finalParty.push({ ...newCharacter, imageUrl: '' });
            setParty([...finalParty]); // Update party to show new member card with loader

            const imageUrl = await generateCharacterImage(newCharacter);
            const finalCompanion = {...newCharacter, imageUrl};
            
            // Update the companion in finalParty and state
            finalParty[finalParty.length - 1] = finalCompanion;
            setParty([...finalParty]);
        }
        
        const partyNames = finalParty.map(p => p.name).join(', ');
        const startingNarrative = await getInitialScenario(finalParty);

        const initialLog: GameLogEntry[] = [
            { sender: 'System', message: `ברוכים הבאים להרפתקה, ${partyNames}!` },
            { sender: 'DM', message: startingNarrative }
        ];

        setParty(finalParty);
        setGameLog(initialLog);
        setGameState(GameState.PLAYING);
      } catch (e: any) {
          setError(e.message || 'שגיאה לא צפויה ביצירת חברי הצוות.');
      } finally {
          setIsLoading(false);
      }
  }, [party]);

  const handlePlayerAction = useCallback(async (action: string) => {
    if (party.length === 0) return;

    const mainCharacterName = party[0].name;
    const newLog: GameLogEntry[] = [...gameLog, { sender: mainCharacterName, message: action }];
    setGameLog(newLog);
    setIsLoading(true);
    setError(null);

    try {
      const response = await getGameUpdate(party, newLog, action);
      
      const updatedPartyWithImages = response.updatedParty.map((updatedMember) => {
        const existingMember = party.find(p => p.name === updatedMember.name);
        return {
          ...updatedMember,
          imageUrl: existingMember?.imageUrl || '' 
        }
      });
      setParty(updatedPartyWithImages);
      
      const dmResponseLog: GameLogEntry = { sender: 'DM', message: response.narrative };
      setGameLog(prevLog => [...prevLog, dmResponseLog]);

      if (response.isGameOver) {
        setGameState(GameState.GAME_OVER);
        setGameOverReason(response.gameOverReason || "המסע שלכם הגיע לסופו.");
        const gameOverLog: GameLogEntry = { sender: 'System', message: response.gameOverReason || "המסע שלכם הגיע לסופו." };
        setGameLog(prevLog => [...prevLog, gameOverLog]);
      }

    } catch (e: any) {
        const errorLog: GameLogEntry = { sender: 'System', message: `שגיאה: ${e.message}` };
        setGameLog(prevLog => [...prevLog, errorLog]);
    } finally {
      setIsLoading(false);
    }
  }, [party, gameLog]);

  const handleSaveGame = useCallback(() => {
    if (gameState === GameState.PLAYING || gameState === GameState.GAME_OVER) {
        saveGame(gameState, party, gameLog);
        setSaveMessage('המשחק נשמר!');
        setTimeout(() => setSaveMessage(null), 3000);
    }
  }, [gameState, party, gameLog]);

  const handleLoadGame = useCallback(() => {
    const savedData = loadGame();
    if (savedData) {
        setGameState(savedData.gameState);
        setParty(savedData.party);
        setGameLog(savedData.gameLog);
        
        // FIX: Corrected typo from GAME_over to GAME_OVER
        if (savedData.gameState === GameState.GAME_OVER) {
          const lastSystemMessage = savedData.gameLog.filter(m => m.sender === 'System').pop();
          setGameOverReason(lastSystemMessage?.message || "המסע שלכם הגיע לסופו.");
        }
    } else {
        setError("לא נמצאה שמירה או שהשמירה פגומה.");
        setHasSave(false); // Update state if save is corrupt
    }
  }, []);


  switch (gameState) {
    case GameState.CHARACTER_CREATION:
      return <CharacterCreation 
        onCreateCharacter={handleCreateCharacter} 
        isLoading={isLoading} 
        error={error} 
        onLoadGame={handleLoadGame}
        hasSave={hasSave}
      />;
    
    case GameState.PARTY_ASSEMBLY:
      if (party[0]) {
        return <PartyAssembly mainCharacter={party[0]} onFinalizeParty={handleFinalizeParty} isLoading={isLoading} error={error} party={party} />;
      }
      break; // Fallthrough to loading if main character not ready

    case GameState.PLAYING:
    case GameState.GAME_OVER:
      if (party.length > 0) {
        return <GameUI 
          party={party} 
          gameLog={gameLog}
          isLoading={isLoading}
          gameState={gameState}
          gameOverReason={gameOverReason}
          onPlayerAction={handlePlayerAction}
          onRestart={handleRestart}
          onSaveGame={handleSaveGame}
          saveMessage={saveMessage}
        />;
      }
      break; // Fallthrough to loading if party not ready
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <LoadingSpinner />
      <p className="ml-4">טוען משחק...</p>
    </div>
  );
};

export default App;
