// App.jsx
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './components/Home';
import Learning from './pages/Learning';
import Pricing from './pages/Pricing';
import SoloPractice from './pages/SoloPractice';
import InviteFriends from './pages/InviteFriends';

const App = () => {
  const [theme, setTheme] = useState('light');

  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      <Navbar theme={theme} setTheme={setTheme} />
      
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/learning" element={<Learning theme={theme} />} />
          <Route path="/pricing" element={<Pricing theme={theme} />} />
          <Route path="/typingtest" element={<SoloPractice theme={theme} />} />
          {/* Fixed the typo: colloborations -> collaborations */}
          <Route path="/collaborations" element={<InviteFriends theme={theme} />} />
          <Route path="/collaborations/:roomId" element={<InviteFriends theme={theme} />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;