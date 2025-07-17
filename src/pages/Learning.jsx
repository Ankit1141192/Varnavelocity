import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

// Example word sets
const learningLetters = ["a", "b", "c", "d", "e", "f", "g"];
const basicWords = ["cat", "dog", "hat", "bat", "man", "sun", "pen", "fun", "run", "top", "cup", "map", "bag", "box", "fan"];
const hardWords = [
  "complexity", "vocabulary", "extravagant", "benevolent", "hypothesis", "astronomy", "metaphor", "philosophy"
];

// Example theme (you can replace this with context or props if needed)
const currentTheme = {
  cardBg: "bg-white",
  border: "border-gray-300",
  text: "text-gray-800",
  accent: "bg-indigo-600",
  bg: "bg-gray-100"
};

const Learning = () => {
  const [level, setLevel] = useState(1);
  const [currentText, setCurrentText] = useState("");
  const [progress, setProgress] = useState(0);

  const levels = [
    { name: "Letters", description: "Learn individual letters", words: learningLetters },
    { name: "Basic Words", description: "Common 3-letter words", words: basicWords.slice(0, 15) },
    { name: "Intermediate", description: "Longer common words", words: basicWords },
    { name: "Advanced", description: "Complex vocabulary", words: hardWords }
  ];

  useEffect(() => {
    const levelWords = levels[level - 1].words;
    setCurrentText(levelWords.slice(0, 20).join(" "));
    setProgress(0);
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
    <div className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-lg p-6 m-6`}>
      <div className="flex items-center mb-6">
        <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
        <h2 className={`text-2xl font-bold ${currentTheme.text}`}>Learning Mode</h2>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm ${currentTheme.text}`}>
            Level {level}: {levels[level - 1].name}
          </span>
          <span className={`text-sm ${currentTheme.text}`}>{progress}% Complete</span>
        </div>
        <div className={`w-full ${currentTheme.bg} rounded-full h-2`}>
          <div
            className={`${currentTheme.accent} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          ></div>
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
            <div
              className={`font-semibold ${
                level === index + 1 ? "text-white" : currentTheme.text
              }`}
            >
              {l.name}
            </div>
            <div
              className={`text-sm ${
                level === index + 1 ? "text-white" : currentTheme.text
              } opacity-75`}
            >
              {l.description}
            </div>
          </div>
        ))}
      </div>

      <div className={`${currentTheme.bg} rounded-lg p-4 mb-4`}>
        <h3 className={`text-lg font-semibold ${currentTheme.text} mb-3`}>
          Practice Text:
        </h3>
        <div
          className={`font-mono text-lg ${currentTheme.text} leading-relaxed`}
        >
          {currentText}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevLevel}
          disabled={level === 1}
          className={`px-4 py-2 rounded-lg ${
            level === 1
              ? "bg-gray-500 cursor-not-allowed"
              : currentTheme.accent
          } text-white hover:opacity-90 transition-opacity`}
        >
          Previous Level
        </button>
        <button
          onClick={nextLevel}
          disabled={level === levels.length}
          className={`px-4 py-2 rounded-lg ${
            level === levels.length
              ? "bg-gray-500 cursor-not-allowed"
              : currentTheme.accent
          } text-white hover:opacity-90 transition-opacity`}
        >
          Next Level
        </button>
      </div>
    </div>
  );
};

export default Learning;
