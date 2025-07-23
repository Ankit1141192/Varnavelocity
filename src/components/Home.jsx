import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Testimonials from '../pages/Testimonials';
import Certificate from '../assets/Certificate.png';

function Home() {
  const [typingSpeed, setTypingSpeed] = useState(20);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const improveTyping = () => {
    setTypingSpeed(prev => (prev < 100 ? prev + 10 : 100));
  };

  const handlePrint = () => {
    window.print();
  };

  const goToSoloPractice = () => {
    navigate('/typingtest');
  };
  const goToInviteFriends = () => {
    navigate('/collaborations'); 
  }

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
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Varnaveloicty?</h2>
                <p className="text-gray-600 text-lg">Everything you need to become a typing expert</p>
              </div>
      
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-time-line text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Tracking</h3>
                  <p className="text-gray-600">Get instant feedback on your typing speed, accuracy, and improvement over time.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-settings-line text-2xl text-green-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Customizable Practice</h3>
                  <p className="text-gray-600">Choose your practice duration, difficulty level, and focus areas to match your goals.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-bar-chart-line text-2xl text-purple-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Analytics</h3>
                  <p className="text-gray-600">Track your progress with detailed statistics and compare with previous attempts.</p>
                </div>
              </div>
      
              <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Structured Learning Path</h3>
                    <p className="text-gray-600 mb-6">
                      Follow our comprehensive curriculum designed by typing experts. Start with basic finger positioning and progress to advanced techniques.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <i className="ri-check-line text-green-600 mr-2"></i>
                        Home row fundamentals
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-green-600 mr-2"></i>
                        All keyboard rows mastery
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-green-600 mr-2"></i>
                        Numbers and symbols
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-green-600 mr-2"></i>
                        Speed building exercises
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <img 
                      src="https://readdy.ai/api/search-image?query=hands%20typing%20on%20keyboard%20with%20proper%20finger%20positioning%20close%20up%20view%20of%20fingers%20on%20keys%20educational%20typing%20technique%20demonstration%20clean%20modern%20keyboard%20with%20soft%20lighting%20professional%20photography%20style&width=400&height=300&seq=learning-hands&orientation=landscape"
                      alt="Typing technique demonstration"
                      className="rounded-lg shadow-md object-cover w-full h-64"
                    />
                  </div>
                </div>
              </div>
      
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Improve Your Typing?</h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of users who have already improved their typing skills with Varnavelocity.
                </p>
                
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
              onClick={goToSoloPractice}
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
            <button
              onClick={goToInviteFriends}
              className="mt-6 bg-orange-500 text-white font-semibold py-2 rounded-md hover:bg-orange-600 transition">
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
