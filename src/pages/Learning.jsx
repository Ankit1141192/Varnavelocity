import React, { useState, useEffect } from "react";
import Testimonial from "./Testimonial";

const Learning = ({ theme }) => {
  const learningLetters = ["a", "b", "c", "d", "e", "f", "g"];
  const basicWords = ["cat", "dog", "hat", "bat", "man", "sun", "pen", "fun", "run", "top", "cup", "map", "bag", "box", "fan"];
  const hardWords = ["complexity", "vocabulary", "extravagant", "benevolent", "hypothesis", "astronomy", "metaphor", "philosophy"];

  const levels = [
    { name: "Letters", description: "Learn individual letters", words: learningLetters },
    { name: "Basic Words", description: "Common 3-letter words", words: basicWords.slice(0, 15) },
    { name: "Intermediate", description: "Longer common words", words: basicWords },
    { name: "Advanced", description: "Complex vocabulary", words: hardWords }
  ];

  const [level, setLevel] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const words = levels[level].words;
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
      if (e.key === " " || e.code === "Space") e.preventDefault();
      if (!startTime) setStartTime(Date.now());
      if (isCompleted) return;

      if (e.key.length === 1 && /^[a-zA-Z']$/.test(e.key)) {
        setTyped((prev) => prev + e.key);
      } else if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
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

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const wordBoxColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const progressBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300';

  return (
    <>
      <div className={`max-w-2xl mx-auto p-6 ${bgColor} rounded shadow mt-8 select-none ${textColor}`}>
        <h2 className="text-2xl font-bold mb-2">Learning Mode - {levels[level].name}</h2>
        <p className={`mb-4 text-sm ${subTextColor}`}>{levels[level].description}</p>

        {/* Word Display */}
        <div className={`relative ${wordBoxColor} p-4 rounded text-lg font-mono min-h-[80px] max-h-40 overflow-y-auto`}>
          <div className="flex flex-wrap gap-2">
            {words.map((word, i) => (
              <span
                key={i}
                className={`${
                  i === wordIndex ? 'text-yellow-400 font-bold' :
                  i < wordIndex ? 'text-green-400' :
                  subTextColor
                }`}
              >
                {word}
              </span>
            ))}
          </div>
          <div className={`absolute bottom-1 right-2 text-xs ${subTextColor}`}>Type anywhere</div>
        </div>

        {/* Progress */}
        <div className={`w-full h-2 ${progressBg} rounded-full overflow-hidden mt-4`}>
          <div
            className="h-full bg-indigo-500 transition-all"
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>

        {/* Completion */}
        {isCompleted && (
          <div className="text-center mt-6">
            <h3 className="text-xl font-semibold mb-2">Completed!</h3>
            <p>Accuracy: <span className="text-blue-400">{getAccuracy()}%</span></p>
            <p>WPM: <span className="text-green-400">{getWPM()}</span></p>
            <button
              onClick={() => setLevel((prev) => Math.min(prev + 1, levels.length - 1))}
              disabled={level === levels.length - 1}
              className="relative inline-block px-6 py-2 mt-4 text-white font-semibold rounded-full transition-transform transform hover:scale-105 active:scale-95 bg-gradient-to-r from-black/50 to-black disabled:opacity-50"
            >
              <span className="relative z-10">Next Level</span>
              <span className="absolute inset-0 bg-white opacity-10 rounded-full blur-sm"></span>
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <div className="relative group overflow-hidden bg-white/20 p-0.5 h-9 w-24 rounded-full active:scale-100 hover:scale-105 transition-all duration-300">
            <button
              onClick={() => setLevel((prev) => Math.max(0, prev - 1))}
              disabled={level === 0}
              className={`text-white text-sm h-full w-full rounded-full bg-gradient-to-t from-black/50 to-black ${
                level === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
          </div>
          <div className="relative group overflow-hidden bg-white/20 p-0.5 h-9 w-24 rounded-full active:scale-100 hover:scale-105 transition-all duration-300">
            <button
              onClick={() => setLevel((prev) => Math.min(prev + 1, levels.length - 1))}
              disabled={level === levels.length - 1}
              className={`text-white text-sm h-full w-full rounded-full bg-gradient-to-t from-black/50 to-black ${
                level === levels.length - 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Testimonial />
      </div>
    </>
  );
};

export default Learning;
