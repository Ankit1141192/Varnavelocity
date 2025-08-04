import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Adjust path as needed
import { ref, set, onValue, serverTimestamp, off } from "firebase/database";

function InviteFriends({ theme = "light" }) {
  const { urlId: urlRoomId } = useParams();

  // Main game and UI states
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

  // Copy button success state
  const [copySuccess, setCopySuccess] = useState(false);

  // Typing stats
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameEndTime, setGameEndTime] = useState(null);

  // Timer data
  const [gameDuration, setGameDuration] = useState(2);
  const [gameTimeLeft, setGameTimeLeft] = useState(0);
  const [gameStartTimestamp, setGameStartTimestamp] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);

  // UI modes
  const [gameMode, setGameMode] = useState("create");
  const [showRoomCreated, setShowRoomCreated] = useState(false);
  const [showCustomParaInput, setShowCustomParaInput] = useState(false);
  const [customPara, setCustomPara] = useState("");
  const [savingPara, setSavingPara] = useState(false);

  // Font family for typing area: support monospace, serif, sans-serif, cursive, font-bold
  const [fontFamily, setFontFamily] = useState("monospace");
  const [fontWeight, setFontWeight] = useState("normal"); // normal or bold

  // Word bank for text generation
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
    "career", "carry", "case", "catch", "cause", "cell", "center", "century", "certain"
  ];

  const generateRandomText = () => {
    const count = 25 + Math.floor(Math.random() * 10);
    const shuffled = [...wordBank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).join(" ");
  };

  // Copy room ID with feedback
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Track elapsed time while typing
  useEffect(() => {
    let timer;
    if (isTyping && startTime && !gameEndTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTyping, startTime, gameEndTime]);

  // Countdown game timer
  useEffect(() => {
    let timer;
    if (gameStarted && gameStartTimestamp && !gameEnded && !showLeaderboard) {
      timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - gameStartTimestamp) / 1000);
        const total = gameDuration * 60;
        const remaining = Math.max(0, total - elapsed);
        setGameTimeLeft(remaining);
        if (remaining === 0) endGameByTimeout();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameStartTimestamp, gameEnded, showLeaderboard, gameDuration]);

  // End game on timeout
  const endGameByTimeout = async () => {
    setGameEnded(true);
    setShowLeaderboard(true);
    if (isCreator) {
      try {
        await set(ref(db, `rooms/${roomId}/gameEnded`), true);
        await set(ref(db, `rooms/${roomId}/endedBy`), "timeout");
      } catch { }
    }
  };

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Create room handler
  const createRoom = async () => {
    const id = Math.random().toString(36).slice(2, 8);
    setRoomId(id);
    setIsCreator(true);
    setShowRoomCreated(true);
    try {
      await set(ref(db, `rooms/${id}`), {
        creator: userId,
        gameStarted: false,
        gameDuration: 2,
        gameText: "",
        createdAt: serverTimestamp(),
        users: {}
      });
    } catch {
      alert("Failed to create room");
    }
  };

  // Join room handler
  const handleJoin = async () => {
    if (!userName.trim()) {
      setJoinError("Please enter a name");
      return;
    }
    if (!roomId.trim()) {
      setJoinError("Please enter room ID");
      return;
    }

    setJoinError("");
    setIsJoining(true);
    try {
      const roomRef = ref(db, `rooms/${roomId}`);
      const snapshot = await new Promise((res) => onValue(roomRef, res, { onlyOnce: true }));
      if (!snapshot.exists()) {
        setJoinError("Room not found");
        setRoomExists(false);
        setIsJoining(false);
        return;
      }
      const data = snapshot.val();
      if (data.creator === userId || !data.creator) setIsCreator(true);
      if (data.gameDuration) setGameDuration(data.gameDuration);
      await set(ref(db, `rooms/${roomId}/users/${userId}`), {
        userName: userName.trim(),
        speed: 0,
        accuracy: 100,
        finished: false,
        totalTime: 0,
        joinedAt: serverTimestamp()
      });
      setJoined(true);
      setRoomExists(true);

      if (data.gameStarted && data.gameText) {
        setGameStarted(true);
        setCurrentText(data.gameText);
        if (data.gameStartTimestamp) {
          setGameStartTimestamp(data.gameStartTimestamp);
          const elapsed = Math.floor((Date.now() - data.gameStartTimestamp) / 1000);
          setGameTimeLeft(Math.max(0, data.gameDuration * 60 - elapsed));
        }
      }
    } catch {
      setJoinError("Failed to join room");
    }
    setIsJoining(false);
  };

  // Start game handler
  const startGame = async () => {
    if (!isCreator) return;
    const text = currentText.length >= 10 ? currentText : generateRandomText();
    const startTS = Date.now();
    setCurrentText(text);
    setGameStartTimestamp(startTS);
    setGameTimeLeft(gameDuration * 60);
    setGameEnded(false);

    try {
      await set(ref(db, `rooms/${roomId}/gameStarted`), true);
      await set(ref(db, `rooms/${roomId}/gameDuration`), gameDuration);
      await set(ref(db, `rooms/${roomId}/gameText`), text);
      await set(ref(db, `rooms/${roomId}/gameStartTimestamp`), startTS);
      await set(ref(db, `rooms/${roomId}/gameEnded`), false);
      const usersRef = ref(db, `rooms/${roomId}/users`);
      const snap = await new Promise((res) => onValue(usersRef, res, { onlyOnce: true }));
      if (snap.exists()) {
        const usersData = snap.val();
        await Promise.all(Object.keys(usersData).map(uid =>
          Promise.all([
            set(ref(db, `rooms/${roomId}/users/${uid}/speed`), 0),
            set(ref(db, `rooms/${roomId}/users/${uid}/accuracy`), 100),
            set(ref(db, `rooms/${roomId}/users/${uid}/finished`), false),
            set(ref(db, `rooms/${roomId}/users/${uid}/totalTime`), 0)
          ])
        ));
      }
      setTypedText("");
      setStartTime(null);
      setIsTyping(false);
      setShowLeaderboard(false);
      setElapsedTime(0);
      setGameEnded(false);
      setTotalKeystrokes(0);
      setCorrectKeystrokes(0);
      setErrors(0);
    } catch {
      alert("Failed to start game");
    }
  };

  // User typing handler
  const handleTyping = async (e) => {
    if (gameEnded || showLeaderboard) return;
    const value = e.target.value;
    const prevLen = typedText.length;
    const currentLen = value.length;
    setTypedText(value);

    if (!isTyping && currentLen > 0) {
      setIsTyping(true);
      setStartTime(Date.now());
    }

    if (currentLen > prevLen) {
      const typedChar = value[currentLen - 1];
      const expectedChar = currentText[currentLen - 1];
      setTotalKeystrokes(p => p + 1);
      if (typedChar === expectedChar) setCorrectKeystrokes(p => p + 1);
      else setErrors(p => p + 1);
    }

    if (isTyping && startTime) {
      const now = Date.now();
      const elapsedMin = (now - startTime) / 60000;
      const wordsTyped = value.trim().split(/\s+/).length;
      const currSpeed = Math.round(wordsTyped / elapsedMin) || 0;

      let currAccuracy = 100;
      if (totalKeystrokes > 0) {
        currAccuracy = Math.round((correctKeystrokes / totalKeystrokes) * 100);
        let correctChars = 0;
        for (let i = 0; i < Math.min(value.length, currentText.length); i++) {
          if (value[i] === currentText[i]) correctChars++;
        }
        const posAccuracy = value.length ? Math.round((correctChars / value.length) * 100) : 100;
        currAccuracy = Math.min(currAccuracy, posAccuracy);
      }

      setSpeed(currSpeed);
      try {
        await set(ref(db, `rooms/${roomId}/users/${userId}/speed`), currSpeed);
        await set(ref(db, `rooms/${roomId}/users/${userId}/accuracy`), currAccuracy);
        await set(ref(db, `rooms/${roomId}/users/${userId}/totalTime`), Math.floor((now - startTime) / 1000));
      } catch { }
    }

    if (value === currentText) finishTyping();
  };

  // Finish typing update
  const finishTyping = async () => {
    const endTS = Date.now();
    setGameEndTime(endTS);
    try {
      const totalTime = startTime ? Math.floor((endTS - startTime) / 1000) : 0;
      await Promise.all([
        set(ref(db, `rooms/${roomId}/users/${userId}/finished`), true),
        set(ref(db, `rooms/${roomId}/users/${userId}/totalTime`), totalTime)
      ]);
    } catch { }
  };

  // End game handler
  const endGame = async () => {
    setGameEnded(true);
    setShowLeaderboard(true);
    if (isCreator) {
      try {
        await set(ref(db, `rooms/${roomId}/gameEnded`), true);
        await set(ref(db, `rooms/${roomId}/endedBy`), "manual");
      } catch { }
    }
  };

  // Listen for realtime room changes
  useEffect(() => {
    if (!roomId || !joined) return;
    const roomRef = ref(db, `rooms/${roomId}`);
    const listener = onValue(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        setRoomExists(false);
        setJoinError("Room no longer exists");
        return;
      }
      const data = snapshot.val();

      if (data.users) {
        const userArray = Object.entries(data.users).map(([id, u]) => ({ id, ...u }));
        setUsers(userArray);
        const finishedCount = userArray.filter(u => u.finished).length;
        if (finishedCount === userArray.length && userArray.length > 0 && data.gameStarted && !data.gameEnded) {
          setShowLeaderboard(true);
          setGameEnded(true);
        }
      }

      setGameStarted(data.gameStarted || false);
      if (data.gameEnded && !gameEnded) {
        setGameEnded(true);
        setShowLeaderboard(true);
      }

      if (data.gameDuration && data.gameDuration !== gameDuration) setGameDuration(data.gameDuration);

      if (data.gameText !== currentText) {
        setCurrentText(data.gameText || "");
        if (typedText.length > 0) {
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

      if (data.gameStartTimestamp !== gameStartTimestamp) {
        setGameStartTimestamp(data.gameStartTimestamp || null);
        if (data.gameStartTimestamp && data.gameDuration) {
          const elapsed = Math.floor((Date.now() - data.gameStartTimestamp) / 1000);
          setGameTimeLeft(Math.max(0, data.gameDuration * 60 - elapsed));
        }
      }

      if (data.creator === userId) setIsCreator(true);
    });

    return () => off(roomRef, "value", listener);
  }, [roomId, joined, currentText, typedText, gameStarted, gameEnded, gameDuration, gameStartTimestamp, userId]);

  // Auto join if URL contains room ID & user name exists
  useEffect(() => {
    if (urlRoomId && !joined && userName.trim() && !isJoining) {
      handleJoin();
    }
    // eslint-disable-next-line
  }, [urlRoomId, userName, joined, isJoining]);

  // Theme classes for light/dark
  const bgClass = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const cardBg = theme === "dark" ? "bg-gray-800/90" : "bg-white/90";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";

  // Style changes for text area based on fontWeight
  const fontWeightStyle = fontWeight === "bold" ? "font-bold" : "font-normal";

  return (
    <div className={`${bgClass} min-h-screen py-20 flex items-center justify-center`}>
      <div className={`max-w-4xl w-full px-6`}>
        <div className="text-center mb-12">
          <h1 className={`${textPrimary} text-5xl font-bold mb-4`}>Challenge Your Friends</h1>
          <p className={`${textSecondary} text-xl max-w-2xl mx-auto`}>Challenge your friends in a real-time typing battle and boost your skills!</p>
        </div>

        {!joined ? (
          <div className={`${cardBg} ${borderColor} border rounded-3xl p-8 shadow-lg`}>
            <div className="text-center mb-8">
              <h2 className={`${textPrimary} text-3xl font-bold mb-6`}>Typing Speed Challenge</h2>
              <div className="flex justify-center mb-8">
                <div className="flex space-x-2 bg-white p-1 border border-gray-500/50 rounded-full text-sm">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="options"
                      id="option1"
                      className="hidden peer"
                      checked={gameMode === "create"}
                      onChange={() => setGameMode("create")}
                    />
                    <label
                      htmlFor="option1"
                      className="cursor-pointer rounded-full py-2 px-9 text-gray-500 transition-colors duration-200 peer-checked:bg-indigo-600 peer-checked:text-white"
                    >
                      Create
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="options"
                      id="option2"
                      className="hidden peer"
                      checked={gameMode === "join"}
                      onChange={() => setGameMode("join")}
                    />
                    <label
                      htmlFor="option2"
                      className="cursor-pointer rounded-full py-2 px-9 text-gray-500 transition-colors duration-200 peer-checked:bg-indigo-600 peer-checked:text-white"
                    >
                      Join
                    </label>
                  </div>
                </div>

              </div>
            </div>
            {joinError && (
              <div className="max-w-md mx-auto mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-center">
                {joinError}
              </div>
            )}
            {gameMode === "create" ? (
              !showRoomCreated ? (
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-center">
                    <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <p className={`${textSecondary} mb-4`}>Create a new room and invite friends</p>
                  </div>
                  <button
                    onClick={createRoom}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition"
                  >
                    Create Room
                  </button>
                </div>
              ) : (
                <div className="max-w-md mx-auto space-y-6 text-center">
                  <div className="mx-auto w-20 h-20 mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4 1.414-1.414 4 4 7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <h3 className={`${textPrimary} text-2xl font-bold`}>Room Created!</h3>
                  <div className="max-w-md mx-auto p-6 bg-white rounded shadow relative">
                    <p className="mb-2 text-gray-700">Room ID:</p>
                    <div className="flex items-center justify-center space-x-3 relative">
                      <code className="px-4 py-2 bg-blue-100 rounded text-blue-700 font-mono text-xl font-bold">
                        {roomId.toUpperCase()}
                      </code>
                      <button
                        title="Copy Room ID"
                        className="p-2 rounded bg-gray-500 hover:bg-gray-200 relative"
                        onClick={copyRoomId}
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.498 5.5h-7.5a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h7.5a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.5 11.5c-.825 0-1.5-.675-1.5-1.5V2.5C1 1.675 1.675 1 2.5 1H10c.825 0 1.5.675 1.5 1.5"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {copySuccess && (
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 rounded bg-black bg-opacity-80 text-white text-xs px-2 py-1 pointer-events-none select-none whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className={textSecondary}>Share the Room ID with friends to join.</p>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded border border-gray-300 text-center"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <button
                    onClick={handleJoin}
                    disabled={!userName.trim() || isJoining}
                    className="w-full py-3 rounded bg-green-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isJoining ? "Joining..." : "Join Room"}
                  </button>
                </div>
              )
            ) : (
              <div className="max-w-md mx-auto space-y-6">
                <p className={`${textSecondary} text-center`}>Enter Room ID and your name to join.</p>
                <input
                  type="text"
                  placeholder="Room ID"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded border border-gray-300 text-center font-mono text-lg"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toLowerCase())}
                />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded border border-gray-300 text-center"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <button
                  onClick={handleJoin}
                  disabled={!roomId || !userName || isJoining}
                  className="w-full py-3 rounded bg-orange-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isJoining ? "Joining..." : "Join Room"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4 text-center font-mono text-blue-700 uppercase tracking-widest">
              {roomId.toUpperCase()}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {users.map((u) => (
                <div
                  key={u.id}
                  className={`px-2 py-1 rounded-full font-semibold text-sm border ${u.id === userId
                      ? "bg-blue-100 text-blue-700 border-blue-400"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                    }`}
                >
                  {u.userName}
                  {u.id === userId ? " (You)" : ""}
                  {u.finished && <span className="ml-1 text-green-700">✔</span>}
                </div>
              ))}
            </div>
            <div
              className={`${cardBg} ${borderColor} border rounded-xl p-6 max-w-xl mx-auto shadow-lg`}
            >
              {/* Creator Controls */}
              {!gameStarted && isCreator && (
                <>
                  <div className="mb-6">
                    <label className={`${textSecondary} mr-2`}>Duration:</label>
                    <select
                      className="border rounded px-2 py-1"
                      value={gameDuration}
                      onChange={async (e) => {
                        const val = parseInt(e.target.value);
                        setGameDuration(val);
                        try {
                          await set(
                            ref(db, `rooms/${roomId}/gameDuration`),
                            val
                          );
                        } catch { }
                      }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} min</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    {!showCustomParaInput ? (
                      <button
                        className="bg-purple-600 text-white rounded px-4 py-2 mb-2 hover:bg-purple-700"
                        onClick={() => {
                          setShowCustomParaInput(true);
                          setCustomPara(currentText);
                        }}
                      >
                        {currentText.length >= 10 ? "Edit Paragraph" : "Add Paragraph"}
                      </button>
                    ) : (
                      <div>
                        <textarea
                          rows="4"
                          maxLength={800}
                          value={customPara}
                          onChange={(e) => setCustomPara(e.target.value)}
                          className="w-full border rounded p-2 font-mono resize-none"
                          placeholder="Your paragraph..."
                        />
                        <div className="flex justify-center gap-2 mt-2">
                          <button
                            className="bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50"
                            disabled={savingPara || customPara.trim().length < 10}
                            onClick={async () => {
                              setSavingPara(true);
                              try {
                                await set(
                                  ref(db, `rooms/${roomId}/gameText`),
                                  customPara.trim()
                                );
                                setCurrentText(customPara.trim());
                                setShowCustomParaInput(false);
                              } catch {
                                alert("Failed saving paragraph");
                              }
                              setSavingPara(false);
                            }}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-400 text-white rounded px-4 py-2"
                            disabled={savingPara}
                            onClick={() => setShowCustomParaInput(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    className="w-full bg-green-600 text-white rounded py-3 hover:bg-green-700"
                    onClick={startGame}
                  >
                    Start Game
                  </button>
                </>
              )}

              {/* Not creator waiting */}
              {!gameStarted && !isCreator && (
                <div className="text-center mb-2 text-gray-500">
                  Waiting for game start...
                </div>
              )}

              {/* Game in progress */}
              {gameStarted && !showLeaderboard && (
                <>
                  <div className="text-center mb-4">
                    <span
                      className={`inline-block py-1 px-3 rounded-full text-sm ${gameTimeLeft <= 30
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : gameTimeLeft <= 60
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                    >
                      {`Time Left: ${formatTime(gameTimeLeft)}`}
                    </span>
                    {isTyping && (
                      <div className="text-sm mt-1 text-gray-500">{`Your Time: ${formatTime(
                        elapsedTime
                      )}`}</div>
                    )}
                  </div>
                  <div className="mb-3 flex justify-center items-center gap-2">
                    <label>Font:</label>
                    <select
                      className="border rounded px-2 py-1"
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                    >
                      <option value="monospace">Monospace</option>
                      <option value="serif">Serif</option>
                      <option value="sans-serif">Sans Serif</option>
                      <option value="cursive">Cursive</option>
                    </select>
                    <label>Weight:</label>
                    <select
                      className="border rounded px-2 py-1"
                      value={fontWeight}
                      onChange={(e) => setFontWeight(e.target.value)}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div
                    className={`bg-gray-100 text-lg rounded p-4 mb-3 overflow-x-auto`}
                    style={{ fontFamily: fontFamily }}
                  >
                    {currentText.split("").map((char, i) => {
                      let className = fontWeight === "bold" ? "font-bold" : "";
                      if (i < typedText.length) {
                        className +=
                          typedText[i] === char
                            ? " text-green-600 bg-green-100"
                            : " text-red-600 bg-red-100";
                      } else if (i === typedText.length) {
                        className += " bg-blue-100 animate-pulse";
                      }
                      return (
                        <span key={i} className={`${className} rounded px-1`}>
                          {char}
                        </span>
                      );
                    })}
                  </div>
                  <textarea
                    value={typedText}
                    onChange={handleTyping}
                    disabled={gameEnded || showLeaderboard}
                    spellCheck={false}
                    rows={3}
                    autoFocus
                    placeholder="Start typing..."
                    style={{ fontFamily: fontFamily }}
                    className={`w-full p-3 border border-gray-300 rounded text-lg resize-none ${fontWeight === "bold" ? "font-bold" : ""
                      }`}
                  />
                  <div className="flex justify-center gap-6 text-sm mb-4">
                    <div>
                      Accuracy:{" "}
                      <strong>
                        {totalKeystrokes
                          ? Math.round(
                            (correctKeystrokes / totalKeystrokes) * 100
                          )
                          : 100}
                        %
                      </strong>
                    </div>
                    <div>
                      Errors: <strong>{errors}</strong>
                    </div>
                    <div>
                      Time: <strong>{formatTime(elapsedTime)}</strong>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      disabled={gameEnded}
                      onClick={endGame}
                      className="bg-red-600 text-white py-2 px-5 rounded hover:bg-red-700 transition"
                    >
                      End Game
                    </button>
                  </div>
                </>
              )}

              {/* Leaderboard */}
              {showLeaderboard && (
                <div>
                  <h3 className="text-xl font-bold text-center mb-4">Leaderboard</h3>
                  <table className="w-full border border-gray-300 border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2 text-center">#</th>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">WPM</th>
                        <th className="border border-gray-300 p-2">Accuracy</th>
                        <th className="border border-gray-300 p-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .slice()
                        .sort((a, b) => {
                          if (a.finished && !b.finished) return -1;
                          if (!a.finished && b.finished) return 1;
                          if (a.finished && b.finished) {
                            if (a.accuracy !== b.accuracy)
                              return b.accuracy - a.accuracy;
                            if (a.speed !== b.speed) return b.speed - a.speed;
                            return a.totalTime - b.totalTime;
                          }
                          if (a.accuracy !== b.accuracy) return b.accuracy - a.accuracy;
                          if (a.speed !== b.speed) return b.speed - a.speed;
                          return 0;
                        })
                        .map((u, idx) => (
                          <tr
                            key={u.id}
                            className={
                              u.id === userId ? "bg-blue-100 font-semibold" : "hover:bg-gray-50"
                            }
                          >
                            <td className="border border-gray-300 p-2 text-center">
                              {idx + 1}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {u.userName}
                              {u.id === userId ? " (You)" : ""}
                            </td>
                            <td className="border border-gray-300 p-2">{u.speed || 0}</td>
                            <td className="border border-gray-300 p-2">{u.accuracy || 100}%</td>
                            <td className="border border-gray-300 p-2">
                              {u.totalTime > 0 ? formatTime(u.totalTime) : "--"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {isCreator && (
                    <button
                      onClick={startGame}
                      className="w-full mt-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Start New Game
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InviteFriends;
