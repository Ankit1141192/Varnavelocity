import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Adjust path as needed
import { ref, set, onValue, push, serverTimestamp, off } from "firebase/database";

function InviteFriends({ theme = "light" }) {
  const { roomId: urlRoomId } = useParams(); // Get roomId from URL if available

  const [roomId, setRoomId] = useState(urlRoomId || "");
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
  const [roomExists, setRoomExists] = useState(true);
  const [joinError, setJoinError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  
  // New states for enhanced accuracy and time tracking
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameEndTime, setGameEndTime] = useState(null);

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

  // Timer effect for elapsed time
  useEffect(() => {
    let interval;
    if (isTyping && startTime && !gameEndTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTyping, startTime, gameEndTime]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const createRoom = async () => {
    const id = Math.random().toString(36).substring(2, 8).toLowerCase();
    setRoomId(id);
    setIsCreator(true);

    try {
      // Create room in Firebase with creator info
      await set(ref(db, `rooms/${id}`), {
        creator: userId,
        gameStarted: false,
        gameText: "",
        createdAt: serverTimestamp(),
        users: {}
      });

      console.log("Room created successfully:", id);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Error creating room. Please try again.");
    }
  };

  const handleJoin = async () => {
    if (!userName.trim()) {
      setJoinError("Please enter your name.");
      return;
    }
    if (!roomId.trim()) {
      setJoinError("Please enter a room ID.");
      return;
    }

    setIsJoining(true);
    setJoinError("");

    try {
      const roomRef = ref(db, `rooms/${roomId}`);

      // Check if room exists first
      const roomSnapshot = await new Promise((resolve) => {
        onValue(roomRef, resolve, { onlyOnce: true });
      });

      if (!roomSnapshot.exists()) {
        setJoinError("Room not found. Please check the room ID.");
        setRoomExists(false);
        setIsJoining(false);
        return;
      }

      const roomData = roomSnapshot.val();

      // Check if user is the creator
      if (roomData.creator === userId || !roomData.creator) {
        setIsCreator(true);
      }

      // Add user to room
      await set(ref(db, `rooms/${roomId}/users/${userId}`), {
        userName: userName.trim(),
        speed: 0,
        accuracy: 100,
        finished: false,
        totalTime: 0,
        joinedAt: serverTimestamp()
      });

      console.log("Successfully joined room:", roomId);
      setJoined(true);
      setRoomExists(true);

      // Set current game state if game is already started
      if (roomData.gameStarted && roomData.gameText) {
        setGameStarted(true);
        setCurrentText(roomData.gameText);
      }

    } catch (error) {
      console.error("Error joining room:", error);
      setJoinError("Error joining room. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const startGame = async () => {
    if (!isCreator) return;

    const randomText = generateRandomText();
    setCurrentText(randomText);

    try {
      // Update room with game data
      await set(ref(db, `rooms/${roomId}/gameStarted`), true);
      await set(ref(db, `rooms/${roomId}/gameText`), randomText);

      // Reset all users for new game
      const usersRef = ref(db, `rooms/${roomId}/users`);
      const snapshot = await new Promise((resolve) => {
        onValue(usersRef, resolve, { onlyOnce: true });
      });

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const resetPromises = Object.keys(usersData).map(async (uid) => {
          await set(ref(db, `rooms/${roomId}/users/${uid}/speed`), 0);
          await set(ref(db, `rooms/${roomId}/users/${uid}/accuracy`), 100);
          await set(ref(db, `rooms/${roomId}/users/${uid}/finished`), false);
          await set(ref(db, `rooms/${roomId}/users/${uid}/totalTime`), 0);
        });

        await Promise.all(resetPromises);
      }

      setGameStarted(true);
      setStartTime(null);
      setTypedText("");
      setIsTyping(false);
      setShowLeaderboard(false);
      setElapsedTime(0);
      setGameEndTime(null);
      // Reset accuracy tracking
      setTotalKeystrokes(0);
      setCorrectKeystrokes(0);
      setErrors(0);
    } catch (error) {
      console.error("Error starting game:", error);
      alert("Error starting game. Please try again.");
    }
  };

  const handleTyping = async (e) => {
    const value = e.target.value;
    const previousLength = typedText.length;
    const currentLength = value.length;
    
    setTypedText(value);

    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setStartTime(Date.now());
    }

    // Track keystrokes and accuracy
    if (currentLength > previousLength) {
      // User typed a character
      const newChar = value[currentLength - 1];
      const expectedChar = currentText[currentLength - 1];
      
      setTotalKeystrokes(prev => prev + 1);
      
      if (newChar === expectedChar) {
        setCorrectKeystrokes(prev => prev + 1);
      } else {
        setErrors(prev => prev + 1);
      }
    }

    if (isTyping && startTime) {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - startTime) / 1000 / 60; // minutes
      const wordsTyped = value.trim().split(' ').filter(word => word).length;
      const currentSpeed = Math.round(wordsTyped / timeElapsed) || 0;

      // Enhanced accuracy calculation
      let accuracy = 100;
      if (totalKeystrokes > 0) {
        // Calculate accuracy based on total keystrokes vs correct keystrokes
        accuracy = Math.round((correctKeystrokes / totalKeystrokes) * 100);
        
        // Alternative: You can also penalize for current wrong characters
        let currentCorrectChars = 0;
        for (let i = 0; i < Math.min(value.length, currentText.length); i++) {
          if (value[i] === currentText[i]) {
            currentCorrectChars++;
          }
        }
        
        // Use the minimum of keystroke-based accuracy and current position accuracy
        const positionAccuracy = value.length > 0 ? Math.round((currentCorrectChars / value.length) * 100) : 100;
        accuracy = Math.min(accuracy, positionAccuracy);
      }

      setSpeed(currentSpeed);

      // Update user data in Firebase
      try {
        await set(ref(db, `rooms/${roomId}/users/${userId}/speed`), currentSpeed);
        await set(ref(db, `rooms/${roomId}/users/${userId}/accuracy`), accuracy);
        await set(ref(db, `rooms/${roomId}/users/${userId}/totalTime`), Math.floor((currentTime - startTime) / 1000));
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }

    // Check if user finished typing
    if (value === currentText) {
      finishTyping();
    }
  };

  const finishTyping = async () => {
    const endTime = Date.now();
    setGameEndTime(endTime);
    
    try {
      const totalTime = startTime ? Math.floor((endTime - startTime) / 1000) : 0;
      await set(ref(db, `rooms/${roomId}/users/${userId}/finished`), true);
      await set(ref(db, `rooms/${roomId}/users/${userId}/totalTime`), totalTime);
    } catch (error) {
      console.error("Error finishing typing:", error);
    }
  };

  const endGame = () => {
    setShowLeaderboard(true);
  };

  // Listen to room changes in real-time
  useEffect(() => {
    if (!roomId || !joined) return;

    const roomRef = ref(db, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const roomData = snapshot.val();

        // Update users list
        if (roomData.users) {
          const userList = Object.entries(roomData.users).map(([id, user]) => ({
            id,
            ...user,
          }));
          setUsers(userList);

          // Check if all users finished
          const finishedUsers = userList.filter(user => user.finished);
          if (finishedUsers.length === userList.length && userList.length > 0 && gameStarted) {
            setShowLeaderboard(true);
          }
        }

        // Update game state
        setGameStarted(roomData.gameStarted || false);

        // Update game text if it changed
        if (roomData.gameText && roomData.gameText !== currentText) {
          setCurrentText(roomData.gameText);
          // Reset user's typing state when new game starts
          if (typedText !== "") {
            setTypedText("");
            setStartTime(null);
            setIsTyping(false);
            setElapsedTime(0);
            setGameEndTime(null);
            setTotalKeystrokes(0);
            setCorrectKeystrokes(0);
            setErrors(0);
          }
        }

        // Set creator status
        if (roomData.creator === userId) {
          setIsCreator(true);
        }
      } else {
        // Room was deleted
        setRoomExists(false);
        setJoinError("Room no longer exists.");
      }
    });

    return () => off(roomRef, 'value', unsubscribe);
  }, [roomId, joined, currentText, userId, gameStarted, typedText]);

  // Auto-join if roomId is in URL and username is provided
  useEffect(() => {
    if (urlRoomId && !joined && userName.trim() && !isJoining) {
      handleJoin();
    }
  }, [urlRoomId, userName, joined, isJoining]);

  return (
    <div
      className={`min-h-screen p-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
    >

      <p className="text-center text-gray-400 md:text-lg mt-2  mb-8">
        Challenge your friends in a real-time typing speed battle and boost your skills in a fun way!
      </p>

      {!joined ? (
        // rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col justify-between
        <div
          className={`max-w-md mx-auto p-6 border-gray-100 shadow-lg rounded-2xl ${theme === "dark" ? "bg-gray-200" : "bg-gray-200"
            }`}
        >
          <h1 className="text-2xl font-bold text-gray-500 text-center mb-6">Typing Speed Challenge</h1>

          {joinError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {joinError}
            </div>
          )}

          {!roomId && (

            <button
              onClick={createRoom}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-lg mb-4 font-semibold transform hover:-translate-y-1 transition duration-400"
            >
              Create New Game Room
            </button>
          )}

          <div className="space-y-3">
            <input
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toLowerCase())}
              className="w-full p-3 border-2 rounded-lg text-gray-400 focus:border-blue-500 focus:outline-none"
              disabled={isJoining}
            />
            <input
              placeholder="Enter Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 border-2 rounded-lg text-gray-400 focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && !isJoining && handleJoin()}
              disabled={isJoining}
            />

            <button
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${isJoining
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "px-6 py-2 bg-black text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
                }`}
              onClick={handleJoin}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join Room"}
            </button>
          </div>

          {roomId && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-400 mb-2">Share this Room ID:</p>
              <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-600 rounded-lg p-2 mb-3">
                <code className="text-gray-400 dark:text-white font-bold text-lg">
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

              <p className="text-sm text-gray-400 font-medium mb-2">Or share this link:</p>
              <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-600 rounded-lg p-2">
                <code className="text-gray-400 dark:text-white text-xs break-all mr-2">
                  {window.location.origin}/collaborations/{roomId}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/collaborations/${roomId}`)}
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
            <h2 className="text-2xl text-gray-400 font-bold">Room: {roomId}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {gameStarted ? (showLeaderboard ? "Game Complete!" : "Game in Progress") : "Waiting to start..."}
            </p>
            {/* Show elapsed time during game */}
            {gameStarted && !showLeaderboard && isTyping && (
              <div className="mt-2 text-lg font-semibold text-blue-600">
                Time: {formatTime(elapsedTime)}
              </div>
            )}
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {users.map((user) => (
              <div
                key={user.id}
                className={`rounded-2xl border bg-gray-200 p-6 bg-gradient-to-br from-white to-gray-50 shadow-md transition hover:shadow-lg ${user.finished ? "border-green-400" : "border-gray-200"
                  }`}
              >
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user.userName}
                    {user.id === userId && <span className="text-blue-500 ml-1">(You)</span>}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Speed:{" "}
                    <span className="font-semibold text-indigo-600">{user.speed || 0}</span> WPM
                  </p>
                  
                  <p className="text-sm text-gray-500">
                    Accuracy:{" "}
                    <span className="font-semibold text-green-600">{user.accuracy || 100}%</span>
                  </p>
                  
                  {user.totalTime > 0 && (
                    <p className="text-sm text-gray-500">
                      Time:{" "}
                      <span className="font-semibold text-blue-600">{formatTime(user.totalTime)}</span>
                    </p>
                  )}

                  {user.finished && (
                    <div className="mt-3 px-3 py-1 bg-green-500 text-white text-xs rounded-full shadow-sm">
                      Finished!
                    </div>
                  )}
                </div>
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
                Waiting for the room creator to start the game...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                ({users.length} player{users.length !== 1 ? 's' : ''} in room)
              </p>
            </div>
          )}

          {/* Typing Area - Available for ALL players once game starts */}
          {gameStarted && !showLeaderboard && currentText && (
            <div className="mt-8">
              <div className={`p-6 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
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

                <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
                  <div className="flex flex-wrap gap-4 text-lg">
                    <div>
                      <span className="font-semibold">Speed: </span>
                      <span className="text-blue-600 font-bold">{speed} WPM</span>
                    </div>
                    <div>
                      <span className="font-semibold">Accuracy: </span>
                      <span className="text-green-600 font-bold">
                        {totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100}%
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Progress: </span>
                      <span className="text-purple-600 font-bold">
                        {Math.round((typedText.length / currentText.length) * 100)}%
                      </span>
                    </div>
                    {isTyping && (
                      <div>
                        <span className="font-semibold">Time: </span>
                        <span className="text-orange-600 font-bold">{formatTime(elapsedTime)}</span>
                      </div>
                    )}
                  </div>

                  {isCreator && (
                    <button
                      onClick={endGame}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      End Game Early
                    </button>
                  )}
                </div>
                
                {/* Additional stats */}
                {totalKeystrokes > 0 && (
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap gap-4">
                    <span>Total Keystrokes: {totalKeystrokes}</span>
                    <span>Correct: {correctKeystrokes}</span>
                    <span>Errors: {errors}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {showLeaderboard && (
            <div className="mt-8">
              <div className={`p-6 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}>
                <h3 className="text-2xl font-bold text-gray-400 mb-6 text-center">🏆 Final Results</h3>
                <div className="space-y-3">
                  {[...users]
                    .sort((a, b) => {
                      // Sort by speed first, then by accuracy, then by time (lower is better)
                      if (b.speed !== a.speed) return b.speed - a.speed;
                      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
                      return (a.totalTime || 0) - (b.totalTime || 0);
                    })
                    .map((user, index) => (
                      <div
                        key={user.id}
                        className={`p-4 rounded-lg shadow flex justify-between items-center ${index === 0 ? "bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500" :
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
                            <span className="font-bold text-lg">
                              {user.userName}
                              {user.id === userId && <span className="text-blue-500 ml-1">(You)</span>}
                            </span>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex gap-4">
                              <span>Accuracy: {user.accuracy || 100}%</span>
                              {user.totalTime > 0 && (
                                <span>Time: {formatTime(user.totalTime)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-blue-600">{user.speed} WPM</span>
                      </div>
                    ))}
                </div>

                {isCreator && (
                  <div className="text-center mt-6">
                    <div className="flex justify-center items-center min-h-[300px]">
                      <button
                        onClick={startGame}
                        className="bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 
                          hover:from-green-600 hover:to-lime-600
                          text-white px-6 py-3 rounded-xl 
                          font-semibold text-lg shadow-md 
                          hover:shadow-lg transform hover:scale-105 
                          transition-all duration-300 ease-in-out flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Start New Game
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InviteFriends;