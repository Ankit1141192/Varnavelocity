
import React, { useState } from 'react';
import Testimonials from '../pages/Testimonials';
import Certificate from '../assets/Certificate.png';

function Home() {
  const [typingSpeed, setTypingSpeed] = useState(20);
  const [userName, setUserName] = useState('');

  const improveTyping = () => {
    setTypingSpeed(prev => (prev < 100 ? prev + 10 : 100));
  };

  const handlePrint = () => {
    window.print();
  };



  return (

    <div>
      {/* Top Banner */}
      <div className="flex items-center justify-center p-5">
        <div className="bg-gradient-to-r from-sky-500 to-orange-400 p-4 rounded-md shadow-md flex justify-between items-center w-[90%] max-w-4xl">
          <p className="text-white font-semibold text-lg">
            Create a free account to save your progress!
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white underline text-sm">Log In</a>
            <button className="bg-white text-orange-600 font-semibold px-4 py-2 rounded shadow-sm hover:bg-gray-100">
              Create Free Account
            </button>
          </div>
        </div>

      
      </div>

      <div className="w-full text-center py-5 bg-gradient-to-r from-purple-600 to-indigo-600 m-10 mb-10 mt-0">
        <h2 className="text-white text-2xl md:text-3xl font-semibold tracking-wide">
          Track your progress. Earn your certificate. <br className="hidden sm:block" />
          <span className="text-yellow-300">Become a typing pro!</span>
        </h2>
      </div>
      {/* Typing Progress & Certificate */}

      <div className="flex flex-col items-center justify-center px-6 -mt-6 mb-8">
        <div className="w-[90%] max-w-4xl">
          <div className="flex items-center gap-10 mb-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="bg-blue-400 text-blue-900 font-medium px-4 py-1 rounded cursor-pointer"
            >
              Print Your Certificate
            </button>

            <p className="text-sm text-gray-700">Typing Progress: {typingSpeed}%</p>



            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              className="border px-3 py-1 rounded outline-none"
            />
          </div>

          <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${typingSpeed}%` }}
            ></div>


            <div className="w-full text-center px-4 py-6 bg-gradient-to-r from-purple-600 to-indigo-600">
              <h2 className="text-white text-2xl md:text-3xl font-semibold tracking-wide">
                Track your progress. Earn your certificate. <br className="hidden sm:block" />
                <span className="text-yellow-300">Become a typing pro!</span>
              </h2>
            </div>

          </div>

          {/* Certificate Preview */}
          <div className="mt-4 flex justify-center relative p-5">
            <img
              src={Certificate}
              alt="Typing Certificate"
              className="rounded-md border shadow-lg max-w-full"
              style={{ maxWidth: '600px' }}
            />
            <div className="absolute top-[44%] left-[44%] transform -translate-x-1/2 -translate-y-1/2 text-center m-10">
              <p className="text-xl font-semibold text-black">{userName}</p>
              {/* <p className="text-sm text-gray-800 mt-1">Typing Speed: {typingSpeed}%</p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Typing Cards */}
      <div className="p-10 flex items-center justify-center bg-gray-100 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl w-full">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-blue-900">Typing Test</h2>
              <p className="text-sm text-blue-700 mt-1">Improve your typing skills with Vernavelocity</p>
              <div className="flex items-center bg-gray-200 mt-4 px-3 py-2 rounded-md gap-2 text-gray-600">
                <span className="flex-1">Default</span>
                <span>🔄</span>
              </div>
            </div>
            <button
              onClick={improveTyping}
              className="mt-6 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Practice Yourself
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-blue-900">Test with your friends</h2>
              <p className="text-sm text-blue-700 mt-1">Create your own typing test and play with your friends</p>
              <div className="flex items-center bg-gray-200 mt-4 px-3 py-2 rounded-md gap-2 text-gray-600">
                <span className="flex-1">Default</span>
                <span>🔄</span>
              </div>
            </div>
            <button className="mt-6 bg-orange-500 text-white font-semibold py-2 rounded-md hover:bg-orange-600 transition">
              Create Typing Test
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <section className="bg-white py-14 px-4 mt-10 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">🏆 Leaderboard</h2>
          <div className="divide-y divide-gray-200 shadow-lg rounded-xl overflow-hidden">
            {[
              { id: 1, name: 'Venu Gopal ', wpm: 92, accuracy: 97, avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Venu' },
              { id: 2, name: 'Ankit Kumar', wpm: 85, accuracy: 94, avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Ankit' },
              { id: 3, name: 'Anit Baranwal', wpm: 81, accuracy: 91, avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Anit' },
              { id: 4, name: 'Raj Patel', wpm: 77, accuracy: 89, avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Raj' },
              { id: 5, name: 'Sakshi Singh', wpm: 71, accuracy: 85, avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Sakshi' },
            ].map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold w-8 text-center text-yellow-500">
                    {['🥇', '🥈', '🥉'][index] || `#${index + 1}`}
                  </span>
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">Accuracy: {user.accuracy}%</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-blue-600">{user.wpm} WPM</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">

          <Testimonials />
        </div>
      </section>
    </div>
  );
}

export default Home;