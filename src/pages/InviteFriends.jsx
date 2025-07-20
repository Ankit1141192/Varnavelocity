// InviteFriends.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, set, onValue, remove } from "firebase/database";

function InviteFriends({ theme }) {
  const { roomId: paramRoomId } = useParams();
  const [roomId, setRoomId] = useState(paramRoomId || "");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [userId] = useState(() => crypto.randomUUID());
  const [isCreator, setIsCreator] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const navigate = useNavigate();

  // Create Room
  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8);
    setRoomId(id);
    setIsCreator(true);
    navigate(`/collaborations/${id}`);
  };

  // Join Room
  const handleJoin = async () => {
    if (!userName || !roomId) {
      alert("Enter your name and room ID.");
      return;
    }
    const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
    await set(userRef, { userName, speed: 0, accuracy: 100 });
    setJoined(true);
  };

  // Simulate Typing (Replace with actual logic)
  const handleTyping = () => {
    const newSpeed = Math.floor(Math.random() * 60) + 40;
    setSpeed(newSpeed);
    const speedRef = ref(db, `rooms/${roomId}/users/${userId}`);
    set(speedRef, { userName, speed: newSpeed, accuracy: 90 });
  };

  // Start Game
  const startGame = () => {
    setGameStarted(true);
  };

  // End Game
  const endGame = () => {
    setShowLeaderboard(true);
  };

  // Fetch users
  useEffect(() => {
    if (!roomId) return;
    const usersRef = ref(db, `rooms/${roomId}/users`);
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.entries(data).map(([id, user]) => ({
          id,
          ...user,
        }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
    });

    // Cleanup on unload
    const cleanup = () => remove(ref(db, `rooms/${roomId}/users/${userId}`));
    window.addEventListener("beforeunload", cleanup);
    return () => {
      cleanup();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [roomId, userId]);

  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {!joined ? (
        <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
          {!roomId && (
            <button
              onClick={createRoom}
              className="bg-indigo-600 text-white w-full py-2 rounded mb-4"
            >
              Create Game Room
            </button>
          )}
          <input
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-2 border mb-3 rounded"
          />
          <input
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border mb-3 rounded"
          />
          <button
            className="bg-blue-600 text-white w-full py-2 rounded"
            onClick={handleJoin}
          >
            Join Room
          </button>
          {roomId && (
            <p className="text-sm text-gray-400 mt-2">
              Share this link:{" "}
              <code className="bg-gray-200 px-1 rounded">
                https://varnavelocity.vercel.app/collaborations/{roomId}
              </code>
            </p>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Room: {roomId}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-4 rounded shadow text-center"
              >
                <p className="font-bold cursor-pointer" onClick={() => setUserName(user.userName)}>{user.userName}</p>
                <p className="text-sm text-gray-500">
                  Speed: {user.speed || 0} WPM
                </p>
              </div>
            ))}
          </div>

          {!gameStarted && isCreator && (
            <button
              onClick={startGame}
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
            >
              Start Game
            </button>
          )}

          {gameStarted && !showLeaderboard && (
            <div className="mt-6 text-center">
              <button
                onClick={handleTyping}
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Simulate Typing Speed
              </button>
              <button
                onClick={endGame}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Finish Game
              </button>
            </div>
          )}

          {showLeaderboard && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Leaderboard</h3>
              <div className="space-y-2">
                {[...users]
                  .sort((a, b) => b.speed - a.speed)
                  .map((user, index) => (
                    <div
                      key={user.id}
                      className="bg-white p-3 rounded shadow flex justify-between"
                    >
                      <span>
                        {index + 1}. {user.userName}
                      </span>
                      <span>{user.speed} WPM</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InviteFriends;
