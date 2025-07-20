import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import InviteFriends from './pages/InviteFriends';

import Home from './components/Home';
import Footer from './components/Footer';
import Learning from './pages/Learning';
import Pricing from "./pages/Pricing"
import SoloPractice from './pages/SoloPractice';
import Typingkeyboard from './components/Typingkeyboard';

const App = () => {
  return (
    <div>
      <Navbar />

      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/learning' element = {<Learning/>}/>
          <Route path='/pricing' element = {<Pricing/>}/>
          <Route path='/typingtest' element = {<SoloPractice/>}/>
          <Route path='/typingkeyboard' element={<Typingkeyboard />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
