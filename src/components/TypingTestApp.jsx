import React, { useState, useEffect, useRef } from 'react';
import { Clock, Trophy, Users, BookOpen, Settings, Send, Copy, Star, Target, Zap, Award } from 'lucide-react';

const TypingTestApp = () => {
  const [currentMode, setCurrentMode] = useState('solo');
  const [theme, setTheme] = useState('dark');
  const [timeLimit, setTimeLimit] = useState(60);
  
  // Word lists
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

  // Solo Typing Test Component
  const SoloTypingTest = () => {
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [errors, setErrors] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const inputRef = useRef(null);

    const generateText = () => {
      const mixedWords = [];
      for (let i = 0; i < 50; i++) {
        if (Math.random() < 0.3) {
          mixedWords.push(hardWords[Math.floor(Math.random() * hardWords.length)]);
        } else {
          mixedWords.push(easyWords[Math.floor(Math.random() * easyWords.length)]);
        }
      }
      return mixedWords.join(' ');
    };

    useEffect(() => {
      setText(generateText());
    }, []);

    useEffect(() => {
      if (isStarted && timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else if (timeLeft === 0) {
        setIsFinished(true);
      }
    }, [isStarted, timeLeft]);

    const handleInputChange = (e) => {
      const value = e.target.value;
      
      if (!isStarted) {
        setIsStarted(true);
      }

      setInput(value);
      
      // Calculate stats
      const wordsTyped = value.trim().split(' ').length;
      const timeElapsed = timeLimit - timeLeft;
      const wpmCalc = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
      setWpm(wpmCalc);

      // Calculate accuracy
      let correctChars = 0;
      let totalChars = value.length;
      
      for (let i = 0; i < Math.min(value.length, text.length); i++) {
        if (value[i] === text[i]) {
          correctChars++;
        }
      }
      
      const accuracyCalc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
      setAccuracy(accuracyCalc);
      setErrors(totalChars - correctChars);

      setCurrentIndex(value.length);
    };

    const resetTest = () => {
      setText(generateText());
      setInput('');
      setCurrentIndex(0);
      setIsStarted(false);
      setTimeLeft(timeLimit);
      setWpm(0);
      setAccuracy(100);
      setErrors(0);
      setIsFinished(false);
    };

    const renderText = () => {
      return text.split('').map((char, index) => {
        let className = 'text-gray-400';
        
        if (index < input.length) {
          className = input[index] === char ? 'text-green-400' : 'text-red-400 bg-red-200';
        } else if (index === currentIndex) {
          className = 'bg-blue-500 text-white';
        }
        
        return (
          <span key={index} className={className}>
            {char}
          </span>
        );
      });
    };

    if (isFinished) {
      return (
        <div className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-lg p-6`}>
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>Test Complete!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`${currentTheme.bg} rounded-lg p-4`}>
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-blue-500 mr-2" />
                  <span className={`text-sm ${currentTheme.text}`}>Speed</span>
                </div>
                <div className={`text-2xl font-bold ${currentTheme.text}`}>{wpm} WPM</div>
              </div>
              
              <div className={`${currentTheme.bg} rounded-lg p-4`}>
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-green-500 mr-2" />
                  <span className={`text-sm ${currentTheme.text}`}>Accuracy</span>
                </div>
                <div className={`text-2xl font-bold ${currentTheme.text}`}>{accuracy}%</div>
              </div>
              
              <div className={`${currentTheme.bg} rounded-lg p-4`}>
                <div className="flex items-center justify-center mb-2">
                  <span className={`text-sm ${currentTheme.text}`}>Errors</span>
                </div>
                <div className={`text-2xl font-bold ${currentTheme.text}`}>{errors}</div>
              </div>
            </div>

            <button
              onClick={resetTest}
              className={`${currentTheme.accent} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity`}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-lg p-6`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className={`${currentTheme.text} font-mono text-lg`}>
              <Clock className="w-5 h-5 inline mr-1" />
              {timeLeft}s
            </div>
            <div className={`${currentTheme.text} text-sm`}>
              {wpm} WPM | {accuracy}% Accuracy
            </div>
          </div>
          <button
            onClick={resetTest}
            className={`${currentTheme.accent} text-white px-4 py-2 rounded hover:opacity-90 transition-opacity`}
          >
            Reset
          </button>
        </div>

        <div className={`${currentTheme.bg} rounded-lg p-4 mb-4 font-mono text-lg leading-relaxed`}>
          {renderText()}
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          className={`w-full h-24 p-3 ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border rounded-lg font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={isFinished}
        />
      </div>
    );
  };

  // Multiplayer Component
  const MultiplayerMode = () => {
    const [gameState, setGameState] = useState('setup'); // setup, waiting, playing, finished
    const [email, setEmail] = useState('');
    const [gameLink, setGameLink] = useState('');
    const [players, setPlayers] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    const createGame = () => {
      const link = `https://varnavelocity.vercel.app/game/${Math.random().toString(36).substr(2, 9)}`;
      setGameLink(link);
      setGameState('waiting');
      setPlayers([{ name: 'You', wpm: 0, accuracy: 0, status: 'waiting' }]);
    };

    const invitePlayer = () => {
      if (email) {
        // Simulate sending email invitation
        setPlayers(prev => [...prev, { name: email, wpm: 0, accuracy: 0, status: 'invited' }]);
        setEmail('');
      }
    };

    const copyLink = () => {
      navigator.clipboard.writeText(gameLink);
    };

    const startGame = () => {
      setGameState('playing');
      // Simulate other players joining
      setPlayers(prev => prev.map(p => ({ ...p, status: 'playing' })));
    };

    const finishGame = () => {
      setGameState('finished');
      // Simulate final results
      const finalResults = players.map(p => ({
        ...p,
        wpm: Math.floor(Math.random() * 60) + 20,
        accuracy: Math.floor(Math.random() * 20) + 80
      })).sort((a, b) => b.wpm - a.wpm);
      setLeaderboard(finalResults);
    };

    return (
      <div className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-lg p-6`}>
        {gameState === 'setup' && (
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>Create Multiplayer Game</h2>
            <button
              onClick={createGame}
              className={`${currentTheme.accent} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity`}
            >
              Create Game Room
            </button>
          </div>
        )}

        {gameState === 'waiting' && (
          <div>
            <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>Invite Players</h2>
            
            <div className="mb-6">
              <div className="flex mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to invite"
                  className={`flex-1 p-3 ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  onClick={invitePlayer}
                  className={`${currentTheme.accent} text-white px-4 py-3 rounded-r-lg hover:opacity-90 transition-opacity`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={gameLink}
                  readOnly
                  className={`flex-1 p-3 ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border rounded-l-lg`}
                />
                <button
                  onClick={copyLink}
                  className={`${currentTheme.accent} text-white px-4 py-3 rounded-r-lg hover:opacity-90 transition-opacity`}
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${currentTheme.text} mb-3`}>Players ({players.length})</h3>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div key={index} className={`${currentTheme.bg} p-3 rounded-lg flex justify-between items-center`}>
                    <span className={currentTheme.text}>{player.name}</span>
                    <span className={`text-sm px-2 py-1 rounded ${player.status === 'waiting' ? 'bg-yellow-500' : 'bg-gray-500'} text-white`}>
                      {player.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className={`w-full ${currentTheme.accent} text-white py-3 rounded-lg hover:opacity-90 transition-opacity`}
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>Game in Progress</h2>
            <SoloTypingTest />
            <div className="mt-4 text-center">
              <button
                onClick={finishGame}
                className={`${currentTheme.accent} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity`}
              >
                Finish Game
              </button>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div>
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6 text-center`}>Game Results</h2>
            
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div key={index} className={`${currentTheme.bg} p-4 rounded-lg flex justify-between items-center`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'} flex items-center justify-center text-white font-bold mr-3`}>
                      {index + 1}
                    </div>
                    <span className={`font-semibold ${currentTheme.text}`}>{player.name}</span>
                  </div>
                  <div className={`text-sm ${currentTheme.text}`}>
                    {player.wpm} WPM | {player.accuracy}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Learning Mode Component
  const LearningMode = () => {
    const [level, setLevel] = useState(1);
    const [currentText, setCurrentText] = useState('');
    const [progress, setProgress] = useState(0);

    const levels = [
      { name: 'Letters', description: 'Learn individual letters', words: learningLetters },
      { name: 'Basic Words', description: 'Common 3-letter words', words: basicWords.slice(0, 15) },
      { name: 'Intermediate', description: 'Longer common words', words: basicWords },
      { name: 'Advanced', description: 'Complex vocabulary', words: hardWords }
    ];

    useEffect(() => {
      const levelWords = levels[level - 1].words;
      setCurrentText(levelWords.slice(0, 20).join(' '));
    }, [level]);

    const nextLevel = () => {
      if (level < levels.length) {
        setLevel(level + 1);
        setProgress(0);
      }
    };

    const prevLevel = () => {
      if (level > 1) {
        setLevel(level - 1);
        setProgress(0);
      }
    };

    return (
      <div className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-lg p-6`}>
        <div className="flex items-center mb-6">
          <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
          <h2 className={`text-2xl font-bold ${currentTheme.text}`}>Learning Mode</h2>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${currentTheme.text}`}>Level {level}: {levels[level - 1].name}</span>
            <span className={`text-sm ${currentTheme.text}`}>{progress}% Complete</span>
          </div>
          <div className={`w-full ${currentTheme.bg} rounded-full h-2`}>
            <div className={`${currentTheme.accent} h-2 rounded-full transition-all duration-300`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {levels.map((l, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                level === index + 1 ? currentTheme.accent : currentTheme.bg
              }`}
              onClick={() => setLevel(index + 1)}
            >
              <div className={`font-semibold ${level === index + 1 ? 'text-white' : currentTheme.text}`}>
                {l.name}
              </div>
              <div className={`text-sm ${level === index + 1 ? 'text-white' : currentTheme.text} opacity-75`}>
                {l.description}
              </div>
            </div>
          ))}
        </div>

        <div className={`${currentTheme.bg} rounded-lg p-4 mb-4`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-3`}>Practice Text:</h3>
          <div className={`font-mono text-lg ${currentTheme.text} leading-relaxed`}>
            {currentText}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={prevLevel}
            disabled={level === 1}
            className={`px-4 py-2 rounded-lg ${level === 1 ? 'bg-gray-500 cursor-not-allowed' : currentTheme.accent} text-white hover:opacity-90 transition-opacity`}
          >
            Previous Level
          </button>
          <button
            onClick={nextLevel}
            disabled={level === levels.length}
            className={`px-4 py-2 rounded-lg ${level === levels.length ? 'bg-gray-500 cursor-not-allowed' : currentTheme.accent} text-white hover:opacity-90 transition-opacity`}
          >
            Next Level
          </button>
        </div>
      </div>
    );
  };

  // Settings Component
  const SettingsPanel = () => {
    return (
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
  };

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
          {currentMode === 'solo' && <SoloTypingTest />}
          {currentMode === 'multiplayer' && <MultiplayerMode />}
          {currentMode === 'learning' && <LearningMode />}
          {currentMode === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
};

export default TypingTestApp;