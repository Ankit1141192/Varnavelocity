import { useState, useEffect, useRef } from 'react';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
  "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
  "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys' house.",
  "On 17th April 2023, exactly 12 people attended the conference on 'AI & the Future'. The presentation began at 09:30 AM sharp.",
  "Typing 5,000 words a day requires discipline, practice, and a structured routine—it's not just about speed, but also about accuracy.",
  "The spaceship launched at 3:14 PM, traveling at 28,000 km/h, orbiting Earth in precisely 92.5 minutes.",
  "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.",
  "Debugging is like being the detective in a crime movie where you are also the murderer. Check line 42—it's usually guilty.",
  "If a train leaves Station A at 80 km/h and another leaves Station B at 100 km/h, when do they meet? Only math will tell.",
  "He typed so fast, his keyboard started showing signs of smoke. 120 WPM is not for the faint-hearted.",
  "The algorithm ran in O(n log n) time, optimizing performance by using a priority queue and a min-heap structure.",
  "Zebras zigzagged through the zoo zone, zealously zapping zany zombies with zero hesitation."
];

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default function SoloPractice() {
  const [selectedTime, setSelectedTime] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0); // Total characters ever typed (including mistakes)
  const [mistakeCount, setMistakeCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorPosition, setErrorPosition] = useState(-1);

  const inputRef = useRef(null);

  useEffect(() => {
    // Note: localStorage is not available in Claude artifacts, using in-memory storage
    resetTest();
  }, []);

  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            finishTest();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const resetTest = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setCurrentText(randomText);
    setUserInput('');
    setCurrentIndex(0);
    setCorrectChars(0);
    setTotalCharsTyped(0);
    setMistakeCount(0);
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(selectedTime);
    setShowResults(false);
    setHasError(false);
    setErrorPosition(-1);
  };

  const startTest = () => {
    setIsActive(true);
    inputRef.current?.focus();
  };

  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);

    const timeElapsed = selectedTime - timeLeft;
    const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
    const accuracy = totalCharsTyped > 0 ? Math.round(((totalCharsTyped - mistakeCount) / totalCharsTyped) * 100) : 100;

    const newResult = {
      wpm,
      accuracy,
      time: timeElapsed,
      date: new Date().toLocaleDateString(),
      mistakes: mistakeCount
    };

    const updatedResults = [...results, newResult];
    setResults(updatedResults);
  };

  const findWordBoundaries = (text, position) => {
    // Find the start of current word
    let wordStart = position;
    while (wordStart > 0 && text[wordStart - 1] !== ' ') {
      wordStart--;
    }
    
    // Find the end of current word
    let wordEnd = position;
    while (wordEnd < text.length && text[wordEnd] !== ' ') {
      wordEnd++;
    }
    
    return { wordStart, wordEnd };
  };

  const handleInputChange = (e) => {
    if (!isActive) return;

    const value = e.target.value;
    const previousLength = userInput.length;
    const currentLength = value.length;
    
    // Handle backspace
    if (currentLength < previousLength) {
      setUserInput(value);
      setCurrentIndex(value.length);
      
      // If we're backspacing from an error, check if we can continue
      if (hasError) {
        // Check if we're still in error state
        let stillHasError = false;
        let wrongCount = 0;
        let firstErrorPos = -1;
        
        for (let i = 0; i < value.length; i++) {
          if (i < currentText.length && value[i] !== currentText[i]) {
            if (firstErrorPos === -1) firstErrorPos = i;
            wrongCount++;
            stillHasError = true;
          } else if (stillHasError) {
            // If we hit a correct character after errors, reset wrong count
            wrongCount = 0;
          }
        }
        
        if (!stillHasError || wrongCount === 0) {
          setHasError(false);
          setErrorPosition(-1);
        }
      }
      return;
    }

    // If there's an error and user is trying to type forward, check if we should allow it
    if (hasError && currentLength > previousLength) {
      // Count consecutive wrong characters from the first error position
      let wrongCount = 0;
      let firstErrorInWord = -1;
      
      // Find the first error in current word
      const { wordStart } = findWordBoundaries(currentText, errorPosition);
      
      for (let i = wordStart; i < value.length && i < currentText.length; i++) {
        if (value[i] !== currentText[i]) {
          if (firstErrorInWord === -1) firstErrorInWord = i;
          wrongCount++;
        } else if (firstErrorInWord !== -1) {
          // Hit a correct character after errors, stop counting
          break;
        }
      }
      
      // If we already have 3 wrong characters in this word, don't allow more typing
      if (wrongCount >= 3) {
        return; // Stop typing, but keep the wrong characters visible
      }
    }

    setUserInput(value);

    // Count total characters typed (including this new character)
    if (currentLength > previousLength) {
      setTotalCharsTyped(prev => prev + 1);
    }

    let correct = 0;
    let mistakes = mistakeCount;
    let hasNewError = false;
    let newErrorPos = -1;

    // Check each character
    for (let i = 0; i < value.length; i++) {
      if (i < currentText.length && value[i] === currentText[i]) {
        correct++;
      } else if (i < currentText.length) {
        // This is a mistake
        if (i >= previousLength) {
          // This is a new mistake
          mistakes++;
          if (!hasNewError) {
            hasNewError = true;
            newErrorPos = i;
          }
        }
      }
    }

    // Set error state if we have new errors
    if (hasNewError) {
      setHasError(true);
      if (errorPosition === -1) setErrorPosition(newErrorPos);
    }

    setCorrectChars(correct);
    setMistakeCount(mistakes);
    setCurrentIndex(value.length);

    // Check if text is completed
    if (value.length === currentText.length && value === currentText) {
      finishTest();
    }
  };

  const getCurrentWPM = () => {
    const timeElapsed = selectedTime - timeLeft;
    if (timeElapsed === 0) return 0;
    return Math.round((correctChars / 5) / (timeElapsed / 60));
  };

  const getCurrentAccuracy = () => {
    if (totalCharsTyped === 0) return 100;
    return Math.round(((totalCharsTyped - mistakeCount) / totalCharsTyped) * 100);
  };

  const getAverageStats = () => {
    if (results.length === 0) return { avgWPM: 0, avgAccuracy: 0 };

    const avgWPM = Math.round(results.reduce((sum, result) => sum + result.wpm, 0) / results.length);
    const avgAccuracy = Math.round(results.reduce((sum, result) => sum + result.accuracy, 0) / results.length);

    return { avgWPM, avgAccuracy };
  };

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = 'text-gray-400';

      if (index < currentIndex) {
        className = userInput[index] === char ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
      } else if (index === currentIndex) {
        className = 'text-gray-900 bg-blue-200 animate-pulse';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const { avgWPM, avgAccuracy } = getAverageStats();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Test Controls */}
      <div className="max-w-4xl mx-auto text-center mb-8 mt-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Solo Typing Practice!</h1>
        <p className="text-gray-600 text-lg">
          Improve your typing speed and accuracy with custom text passages. Choose your time limit and start typing!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Time:</label>
            <select
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(Number(e.target.value));
                setTimeLeft(Number(e.target.value));
              }}
              disabled={isActive}
              className="border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{timeLeft}s</div>
              <div className="text-sm text-gray-600">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getCurrentWPM()}</div>
              <div className="text-sm text-gray-600">WPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{getCurrentAccuracy()}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{mistakeCount}</div>
              <div className="text-sm text-gray-600">Mistakes</div>
            </div>
          </div>
        </div>

        {/* Typing Box */}
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-6 mb-4 text-lg leading-relaxed font-mono">
            {renderText()}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={!isActive || isFinished}
            placeholder={isActive ? "Start typing..." : "Click Start to begin"}
            className={`w-full p-4 border rounded-lg text-lg focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
              hasError 
                ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          
          {hasError && (
            <div className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-2">⚠️</span>
              You have made mistakes. Fix them by backspacing check again.
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          {!isActive && !isFinished && (
            <Button onClick={startTest} size="lg">Start Test</Button>
          )}
          {(isActive || isFinished) && (
            <Button onClick={resetTest} variant="outline" size="lg">Reset</Button>
          )}
          {results.length > 0 && (
            <Button onClick={() => setShowResults(!showResults)} variant="secondary" size="lg">
              {showResults ? 'Hide Results' : 'Show Results'}
            </Button>
          )}
        </div>
      </div>

      {/* Results after completion */}
      {isFinished && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Complete!</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{getCurrentWPM()}</div>
              <div className="text-gray-600">Words Per Minute</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{getCurrentAccuracy()}%</div>
              <div className="text-gray-600">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{selectedTime - timeLeft}s</div>
              <div className="text-gray-600">Time Taken</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{mistakeCount}</div>
              <div className="text-gray-600">Total Mistakes</div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Results */}
      {showResults && results.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Performance</h2>
            <div className="text-sm text-gray-600">
              Average: {avgWPM} WPM | {avgAccuracy}% Accuracy
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Personal Best</h3>
              <div className="text-2xl font-bold text-blue-600">
                {results.length > 0 ? Math.max(...results.map(r => r.wpm)) : 0} WPM
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Best Accuracy</h3>
              <div className="text-2xl font-bold text-green-600">
                {results.length > 0 ? Math.max(...results.map(r => r.accuracy)) : 0}%
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">WPM</th>
                  <th className="px-4 py-2 text-left">Accuracy</th>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Mistakes</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(-10).reverse().map((result, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{result.date}</td>
                    <td className="px-4 py-2 font-semibold text-blue-600">{result.wpm}</td>
                    <td className="px-4 py-2 font-semibold text-green-600">{result.accuracy}%</td>
                    <td className="px-4 py-2">{result.time}s</td>
                    <td className="px-4 py-2 font-semibold text-red-600">{result.mistakes || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}