import React, { useState, useEffect } from "react";

const Learning = () => {
  const learningLetters = ["a", "b", "c", "d", "e", "f", "g"];
  const basicWords = ["cat", "dog", "hat", "bat", "man", "sun", "pen", "fun", "run", "top", "cup", "map", "bag", "box", "fan"];
  const hardWords = [
    "complexity", "vocabulary", "extravagant", "benevolent", "hypothesis", "astronomy", "metaphor", "philosophy"
  ];

  const levels = [
    { name: "Letters", description: "Learn individual letters", words: learningLetters },
    { name: "Basic Words", description: "Common 3-letter words", words: basicWords.slice(0, 15) },
    { name: "Intermediate", description: "Longer common words", words: basicWords },
    { name: "Advanced", description: "Complex vocabulary", words: hardWords }
  ];

  const [level, setLevel] = useState(1);
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const words = levels[level - 1].words;
  const currentWord = words[wordIndex];

  useEffect(() => {
    setWordIndex(0);
    setTyped("");
    setErrors(0);
    setStartTime(null);
    setEndTime(null);
    setIsCompleted(false);
  }, [level]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!startTime) setStartTime(Date.now());
      if (isCompleted) return;

      if (e.key.length === 1 && /^[a-zA-Z']$/.test(e.key)) {
        setTyped(prev => prev + e.key);
      } else if (e.key === "Backspace") {
        setTyped(prev => prev.slice(0, -1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCompleted, startTime]);

  useEffect(() => {
    if (typed === currentWord) {
      if (wordIndex + 1 === words.length) {
        setIsCompleted(true);
        setEndTime(Date.now());
      } else {
        setWordIndex((prev) => prev + 1);
        setTyped("");
      }
    } else if (!currentWord.startsWith(typed)) {
      setErrors((prev) => prev + 1);
      setTyped("");
    }
  }, [typed]);

  const getAccuracy = () => {
    const total = wordIndex + errors;
    return total === 0 ? 100 : Math.round((wordIndex / total) * 100);
  };

  const getWPM = () => {
    if (!startTime || !endTime) return 0;
    const minutes = (endTime - startTime) / 60000;
    return Math.round(wordIndex / minutes);
  };

  const getProgress = () => Math.round((wordIndex / words.length) * 100);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8 select-none">
      <h2 className="text-2xl font-bold mb-4">Learning Mode - {levels[level - 1].name}</h2>
      <div className="mb-2 text-sm text-gray-600">{levels[level - 1].description}</div>

      <div className="relative bg-gray-100 p-4 rounded text-lg font-mono min-h-[80px]">
        {words.map((word, i) => (
          <span
            key={i}
            className={`mr-2 ${
              i === wordIndex ? "text-yellow-600 font-bold" :
              i < wordIndex ? "text-green-600" : "text-gray-500"
            }`}
          >
            {word}
          </span>
        ))}
        <div className="absolute bottom-1 right-2 text-xs text-gray-400">Type anywhere</div>
      </div>

      <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-indigo-500 transition-all"
          style={{ width: `${getProgress()}%` }}
        ></div>
      </div>

      {isCompleted && (
        <div className="text-center mt-6">
          <h3 className="text-xl font-semibold mb-2">Completed!</h3>
          <p className="text-md mb-1">Accuracy: <span className="text-blue-600">{getAccuracy()}%</span></p>
          <p className="text-md mb-3">WPM: <span className="text-green-600">{getWPM()}</span></p>
          <button
            onClick={() => setLevel((prev) => Math.min(prev + 1, levels.length))}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Next Level
          </button>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setLevel((prev) => Math.max(1, prev - 1))}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={() => setLevel((prev) => Math.min(prev + 1, levels.length))}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Learning;