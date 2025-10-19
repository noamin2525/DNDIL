import React, { useState } from 'react';
import { RACES, CLASSES, GENDERS } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface CharacterCreationProps {
  onCreateCharacter: (name: string, race: string, characterClass: string, gender: string) => void;
  isLoading: boolean;
  error: string | null;
  onLoadGame: () => void;
  hasSave: boolean;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCreateCharacter, isLoading, error, onLoadGame, hasSave }) => {
  const [name, setName] = useState('');
  const [race, setRace] = useState(RACES[0]);
  const [characterClass, setCharacterClass] = useState(CLASSES[0]);
  const [gender, setGender] = useState(GENDERS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateCharacter(name.trim(), race, characterClass, gender);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl p-8 border-2 border-yellow-600/50">
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-2">הרפתקאות בעברית</h1>
        <h2 className="text-2xl text-center text-gray-300 mb-8">יצירת דמות</h2>
        
        {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-yellow-300 mb-1">שם הדמות</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="הכנס את שם גיבורך"
              required
            />
          </div>

          <div>
            <label htmlFor="race" className="block text-sm font-medium text-yellow-300 mb-1">גזע</label>
            <select
              id="race"
              value={race}
              onChange={(e) => setRace(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {RACES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-yellow-300 mb-1">מין</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="class" className="block text-sm font-medium text-yellow-300 mb-1">מקצוע</label>
            <select
              id="class"
              value={characterClass}
              onChange={(e) => setCharacterClass(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-md hover:bg-yellow-500 transition-colors duration-300 disabled:bg-gray-500 flex items-center justify-center text-lg"
          >
            {isLoading ? <LoadingSpinner /> : 'צור דמות ראשית'}
          </button>
        </form>

        {hasSave && (
          <div className="mt-6 text-center">
             <p className="text-gray-400 mb-2">אוֹ</p>
             <button
              onClick={onLoadGame}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-500 transition-colors duration-300"
            >
              טען משחק שמור
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCreation;
