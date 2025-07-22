import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Adjust path as needed
import { ref, set, onValue, push, serverTimestamp, off } from "firebase/database";

function InviteFriends({ theme = "light" }) {
  const { roomId: urlRoomId } = useParams(); 

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

  // NEW: Game timer states
  const [gameDuration, setGameDuration] = useState(2); // Default 2 minutes
  const [gameTimeLeft, setGameTimeLeft] = useState(0);
  const [gameStartTimestamp, setGameStartTimestamp] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);

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

  // NEW: Game timer countdown effect
  useEffect(() => {
    let interval;
    if (gameStarted && gameStartTimestamp && !gameEnded && !showLeaderboard) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - gameStartTimestamp) / 1000);
        const totalGameTime = gameDuration * 60; // Convert minutes to seconds
        const remaining = Math.max(0, totalGameTime - elapsed);

        setGameTimeLeft(remaining);

        // Auto-end game when time runs out
        if (remaining <= 0) {
          endGameDueToTimeout();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameStartTimestamp, gameEnded, showLeaderboard, gameDuration]);

  // NEW: Function to end game due to timeout
  const endGameDueToTimeout = async () => {
    setGameEnded(true);
    setShowLeaderboard(true);

    if (isCreator) {
      try {
        await set(ref(db, `rooms/${roomId}/gameEnded`), true);
        await set(ref(db, `rooms/${roomId}/endedBy`), 'timeout');
      } catch (error) {
        console.error("Error ending game due to timeout:", error);
      }
    }
  };

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
        gameDuration: 2, // Default 2 minutes
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

      // Set game duration from room data
      if (roomData.gameDuration) {
        setGameDuration(roomData.gameDuration);
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

        // Set game timer if game is in progress
        if (roomData.gameStartTimestamp) {
          setGameStartTimestamp(roomData.gameStartTimestamp);
          const elapsed = Math.floor((Date.now() - roomData.gameStartTimestamp) / 1000);
          const totalGameTime = (roomData.gameDuration || 2) * 60;
          setGameTimeLeft(Math.max(0, totalGameTime - elapsed));
        }
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
    const gameStart = Date.now();

    setCurrentText(randomText);
    setGameStartTimestamp(gameStart);
    setGameTimeLeft(gameDuration * 60);
    setGameEnded(false);

    try {
      // Update room with game data including timer
      await set(ref(db, `rooms/${roomId}/gameStarted`), true);
      await set(ref(db, `rooms/${roomId}/gameText`), randomText);
      await set(ref(db, `rooms/${roomId}/gameDuration`), gameDuration);
      await set(ref(db, `rooms/${roomId}/gameStartTimestamp`), gameStart);
      await set(ref(db, `rooms/${roomId}/gameEnded`), false);

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
    // Don't allow typing if game has ended
    if (gameEnded || showLeaderboard) return;

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

  const endGame = async () => {
    setGameEnded(true);
    setShowLeaderboard(true);

    if (isCreator) {
      try {
        await set(ref(db, `rooms/${roomId}/gameEnded`), true);
        await set(ref(db, `rooms/${roomId}/endedBy`), 'manual');
      } catch (error) {
        console.error("Error ending game:", error);
      }
    }
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
          if (finishedUsers.length === userList.length && userList.length > 0 && gameStarted && !roomData.gameEnded) {
            setShowLeaderboard(true);
            setGameEnded(true);
          }
        }

        // Update game state
        setGameStarted(roomData.gameStarted || false);

        // Check if game was ended by creator or timeout
        if (roomData.gameEnded && !gameEnded) {
          setGameEnded(true);
          setShowLeaderboard(true);
        }

        // Update game duration
        if (roomData.gameDuration && roomData.gameDuration !== gameDuration) {
          setGameDuration(roomData.gameDuration);
        }

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
            setGameEnded(false);
          }
        }

        // Update game timer
        if (roomData.gameStartTimestamp && roomData.gameStartTimestamp !== gameStartTimestamp) {
          setGameStartTimestamp(roomData.gameStartTimestamp);
          const elapsed = Math.floor((Date.now() - roomData.gameStartTimestamp) / 1000);
          const totalGameTime = (roomData.gameDuration || 2) * 60;
          setGameTimeLeft(Math.max(0, totalGameTime - elapsed));
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
  }, [roomId, joined, currentText, userId, gameStarted, typedText, gameEnded, gameDuration, gameStartTimestamp]);

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

            {/* Show game timer */}
            {gameStarted && !showLeaderboard && (
              <div className="mt-3">
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg font-bold text-lg ${
                  gameTimeLeft <= 30 ? "bg-red-100 text-red-700 animate-pulse" :
                  gameTimeLeft <= 60 ? "bg-yellow-100 text-yellow-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Time Left: {formatTime(gameTimeLeft)}
                </div>

                {/* Personal timer */}
                {isTyping && (
                  <div className="mt-2 text-sm text-gray-600">
                    Your Time: {formatTime(elapsedTime)}
                  </div>
                )}
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
              {/* NEW: Game Duration Selector */}
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block">
                <h4 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Set Game Duration</h4>
                <div className="flex items-center gap-4 justify-center">
                  <label className="text-gray-600 dark:text-gray-400">Minutes:</label>
                  <select
                    value={gameDuration}
                    onChange={async (e) => {
                      const newDuration = parseInt(e.target.value);
                      setGameDuration(newDuration);
                      // Update in Firebase
                      try {
                        await set(ref(db, `rooms/${roomId}/gameDuration`), newDuration);
                      } catch (error) {
                        console.error("Error updating game duration:", error);
                      }
                    }}
                    className="px-3 py-2 border-2 rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} minute{i + 1 > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Game will automatically end after {gameDuration} minute{gameDuration > 1 ? 's' : ''}
                </p>
              </div>

              <div>
                <button
                  onClick={startGame}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Start {gameDuration} Minute Challenge
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  This will generate random words for everyone to type
                </p>
              </div>
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
              <p className="text-sm text-blue-600 font-semibold mt-2">
                Game Duration: {gameDuration} minute{gameDuration > 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Typing Area - Available for ALL players once game starts */}
          {gameStarted && !showLeaderboard && currentText && !gameEnded && (
            <div className="mt-8">
              <div className={`p-6 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">Type the following words:</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentText}
                  </p>
                </div>
                <textarea
                  className="w-full p-4 border-2 rounded-lg text-lg font-mono focus:border-blue-500 focus:outline-none"
                  rows={3}
                  value={typedText}
                  onChange={handleTyping}
                  disabled={gameEnded || showLeaderboard}
                  placeholder="Start typing here..."
                  spellCheck={false}
                  autoFocus
                />
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {/* Speed: <span className="font-bold text-indigo-600">{speed}</span> WPM */}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Accuracy: <span className="font-bold text-green-600">{totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100}%</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Errors: <span className="font-bold text-red-600">{errors}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Time: <span className="font-bold text-blue-600">{formatTime(elapsedTime)}</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
                    onClick={endGame}
                  >
                    End Game
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {showLeaderboard && (
            <div className="mt-10">
              <div className={`p-8 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-700 dark:text-gray-200">Leaderboard</h3>
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 text-gray-500">#</th>
                      <th className="py-2 px-4 text-gray-500">Name</th>
                      <th className="py-2 px-4 text-gray-500">Speed (WPM)</th>
                      <th className="py-2 px-4 text-gray-500">Accuracy</th>
                      <th className="py-2 px-4 text-gray-500">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...users]
                      .sort((a, b) => {
                        // Sort by finished first, then by time, then by speed
                        if (a.finished && !b.finished) return -1;
                        if (!a.finished && b.finished) return 1;
                        if (a.finished && b.finished) {
                          if (a.totalTime !== b.totalTime) return a.totalTime - b.totalTime;
                          return b.speed - a.speed;
                        }
                        return b.speed - a.speed;
                      })
                      .map((user, idx) => (
                        <tr key={user.id} className={user.id === userId ? "bg-blue-50 dark:bg-blue-900" : ""}>
                          <td className="py-2 px-4">{idx + 1}</td>
                          <td className="py-2 px-4 font-semibold">
                            {user.userName}
                            {user.id === userId && <span className="text-blue-500 ml-1">(You)</span>}
                          </td>
                          <td className="py-2 px-4">{user.speed || 0}</td>
                          <td className="py-2 px-4">{user.accuracy || 100}%</td>
                          <td className="py-2 px-4">{user.totalTime > 0 ? formatTime(user.totalTime) : "--"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="text-center mt-8">
                  {isCreator && (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
                      onClick={startGame}
                    >
                      Start New Game
                    </button>
                  )}
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