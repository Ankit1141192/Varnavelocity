import React, { useState, useEffect, useRef } from "react";

// example data
const easyWords = ["cat", "dog", "sun", "fun", "bat", "hat", "run"];
const hardWords = ["encyclopedia", "juxtaposition", "phenomenon", "metamorphosis"];

const timeLimit = 60; // seconds

const SoloPractice = () => {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
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
        mixedWords.push(
          hardWords[Math.floor(Math.random() * hardWords.length)]
        );
      } else {
        mixedWords.push(
          easyWords[Math.floor(Math.random() * easyWords.length)]
        );
      }
    }
    return mixedWords.join(" ");
  };

  useEffect(() => {
    setText(generateText());
  }, []);

  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
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

    const timeElapsed = timeLimit - timeLeft;

    const wordsTyped = value.trim().split(/\s+/).length;
    const wpmCalc =
      timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
    setWpm(wpmCalc);

    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    // Also count remaining untyped characters in `text` if input is shorter
    incorrectChars += Math.max(0, text.length - value.length);

    const totalTyped = value.length;

    const accuracyCalc =
      totalTyped > 0
        ? Math.max(0, Math.round((correctChars / (correctChars + incorrectChars)) * 100))
        : 100;

    setAccuracy(accuracyCalc);
    setErrors(incorrectChars);
    setCurrentIndex(value.length);
  };

  const resetTest = () => {
    setText(generateText());
    setInput("");
    setCurrentIndex(0);
    setIsStarted(false);
    setTimeLeft(timeLimit);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setIsFinished(false);
    inputRef.current?.focus();
  };

  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = "text-gray-400";

      if (index < input.length) {
        className =
          input[index] === char
            ? "text-green-400"
            : "text-red-400 bg-red-200";
      } else if (index === currentIndex) {
        className = "bg-blue-500 text-white";
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
      <div className="bg-white border rounded-lg p-6 shadow">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Test Complete!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm text-blue-500">Speed</div>
              <div className="text-2xl font-bold">{wpm} WPM</div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm text-green-500">Accuracy</div>
              <div className="text-2xl font-bold">{accuracy}%</div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm text-red-500">Errors</div>
              <div className="text-2xl font-bold">{errors}</div>
            </div>
          </div>

          <button
            onClick={resetTest}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-gray-800 font-mono text-lg">
            ⏳ {timeLeft}s
          </div>
          <div className="text-sm text-gray-600">
            {wpm} WPM | {accuracy}% Accuracy
          </div>
        </div>
        <button
          onClick={resetTest}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Reset
        </button>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 mb-4 font-mono text-lg leading-relaxed">
        {renderText()}
      </div>

      <textarea
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        placeholder="Start typing here..."
        className="w-full h-24 p-3 bg-gray-50 text-gray-800 border rounded-lg font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isFinished}
      />
    </div>
  );
};

export default SoloPractice;
