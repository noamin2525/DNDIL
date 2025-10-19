import React, { useState, useRef, useEffect } from 'react';
import { PlayerCharacter, GameLogEntry, GameState } from '../types';
import LoadingSpinner from './LoadingSpinner';

// --- New Components & Hooks ---

// Typing Effect Component
const TypingEffect: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDisplayedText('');
        setIsTyping(true);
        if (!text) return;

        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                i++;
            } else {
                clearInterval(intervalId);
                setIsTyping(false);
            }
        }, 25); // Adjust speed here

        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <div ref={containerRef}>
            <p className="whitespace-pre-wrap">
                {displayedText}
                {isTyping && <span className="inline-block w-2 h-5 bg-yellow-300 animate-pulse ml-1" aria-hidden="true"></span>}
            </p>
        </div>
    );
};

// --- Icons for Stats ---
const StrengthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16.5a1.5 1.5 0 01-1.416-1.921l1.5-6A1.5 1.5 0 017 7h1.5a1.5 1.5 0 011.416 1.921l-1.5 6A1.5 1.5 0 017 16.5H5.5zM15.5 16.5a1.5 1.5 0 01-1.416-1.921l1.5-6A1.5 1.5 0 0117 7h1.5a1.5 1.5 0 011.416 1.921l-1.5 6A1.5 1.5 0 0117 16.5h-1.5z" /><path d="M8 9a1.5 1.5 0 013 0v1.75a.75.75 0 001.5 0V9a3 3 0 00-6 0v1.75a.75.75 0 001.5 0V9z" /><path fillRule="evenodd" d="M3.009 8.35a1.5 1.5 0 012.336-1.332l1.5 2.5a1.5 1.5 0 11-2.49 1.494l-1.5-2.5a1.5 1.5 0 01.154-2.162zM16.991 8.35a1.5 1.5 0 01.154 2.162l-1.5 2.5a1.5 1.5 0 11-2.49-1.494l1.5-2.5a1.5 1.5 0 012.336 1.332z" clipRule="evenodd" /></svg>;
const DexterityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.5 3a.5.5 0 00-1 0v1.5H3a.5.5 0 000 1h1.5V7a.5.5 0 001 0V5.5H7a.5.5 0 000-1H5.5V3zM3 11.5a.5.5 0 01.5-.5H7a.5.5 0 010 1H3.5a.5.5 0 01-.5-.5zm1.5 2.5a.5.5 0 000 1H7a.5.5 0 000-1H4.5zM11.5 3a.5.5 0 00-1 0v1.5H9a.5.5 0 000 1h1.5V7a.5.5 0 001 0V5.5H13a.5.5 0 000-1h-1.5V3zM9 11.5a.5.5 0 01.5-.5H13a.5.5 0 010 1H9.5a.5.5 0 01-.5-.5zm1.5 2.5a.5.5 0 000 1H13a.5.5 0 000-1h-2z" clipRule="evenodd" /><path d="M15 3.5a1 1 0 011 1v1.793l1.146-1.147a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 11.708-.708L15 6.293V4.5a1 1 0 011-1zM15.01 11.01a.5.5 0 01.49.5v3.793l1.146-1.147a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 01.708-.708L15 15.793v-3.783a.5.5 0 01.51-.5z" /></svg>;
const IntelligenceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.362 3.292a.5.5 0 00-.724 0l-4.5 5a.5.5 0 00.362.858h9a.5.5 0 00.362-.858l-4.5-5zM9.5 10a.5.5 0 01.5.5v1.282a.5.5 0 00.304.46l2.008 1.004a.5.5 0 00.392-.852l-1.704-.852V10.5a.5.5 0 011 0v.688a.5.5 0 00.304.46l2.008 1.004a.5.5 0 00.392-.852l-1.704-.852V10.5a.5.5 0 011 0v.688a.5.5 0 00.304.46l2.008 1.004a.5.5 0 10.44-1.308l-8-4a.5.5 0 00-.44 0l-8 4a.5.5 0 10.44 1.308l2.008-1.004A.5.5 0 006 11.188V10.5a.5.5 0 011 0v.188a.5.5 0 00.304.46l2.008 1.004a.5.5 0 10.44-1.308L8.05 9.996A.5.5 0 007.75 9.538V9a.5.5 0 01.5-.5h3.5a.5.5 0 01.5.5v.538a.5.5 0 00-.304.458L10.25 10.5a.5.5 0 01-.5-.5V10z" /><path d="M5 14.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5z" /></svg>;

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded-md" title={`${label}: ${value}`}>
        <span className="text-yellow-300">{icon}</span>
        <span className="font-mono font-bold text-sm text-white">{value}</span>
    </div>
);

const PartyMemberCard: React.FC<{ character: PlayerCharacter; isLeader: boolean }> = ({ character, isLeader }) => {
    const hpPercentage = (character.hp / character.maxHp) * 100;
    const [isExpanded, setIsExpanded] = useState(isLeader);

    return (
        <div className={`bg-gray-900/50 p-3 rounded-lg border-2 transition-all duration-300 ${isLeader ? 'border-yellow-500 shadow-yellow-500/20 shadow-lg' : 'border-yellow-600/20'}`}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded} aria-controls={`character-details-${character.name}`}>
                <div className="flex-shrink-0">
                  {character.imageUrl ? (
                     <img src={character.imageUrl} alt={character.name} className="w-16 h-16 rounded-full object-cover border-2 border-yellow-600/50" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-yellow-600/50 flex items-center justify-center animate-pulse">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-yellow-400 truncate">{character.name} {isLeader && <span className="text-xs text-yellow-300/80">(מנהיג/ה)</span>}</h3>
                    <p className="text-sm text-gray-300">{character.gender} {character.race} {character.class}</p>
                    <div title={`HP: ${character.hp} / ${character.maxHp}`} className="w-full bg-red-900 rounded-full h-4 border border-red-500/50 mt-1">
                        <div className="bg-red-600 h-full rounded-full text-xs text-white text-center font-bold transition-all duration-500 flex items-center justify-center" style={{ width: `${hpPercentage}%` }}>{character.hp}</div>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
            <div id={`character-details-${character.name}`} className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                <div className="border-t border-yellow-600/20 pt-3">
                    <div className="flex justify-around gap-2 mb-3">
                        <Stat icon={<StrengthIcon />} label="כוח" value={character.strength} />
                        <Stat icon={<DexterityIcon />} label="זריזות" value={character.dexterity} />
                        <Stat icon={<IntelligenceIcon />} label="חוכמה" value={character.intelligence} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-yellow-300/80 mb-1">ציוד:</h4>
                        {character.inventory.length > 0 ? (
                            <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                                {character.inventory.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400 italic">אין פריטים.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PartySheet: React.FC<{ party: PlayerCharacter[] }> = ({ party }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border-2 border-yellow-600/50 shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold text-yellow-400 border-b-2 border-yellow-600/30 pb-2 mb-4 text-center">הקבוצה שלך</h2>
      <div className="space-y-3 overflow-y-auto pr-2 -mr-2">
        {party.map((member, index) => (
            <PartyMemberCard key={member.name + index} character={member} isLeader={index === 0} />
        ))}
      </div>
    </div>
  );
};


// --- Icon Components ---
const DmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;
const PlayerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const CombatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>;

const getSenderConfig = (sender: string, partyNames: string[]) => {
  if (partyNames.includes(sender)) {
    return {
        icon: <PlayerIcon />,
        iconColor: 'text-green-400',
        bubbleClass: 'bg-green-900/60 text-green-200 rounded-br-none',
        containerClass: 'flex-row-reverse self-end',
      };
  }
  
  switch (sender) {
    case 'Combat':
      return {
        icon: <CombatIcon />,
        iconColor: 'text-red-400',
        bubbleClass: 'bg-red-900/70 text-red-200 rounded-bl-none border border-red-500/40',
        containerClass: 'self-start',
      };
    case 'DM':
    default:
      return {
        icon: <DmIcon />,
        iconColor: 'text-indigo-400',
        bubbleClass: 'bg-indigo-900/70 text-indigo-200 rounded-bl-none',
        containerClass: 'self-start',
      };
  }
};

// FIX: Define the GameUIProps interface.
interface GameUIProps {
  party: PlayerCharacter[];
  gameLog: GameLogEntry[];
  isLoading: boolean;
  gameState: GameState;
  gameOverReason: string | null;
  onPlayerAction: (action: string) => void;
  onRestart: () => void;
  onSaveGame: () => void;
  saveMessage: string | null;
}

export const GameUI: React.FC<GameUIProps> = ({ party, gameLog, isLoading, gameState, gameOverReason, onPlayerAction, onRestart, onSaveGame, saveMessage }) => {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('log'); // For mobile view
  const logEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const partyNames = party.map(p => p.name);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (gameLog.length > 1 && gameLog[gameLog.length-1].sender === 'DM') {
        audioRef.current?.play().catch(e => console.log("Audio play failed, requires user interaction."));
    }
  }, [gameLog]);

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && gameState === GameState.PLAYING) {
      onPlayerAction(input.trim());
      setInput('');
    }
  };
  
  const TabButton: React.FC<{ tabName: string; label: string }> = ({ tabName, label }) => (
    <button onClick={() => setActiveTab(tabName)} className={`py-2 px-4 w-full font-bold transition-colors duration-300 ${activeTab === tabName ? 'bg-yellow-600 text-gray-900' : 'bg-gray-700 text-yellow-300'}`}>
        {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto p-2 md:p-4 h-screen flex flex-col md:grid md:grid-cols-3 md:gap-6">
        <audio ref={audioRef} src="https://actions.google.com/sounds/v1/ui/ui_tap_forward.ogg" preload="auto" className="hidden"></audio>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden flex rounded-t-lg overflow-hidden border-b-2 border-yellow-600/50 flex-shrink-0">
            <TabButton tabName="log" label="סיפור" />
            <TabButton tabName="party" label={`קבוצה (${party.length})`} />
        </div>

      {/* Party Sheet */}
      <div className={`md:col-span-1 md:max-h-[calc(100vh-2rem)] min-h-0 ${activeTab === 'party' ? 'block flex-grow' : 'hidden'} md:block`}>
        <PartySheet party={party} />
      </div>

      {/* Game Log and Input */}
      <div className={`md:col-span-2 bg-gray-800 rounded-lg border-2 border-yellow-600/50 shadow-lg md:max-h-[calc(100vh-2rem)] min-h-0 ${activeTab === 'log' ? 'flex flex-col flex-grow' : 'hidden'} md:flex`}>
        <div className="flex-grow p-4 overflow-y-auto" aria-live="polite">
          <div className="flex flex-col gap-4">
            {gameLog.map((entry, index) => {
              if (entry.sender === 'System') {
                return (
                  <div key={index} className="my-2 text-center">
                    <p className="text-sm italic text-yellow-300/80 px-4 py-1 bg-gray-900/40 rounded-full inline-block">
                      {entry.message}
                    </p>
                  </div>
                );
              }
              
              const senderInfo = getSenderConfig(entry.sender, partyNames);
              const isLastDmMessage = entry.sender === 'DM' && index === gameLog.length - 1;

              return (
                <div key={index} className={`flex w-full max-w-4xl gap-3 ${senderInfo.containerClass}`}>
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-900/60 ${senderInfo.iconColor}`}>
                    {senderInfo.icon}
                  </div>
                  <div className={`rounded-lg p-3 shadow-md ${senderInfo.bubbleClass}`}>
                    {isLastDmMessage && !isLoading ? <TypingEffect text={entry.message} /> : <p className="whitespace-pre-wrap">{entry.message}</p>}

                  </div>
                </div>
              );
            })}
             <div ref={logEndRef} />
          </div>
        </div>

        {gameState === GameState.PLAYING && (
          <div className="p-4 border-t-2 border-yellow-600/30">
            {isLoading && <LoadingSpinner />}
            <form onSubmit={handleActionSubmit} className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="מה תעשו עכשיו?"
                className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-600"
                disabled={isLoading}
              />
              <button type="submit" className="bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors duration-300 disabled:bg-gray-500" disabled={isLoading}>
                שלח
              </button>
               <button
                  type="button"
                  onClick={onSaveGame}
                  title="שמור משחק"
                  className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors duration-300 disabled:bg-gray-500"
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12l-5-3.5L5 16V4z" />
                  </svg>
                </button>
            </form>
             {saveMessage && (
              <p className="text-center text-sm text-green-400 mt-2 animate-pulse">
                {saveMessage}
              </p>
            )}
          </div>
        )}
        
        {gameState === GameState.GAME_OVER && (
            <div className="p-6 text-center bg-red-900/50 rounded-b-lg">
                <h3 className="text-2xl font-bold text-red-300">המשחק נגמר</h3>
                <p className="text-red-200 mt-2 mb-4">{gameOverReason}</p>
                <button onClick={onRestart} className="bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-yellow-500 transition-colors duration-300">
                    שחק שוב
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
