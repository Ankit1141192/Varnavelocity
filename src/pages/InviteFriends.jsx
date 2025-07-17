import React, { useState } from "react";
import { Users, Send, Copy, Trophy } from "lucide-react";

// Optional: replace this with your own solo test component
const SoloTypingTest = () => (
  <div className="p-4 bg-gray-100 rounded text-center">
    <p>Typing test is in progress...</p>
  </div>
);

// Example theme
const currentTheme = {
  cardBg: "bg-white",
  border: "border-gray-300",
  text: "text-gray-800",
  accent: "bg-indigo-600",
  bg: "bg-gray-100",
};

const InviteFriends = () => {
  const [gameState, setGameState] = useState("setup"); // setup, waiting, playing, finished
  const [email, setEmail] = useState("");
  const [gameLink, setGameLink] = useState("");
  const [players, setPlayers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const createGame = () => {
    const link = `https://yourgameurl.com/game/${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setGameLink(link);
    setGameState("waiting");
    setPlayers([{ name: "You", wpm: 0, accuracy: 0, status: "waiting" }]);
  };

  const invitePlayer = () => {
    if (email) {
      setPlayers((prev) => [
        ...prev,
        { name: email, wpm: 0, accuracy: 0, status: "invited" },
      ]);
      setEmail("");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(gameLink);
  };

  const startGame = () => {
    setGameState("playing");
    setPlayers((prev) =>
      prev.map((p) => ({ ...p, status: "playing" }))
    );
  };

  const finishGame = () => {
    setGameState("finished");
    const finalResults = players
      .map((p) => ({
        ...p,
        wpm: Math.floor(Math.random() * 60) + 20,
        accuracy: Math.floor(Math.random() * 20) + 80,
      }))
      .sort((a, b) => b.wpm - a.wpm);
    setLeaderboard(finalResults);
  };

  return (
    <div
      className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-lg p-6 m-6`}
    >
      {gameState === "setup" && (
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>
            Create Multiplayer Game
          </h2>
          <button
            onClick={createGame}
            className={`${currentTheme.accent} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity`}
          >
            Create Game Room
          </button>
        </div>
      )}

      {gameState === "waiting" && (
        <div>
          <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>
            Invite Players
          </h2>

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
            <h3
              className={`text-lg font-semibold ${currentTheme.text} mb-3`}
            >
              Players ({players.length})
            </h3>
            <div className="space-y-2">
              {players.map((player, index) => (
                <div
                  key={index}
                  className={`${currentTheme.bg} p-3 rounded-lg flex justify-between items-center`}
                >
                  <span className={currentTheme.text}>{player.name}</span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      player.status === "waiting"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    } text-white`}
                  >
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

      {gameState === "playing" && (
        <div>
          <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>
            Game in Progress
          </h2>
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

      {gameState === "finished" && (
        <div>
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2
            className={`text-2xl font-bold ${currentTheme.text} mb-6 text-center`}
          >
            Game Results
          </h2>

          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <div
                key={index}
                className={`${currentTheme.bg} p-4 rounded-lg flex justify-between items-center`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : "bg-orange-500"
                    } flex items-center justify-center text-white font-bold mr-3`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`font-semibold ${currentTheme.text}`}
                  >
                    {player.name}
                  </span>
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

export default InviteFriends;
