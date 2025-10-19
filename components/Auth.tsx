import React, { useState } from 'react';
import { login, register } from '../services/authService';
import LoadingSpinner from './LoadingSpinner';

interface AuthProps {
  onAuthSuccess: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (isLogin) {
      const result = login(username, password);
      if (result.success) {
        onAuthSuccess(username);
      } else {
        setError(result.message);
      }
    } else {
      if (password !== confirmPassword) {
        setError("הסיסמאות אינן תואמות.");
        setIsLoading(false);
        return;
      }
      const result = register(username, password);
      if (result.success) {
        setSuccess(result.message + " אנא התחבר כדי להמשיך.");
        setIsLogin(true); // Switch to login view after successful registration
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(result.message);
      }
    }
    setIsLoading(false);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl p-8 border-2 border-yellow-600/50">
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-2">הרפתקאות בעברית</h1>
        <h2 className="text-2xl text-center text-gray-300 mb-8">{isLogin ? 'התחברות' : 'הרשמה'}</h2>
        
        {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-center">{error}</p>}
        {success && <p className="bg-green-500/20 text-green-300 p-3 rounded-md mb-4 text-center">{success}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-yellow-300 mb-1">שם משתמש</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-yellow-300 mb-1">סיסמה</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-yellow-300 mb-1">אימות סיסמה</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-md hover:bg-yellow-500 transition-colors duration-300 disabled:bg-gray-500 flex items-center justify-center text-lg"
          >
            {isLoading ? <LoadingSpinner /> : (isLogin ? 'התחבר' : 'הירשם')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={toggleForm} className="text-yellow-400 hover:text-yellow-300">
            {isLogin ? 'אין לך חשבון? הירשם כאן' : 'יש לך חשבון? התחבר כאן'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
