import React, { useState } from 'react';
import { Clock, Trophy, Users, BookOpen, Settings, Zap } from 'lucide-react';
import SoloPractice from '../pages/SoloPractice';
import InviteFriends from '../pages/InviteFriends';
import Learning from '../pages/Learning';

const TypingTestApp = () => {
  const [currentMode, setCurrentMode] = useState('solo');
  const [theme, setTheme] = useState('dark');
  const [timeLimit, setTimeLimit] = useState(60);

  const easyWords = ['cat', 'dog', 'sun', 'fun', 'run', 'big', 'red', 'blue', 'good', 'bad', 'fast', 'slow', 'hot', 'cold', 'yes', 'no'];
  const hardWords = ['rhythm', 'acknowledge', 'pneumonia', 'beautiful', 'definitely', 'embarrass', 'government', 'maintenance', 'necessary', 'occurred', 'privilege', 'receive', 'separate', 'successful', 'accommodate', 'beginning'];
  const learningLetters = ['a', 'e', 'i', 'o', 'u', 's', 't', 'n', 'r', 'l', 'd', 'c', 'h', 'f', 'p', 'g', 'w', 'y', 'b', 'v', 'k', 'j', 'x', 'q', 'z'];
  const basicWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy'];

  const themes = {
    dark: {
      bg: 'bg-gray-900',
      cardBg: 'bg-gray-800',
      text: 'text-white',
      accent: 'bg-blue-600',
      border: 'border-gray-700'
    },
    light: {
      bg: 'bg-gray-100',
      cardBg: 'bg-white',
      text: 'text-gray-900',
      accent: 'bg-blue-600',
      border: 'border-gray-300'
    },
    neon: {
      bg: 'bg-black',
      cardBg: 'bg-gray-900',
      text: 'text-green-400',
      accent: 'bg-green-600',
      border: 'border-green-500'
    },
    ocean: {
      bg: 'bg-blue-900',
      cardBg: 'bg-blue-800',
      text: 'text-blue-100',
      accent: 'bg-cyan-600',
      border: 'border-blue-600'
    }
  };

  const currentTheme = themes[theme];

  const SettingsPanel = () => (
    <div className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-lg p-6`}>
      <div className="flex items-center mb-6">
        <Settings className="w-8 h-8 text-blue-500 mr-3" />
        <h2 className={`text-2xl font-bold ${currentTheme.text}`}>Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
            Theme
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={`w-full p-3 ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="neon">Neon</option>
            <option value="ocean">Ocean</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
            Time Limit (seconds)
          </label>
          <select
            value={timeLimit}
            onChange={(e) => setTimeLimit(parseInt(e.target.value))}
            className={`w-full p-3 ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${currentTheme.text} mb-2`}>
            TypeMaster Pro
          </h1>
          <p className={`text-lg ${currentTheme.text} opacity-75`}>
            Master your typing skills with advanced features
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-lg p-1 flex space-x-1`}>
            <button
              onClick={() => setCurrentMode('solo')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentMode === 'solo' ? `${currentTheme.accent} text-white` : `${currentTheme.text} hover:bg-gray-700`
              }`}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              Solo Test
            </button>
            <button
              onClick={() => setCurrentMode('multiplayer')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentMode === 'multiplayer' ? `${currentTheme.accent} text-white` : `${currentTheme.text} hover:bg-gray-700`
              }`}
            >
              <Users className="w-4 h-4 inline mr-1" />
              Multiplayer
            </button>
            <button
              onClick={() => setCurrentMode('learning')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentMode === 'learning' ? `${currentTheme.accent} text-white` : `${currentTheme.text} hover:bg-gray-700`
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-1" />
              Learning
            </button>
            <button
              onClick={() => setCurrentMode('settings')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentMode === 'settings' ? `${currentTheme.accent} text-white` : `${currentTheme.text} hover:bg-gray-700`
              }`}
            >
              <Settings className="w-4 h-4 inline mr-1" />
              Settings
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          {currentMode === 'solo' && (
            <SoloPractice
              currentTheme={currentTheme}
              timeLimit={timeLimit}
              easyWords={easyWords}
              hardWords={hardWords}
            />
          )}
          {currentMode === 'multiplayer' && (
            <InviteFriends
              currentTheme={currentTheme}
            />
          )}
          {currentMode === 'learning' && (
            <Learning
              currentTheme={currentTheme}
              easyWords={easyWords}
              hardWords={hardWords}
              basicWords={basicWords}
              learningLetters={learningLetters}
            />
          )}
          {currentMode === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
};

export default TypingTestApp;
