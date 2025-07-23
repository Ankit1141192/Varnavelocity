// SoloPractice.jsx
import { useState, useEffect, useRef } from 'react';
import Button from '../components/ui/Button.jsx';

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
  "Debugging is like being the detective in a crime movie where you are also the murderer. Check line 42—it’s usually guilty.",
  "If a train leaves Station A at 80 km/h and another leaves Station B at 100 km/h, when do they meet? Only math will tell.",
  "He typed so fast, his keyboard started showing signs of smoke. 120 WPM is not for the faint-hearted.",
  "The algorithm ran in O(n log n) time, optimizing performance by using a priority queue and a min-heap structure.",
  "Zebras zigzagged through the zoo zone, zealously zapping zany zombies with zero hesitation."
];


export default function SoloPractice() {
  const [selectedTime, setSelectedTime] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const savedResults = localStorage.getItem('typingResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
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
    setTotalChars(0);
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(selectedTime);
    setShowResults(false);
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
    const accuracy = Math.round((correctChars / totalChars) * 100) || 0;

    const newResult = {
      wpm,
      accuracy,
      time: timeElapsed,
      date: new Date().toLocaleDateString()
    };

    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    localStorage.setItem('typingResults', JSON.stringify(updatedResults));
  };

  const handleInputChange = (e) => {
    if (!isActive) return;

    const value = e.target.value;
    setUserInput(value);

    let correct = 0;
    let total = value.length;

    for (let i = 0; i < value.length; i++) {
      if (i < currentText.length && value[i] === currentText[i]) {
        correct++;
      }
    }

    setCorrectChars(correct);
    setTotalChars(total);
    setCurrentIndex(value.length);

    if (value.length === currentText.length) {
      finishTest();
    }
  };

  const getCurrentWPM = () => {
    const timeElapsed = selectedTime - timeLeft;
    if (timeElapsed === 0) return 0;
    return Math.round((correctChars / 5) / (timeElapsed / 60));
  };

  const getCurrentAccuracy = () => {
    if (totalChars === 0) return 100;
    return Math.round((correctChars / totalChars) * 100);
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
        className = 'text-gray-900 bg-blue-200';
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
        <h1 className="text-4xl font-bold text-black-400 mb-2">Welcome to Solo Typing Practice!</h1>
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
            className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {Math.max(...results.map(r => r.wpm))} WPM
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Best Accuracy</h3>
              <div className="text-2xl font-bold text-green-600">
                {Math.max(...results.map(r => r.accuracy))}%
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
                </tr>
              </thead>
              <tbody>
                {results.slice(-10).reverse().map((result, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{result.date}</td>
                    <td className="px-4 py-2 font-semibold text-blue-600">{result.wpm}</td>
                    <td className="px-4 py-2 font-semibold text-green-600">{result.accuracy}%</td>
                    <td className="px-4 py-2">{result.time}s</td>
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
