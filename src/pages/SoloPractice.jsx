import React, { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";

const easyWords = ["cat", "dog", "sun", "fun", "bat", "hat", "run", "big", "red", "car", "book", "tree", "house", "water", "happy", "quick", "jump", "play", "love", "time"];
const hardWords = ["encyclopedia", "juxtaposition", "phenomenon", "metamorphosis", "extraordinary", "magnificent", "sophisticated", "revolutionary", "philosophical", "psychological"];
const commonWords = ["the", "and", "for", "are", "but", "not", "you", "all", "can", "her", "was", "one", "our", "had", "by", "word", "oil", "sit", "set", "run", "eat", "far", "sea", "eye", "ask", "own", "age", "ice", "end", "why", "let", "try", "way", "use", "man", "new", "now", "old", "see", "him", "two", "how", "its", "who", "did", "get", "may", "say", "she", "use", "her", "how", "oil", "sit"];

const SoloPractice = () => {
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeLimit, setTimeLimit] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [typedChars, setTypedChars] = useState([]);
  const [errorPositions, setErrorPositions] = useState(new Set());
  const [totalKeystrokes, setTotalKeystrokes] = useState(0); // Total keys pressed including backspace
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0); // Only correct keys
  const containerRef = useRef(null);

  const generateSentences = () => {
    const sentences = [];
    // Generate more sentences based on time duration
    const sentenceCount = Math.max(8, Math.floor(timeLimit / 60) * 6); // 6 sentences per minute minimum
    
    for (let i = 0; i < sentenceCount; i++) {
      const sentenceLength = Math.floor(Math.random() * 8) + 5; // 5-12 words per sentence
      const sentence = [];

      for (let j = 0; j < sentenceLength; j++) {
        let word;
        const rand = Math.random();
        if (rand < 0.6) {
          word = commonWords[Math.floor(Math.random() * commonWords.length)];
        } else if (rand < 0.9) {
          word = easyWords[Math.floor(Math.random() * easyWords.length)];
        } else {
          word = hardWords[Math.floor(Math.random() * hardWords.length)];
        }
        sentence.push(word);
      }

      sentences.push(sentence.join(" ") + ".");
    }
    return sentences.join(" ");
  };

  useEffect(() => {
    setText(generateSentences());
    setCurrentIndex(0);
    setCorrectChars(0);
    setTotalChars(0);
    setErrors(0);
    setTypedChars([]);
    setErrorPositions(new Set());
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
  }, [timeLimit]);

  useEffect(() => {
    if (isStarted && timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      calculateFinalStats();
    }
  }, [isStarted, timeLeft, isFinished]);

  const calculateFinalStats = () => {
    const timeElapsed = (timeLimit - timeLeft) / 60;
    if (timeElapsed > 0) {
      const wordsTyped = correctChars / 5;
      const finalWpm = Math.round(wordsTyped / timeElapsed);
      // Use overall keystroke accuracy, not current text accuracy
      const finalAccuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

      setWpm(finalWpm);
      setAccuracy(finalAccuracy);
    }
  };

  const scrollToCurrentPosition = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const cursorElement = container.querySelector('.cursor-position');
      
      if (cursorElement) {
        const cursorTop = cursorElement.offsetTop;
        const cursorHeight = cursorElement.offsetHeight;
        
        // Check if cursor is outside visible area
        if (cursorTop < scrollTop + 20 || cursorTop + cursorHeight > scrollTop + containerHeight - 20) {
          // Scroll to keep cursor in middle of visible area
          container.scrollTop = Math.max(0, cursorTop - containerHeight / 2);
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (isFinished) return;

    if (!isStarted) {
      setIsStarted(true);
    }

    const key = e.key;

    // Ignore Enter key and other special keys except Backspace
    if (key === 'Enter' || (key.length !== 1 && key !== 'Backspace')) {
      e.preventDefault();
      return;
    }

    if (key === 'Backspace') {
      if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        const newTypedChars = [...typedChars];
        const newErrorPositions = new Set(errorPositions);

        // Remove the character from tracking
        const removedChar = newTypedChars.pop();

        // If this position had an error, remove it
        if (errorPositions.has(newIndex)) {
          newErrorPositions.delete(newIndex);
          setErrors(prev => prev - 1);
        }

        setCurrentIndex(newIndex);
        setTypedChars(newTypedChars);
        setErrorPositions(newErrorPositions);
        setTotalChars(prev => Math.max(0, prev - 1));

        // Recalculate correct chars based on actual comparison
        const correctCount = newTypedChars.filter((char, idx) => char === text[idx]).length;
        setCorrectChars(correctCount);

        // Update stats with recalculated values - but don't change overall accuracy
        updateStats(correctCount, newTypedChars.length);
        
        // Scroll to maintain cursor visibility
        setTimeout(scrollToCurrentPosition, 0);
      }
      return;
    }

    // Prevent typing beyond the text length
    if (currentIndex >= text.length) return;

    const expectedChar = text[currentIndex];
    const newTypedChars = [...typedChars, key];
    const newErrorPositions = new Set(errorPositions);
    const newTotalChars = totalChars + 1;

    setTypedChars(newTypedChars);
    setCurrentIndex(prev => prev + 1);
    setTotalChars(newTotalChars);
    
    // Count every keystroke for overall accuracy
    setTotalKeystrokes(prev => prev + 1);

    let newCorrectChars = correctChars;

    if (key === expectedChar) {
      newCorrectChars = correctChars + 1;
      setCorrectChars(newCorrectChars);
      setCorrectKeystrokes(prev => prev + 1); // Count correct keystroke
      // Remove error position if it was previously marked as error
      if (errorPositions.has(currentIndex)) {
        newErrorPositions.delete(currentIndex);
        setErrors(prev => prev - 1);
      }
    } else {
      // Mark this position as error if it's not already marked
      if (!errorPositions.has(currentIndex)) {
        newErrorPositions.add(currentIndex);
        setErrors(prev => prev + 1);
      }
      // Don't increment correctKeystrokes for wrong keys
    }

    setErrorPositions(newErrorPositions);

    // Update real-time stats with correct values
    updateStats(newCorrectChars, newTotalChars);
    
    // Scroll to maintain cursor visibility
    setTimeout(scrollToCurrentPosition, 0);
  };

  const updateStats = (correctCount, totalCount) => {
    const timeElapsed = (timeLimit - timeLeft) / 60;
    
    // Calculate WPM based on correct characters only
    if (timeElapsed > 0) {
      const wordsTyped = correctCount / 5; // Standard: 5 characters = 1 word
      const currentWpm = Math.round(wordsTyped / timeElapsed);
      setWpm(currentWpm);
    }
    
    // Calculate accuracy based on OVERALL keystrokes, not current text state
    if (totalKeystrokes > 0) {
      const currentAccuracy = Math.round((correctKeystrokes / totalKeystrokes) * 100);
      setAccuracy(currentAccuracy);
    } else {
      setAccuracy(100);
    }
  };

  const resetTest = () => {
    setText(generateSentences());
    setCurrentIndex(0);
    setIsStarted(false);
    setTimeLeft(timeLimit);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCorrectChars(0);
    setTotalChars(0);
    setTypedChars([]);
    setErrorPositions(new Set());
    setIsFinished(false);
    if (containerRef.current) {
      containerRef.current.focus();
      containerRef.current.scrollTop = 0; // Reset scroll position
    }
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = "text-gray-400";

      if (index < typedChars.length) {
        // Character has been typed
        if (typedChars[index] === char) {
          className = "text-green-700 bg-green-100";
        } else {
          className = "text-white bg-red-500";
        }
      } else if (index === currentIndex) {
        // Current character cursor with special class for scrolling
        className = "cursor-position bg-blue-300 border-l-2 border-blue-600 animate-pulse";
      }

      return (
        <span key={index} className={`${className} ${char === ' ' ? 'mr-1' : ''}`}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  useEffect(() => {
    if (containerRef.current && !isFinished) {
      containerRef.current.focus();
    }
  }, [isFinished]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8 select-none">
      {/* Fixed Header - Always visible */}
      <div className="sticky top-0 bg-white z-10 border-b pb-4 mb-6">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Duration:</label>
            <select
              className="p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={timeLimit / 60}
              onChange={(e) => {
                const minutes = Number(e.target.value);
                setTimeLimit(minutes * 60);
                setTimeLeft(minutes * 60);
                resetTest();
              }}
              disabled={isStarted && !isFinished}
            >
              {[1, 2, 3, 5, 10, 15].map((min) => (
                <option key={min} value={min}>{min} minute{min > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={resetTest}
              className="flex gap-1 px-6 py-2 mt-4 text-white font-semibold rounded-full transition-transform transform hover:scale-105 active:scale-95 bg-gradient-to-r from-black/50 to-black disabled:opacity-50"
            >
              <RefreshCw />{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </button>
            
            {/* Real-time stats */}
            <div className="flex space-x-4 text-sm">
              <div className="text-center">
                <div className="text-lg text-blue-600 font-bold">{wpm}</div>
                <div className="text-xs text-gray-500">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-green-600 font-bold">{accuracy}%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-red-600 font-bold">{errors}</div>
                <div className="text-xs text-gray-500">Errors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFinished ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Test Complete!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Typing Speed</div>
              <div className="text-3xl font-bold text-blue-800">{wpm}</div>
              <div className="text-xs text-blue-500">Words Per Minute</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="text-sm text-green-600 font-medium">Accuracy</div>
              <div className="text-3xl font-bold text-green-800">{accuracy}%</div>
              <div className="text-xs text-green-500">Correct Characters</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <div className="text-sm text-red-600 font-medium">Errors</div>
              <div className="text-3xl font-bold text-red-800">{errors}</div>
              <div className="text-xs text-red-500">Incorrect Keystrokes</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">Characters</div>
              <div className="text-3xl font-bold text-purple-800">{correctChars}/{totalChars}</div>
              <div className="text-xs text-purple-500">Correct/Total</div>
            </div>
          </div>
          <button
            onClick={resetTest}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-lg"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            className="bg-gray-50 p-6 rounded-lg font-mono text-lg leading-relaxed mb-6 min-h-[400px] max-h-[400px] overflow-y-auto border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
            tabIndex={0}
            onKeyDown={handleKeyPress}
            style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
          >
            {renderText()}
          </div>

          <div className="text-center text-gray-600">
            <p className="text-sm">
              {isStarted
                ? "Keep typing! Use Backspace to correct mistakes. Wrong letters are highlighted in red."
                : "Click on the text area above and start typing to begin the test."
              }
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Characters typed: {typedChars.length} | Progress: {Math.round((currentIndex / text.length) * 100)}% | Overall Accuracy: {totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100}% ({correctKeystrokes}/{totalKeystrokes} keystrokes)
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SoloPractice;