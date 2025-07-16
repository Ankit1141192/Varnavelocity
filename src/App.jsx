import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import TypingTestApp from "./components/TypingTestApp"
const App = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <TypingTestApp/>
      <Footer/>
    </div>
  )
}

export default App
