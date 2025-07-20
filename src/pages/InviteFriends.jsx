import React, { useEffect, useState } from "react";

// Mock Firebase functions for demo (replace with actual Firebase imports)
const mockDb = {};
const mockUsers = {};

function InviteFriends({ theme = "light" }) {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [userId] = useState(() => crypto.randomUUID());
  const [isCreator, setIsCreator] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Random words for typing test
  const wordBank = [
    "ability", "about", "above", "accept", "according", "account", "across", "action", "activity", "actually",
    "address", "administration", "admit", "adult", "affect", "after", "again", "against", "agency", "agent",
    "agree", "agreement", "ahead", "allow", "almost", "alone", "along", "already", "although", "always",
    "among", "amount", "analysis", "animal", "another", "answer", "anyone", "anything", "appear", "apply",
    "approach", "area", "argue", "around", "arrive", "article", "artist", "assume", "attack", "attention",
    "attorney", "audience", "author", "authority", "available", "avoid", "away", "baby", "back", "bad",
    "bag", "ball", "bank", "bar", "base", "beat", "beautiful", "because", "become", "bed", "before",
    "begin", "behavior", "behind", "believe", "benefit", "best", "better", "between", "beyond", "big",
    "bill", "billion", "bit", "black", "blood", "blue", "board", "body", "book", "born", "both",
    "box", "boy", "break", "bring", "brother", "budget", "build", "building", "business", "buy",
    "call", "camera", "campaign", "can", "cancer", "candidate", "capital", "car", "card", "care",
    "career", "carry", "case", "catch", "cause", "cell", "center", "central", "century", "certain"
  ];

  const generateRandomText = () => {
    const numWords = 15 + Math.floor(Math.random() * 10); // 15-25 words
    const shuffled = [...wordBank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, numWords).join(" ");
  };

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8).toLowerCase();
    setRoomId(id);
    setIsCreator(true);
    // Initialize room in mock storage
    mockDb[id] = { users: {}, gameStarted: false };
  };

  const handleJoin = async () => {
    if (!userName.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!roomId.trim()) {
      alert("Please enter a room ID.");
      return;
    }

    try {
      // Initialize room if it doesn't exist
      if (!mockDb[roomId]) {
        mockDb[roomId] = { users: {}, gameStarted: false };
      }

      // Add user to room
      mockDb[roomId].users[userId] = { 
        userName: userName.trim(), 
        speed: 0, 
        accuracy: 100,
        finished: false 
      };

      setJoined(true);
      updateUsers();
    } catch (error) {
      alert("Error joining room. Please check the room ID.");
    }
  };

  const updateUsers = () => {
    if (mockDb[roomId] && mockDb[roomId].users) {
      const userList = Object.entries(mockDb[roomId].users).map(([id, user]) => ({
        id,
        ...user,
      }));
      setUsers(userList);
      
      const roomData = mockDb[roomId];
      setGameStarted(roomData.gameStarted || false);
      
      // Sync game text for all users
      if (roomData.gameText && roomData.gameText !== currentText) {
        setCurrentText(roomData.gameText);
      }
    }
  };

  const startGame = () => {
    const randomText = generateRandomText();
    setCurrentText(randomText);
    
    if (mockDb[roomId]) {
      mockDb[roomId].gameStarted = true;
      mockDb[roomId].gameText = randomText;
      // Reset all users for new game
      Object.keys(mockDb[roomId].users).forEach(uid => {
        mockDb[roomId].users[uid].speed = 0;
        mockDb[roomId].users[uid].accuracy = 100;
        mockDb[roomId].users[uid].finished = false;
      });
      setGameStarted(true);
      setStartTime(null);
      setTypedText("");
      setIsTyping(false);
      setShowLeaderboard(false);
      updateUsers();
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setTypedText(value);

    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setStartTime(Date.now());
    }

    if (isTyping && startTime) {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - startTime) / 1000 / 60; // minutes
      const wordsTyped = value.trim().split(' ').length;
      const currentSpeed = Math.round(wordsTyped / timeElapsed) || 0;
      
      // Calculate accuracy
      let correctChars = 0;
      for (let i = 0; i < Math.min(value.length, currentText.length); i++) {
        if (value[i] === currentText[i]) {
          correctChars++;
        }
      }
      const accuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;

      setSpeed(currentSpeed);

      // Update user data
      if (mockDb[roomId] && mockDb[roomId].users[userId]) {
        mockDb[roomId].users[userId].speed = currentSpeed;
        mockDb[roomId].users[userId].accuracy = accuracy;
        updateUsers();
      }
    }

    // Check if user finished typing
    if (value === currentText) {
      finishTyping();
    }
  };

  const finishTyping = () => {
    if (mockDb[roomId] && mockDb[roomId].users[userId]) {
      mockDb[roomId].users[userId].finished = true;
      updateUsers();
      
      // Check if all users finished
      const allUsers = Object.values(mockDb[roomId].users);
      const finishedUsers = allUsers.filter(user => user.finished);
      
      if (finishedUsers.length === allUsers.length) {
        setShowLeaderboard(true);
      }
    }
  };

  const endGame = () => {
    setShowLeaderboard(true);
  };

  // Simulate real-time updates
  useEffect(() => {
    if (!roomId || !joined) return;

    const interval = setInterval(updateUsers, 1000);
    return () => clearInterval(interval);
  }, [roomId, joined]);

  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {!joined ? (
        <div
          className={`max-w-md mx-auto p-6 shadow-lg rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h1 className="text-2xl font-bold text-center mb-6">Typing Speed Challenge</h1>
          
          {!roomId && (
            <button
              onClick={createRoom}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-lg mb-4 font-semibold transition-colors"
            >
              Create New Game Room
            </button>
          )}
          
          <div className="space-y-3">
            <input
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toLowerCase())}
              className="w-full p-3 border-2 rounded-lg text-black focus:border-blue-500 focus:outline-none"
            />
            <input
              placeholder="Enter Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 border-2 rounded-lg text-black focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-semibold transition-colors"
              onClick={handleJoin}
            >
              Join Room
            </button>
          </div>

          {roomId && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium mb-2">Share this Room ID:</p>
              <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-600 rounded-lg p-2 mb-3">
                <code className="text-black dark:text-white font-bold text-lg">
                  {roomId}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(roomId)}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                  title="Copy Room ID"
                >
                  Copy
                </button>
              </div>
              
              <p className="text-sm font-medium mb-2">Or share this link:</p>
              <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-600 rounded-lg p-2">
                <code className="text-black dark:text-white text-xs break-all mr-2">
                  https://varnavelocity.vercel.app/collaborations/{roomId}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`https://varnavelocity.vercel.app/collaborations/${roomId}`)}
                  className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors whitespace-nowrap"
                  title="Copy Link"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Room: {roomId}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {gameStarted ? (showLeaderboard ? "Game Complete!" : "Game in Progress") : "Waiting to start..."}
            </p>
          </div>

          {/* Users Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-4 rounded-lg shadow-md text-center border-2 ${
                  user.finished ? "border-green-500" : "border-transparent"
                } ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
              >
                <p className="font-bold text-lg">{user.userName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Speed: <span className="font-semibold text-blue-600">{user.speed || 0}</span> WPM
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Accuracy: <span className="font-semibold text-green-600">{user.accuracy || 100}</span>%
                </p>
                {user.finished && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Finished!
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Game Controls */}
          {!gameStarted && isCreator && users.length > 0 && (
            <div className="text-center">
              <button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Start Typing Challenge
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This will generate random words for everyone to type
              </p>
            </div>
          )}

          {!gameStarted && !isCreator && users.length > 0 && (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Waiting for <strong>{users.find(u => u.id !== userId)?.userName || "room creator"}</strong> to start the game...
              </p>
            </div>
          )}

          {/* Typing Area - Available for ALL players once game starts */}
          {gameStarted && !showLeaderboard && currentText && (
            <div className="mt-8">
              <div className={`p-6 rounded-lg shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">Type the following words:</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Everyone is typing the same text - let's see who's fastest! 🏃‍♂️💨
                  </p>
                </div>
                
                {/* Reference Text */}
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-lg leading-relaxed font-mono">
                  {currentText.split('').map((char, index) => (
                    <span
                      key={index}
                      className={
                        index < typedText.length
                          ? typedText[index] === char
                            ? "bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100"
                            : "bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100"
                          : index === typedText.length
                          ? "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 animate-pulse"
                          : ""
                      }
                    >
                      {char}
                    </span>
                  ))}
                </div>

                {/* Typing Input */}
                <textarea
                  value={typedText}
                  onChange={handleTyping}
                  placeholder="Start typing the words above..."
                  className="w-full p-4 border-2 rounded-lg text-black text-lg leading-relaxed resize-none focus:border-blue-500 focus:outline-none font-mono"
                  rows="3"
                  disabled={showLeaderboard}
                  autoFocus
                />

                <div className="flex justify-between items-center mt-4">
                  <div className="text-lg">
                    <span className="font-semibold">Your Speed: </span>
                    <span className="text-blue-600 font-bold">{speed} WPM</span>
                    <span className="ml-4 font-semibold">Progress: </span>
                    <span className="text-green-600 font-bold">
                      {Math.round((typedText.length / currentText.length) * 100)}%
                    </span>
                  </div>
                  
                  <button
                    onClick={endGame}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    End Game Early
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {showLeaderboard && (
            <div className="mt-8">
              <div className={`p-6 rounded-lg shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}>
                <h3 className="text-2xl font-bold mb-6 text-center">🏆 Final Results</h3>
                <div className="space-y-3">
                  {[...users]
                    .sort((a, b) => b.speed - a.speed)
                    .map((user, index) => (
                      <div
                        key={user.id}
                        className={`p-4 rounded-lg shadow flex justify-between items-center ${
                          index === 0 ? "bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500" :
                          index === 1 ? "bg-gray-100 dark:bg-gray-700" :
                          index === 2 ? "bg-orange-100 dark:bg-orange-900" :
                          theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl font-bold mr-3">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                          </span>
                          <div>
                            <span className="font-bold text-lg">{user.userName}</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Accuracy: {user.accuracy || 100}%
                            </p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-blue-600">{user.speed} WPM</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InviteFriends;