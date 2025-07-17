import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Footer from './components/Footer';
import Learning from './pages/Learning';
import Pricing from "./pages/Pricing"
import SoloPractice from './pages/SoloPractice';

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
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
