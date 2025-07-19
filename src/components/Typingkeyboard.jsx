import React, { useState, useEffect } from "react";

const keyboardKeys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const textToType = "HELLO WORLD";

export default function TypingKeyboard() {
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharIndex((prev) => (prev + 1) % textToType.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const currentChar = textToType[currentCharIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Typing Keyboard Animation</h1>

      {/* Display text */}
      <div className="text-lg mb-4 tracking-wider">
        {textToType.split("").map((char, index) => (
          <span
            key={index}
            className={`${
              index === currentCharIndex ? "text-yellow-400" : "text-white"
            }`}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Hands */}
      <div className="text-4xl mb-4 animate-bounce">👐</div>

      {/* Keyboard */}
      <div className="space-y-2">
        {keyboardKeys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-1">
            {row.map((key) => (
              <div
                key={key}
                className={`w-10 h-12 flex items-center justify-center border rounded-md bg-gray-700 text-white transition-all duration-200 ${
                  key === currentChar ? "bg-yellow-400 text-black scale-110" : ""
                }`}
              >
                {key}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Removed duplicate default export