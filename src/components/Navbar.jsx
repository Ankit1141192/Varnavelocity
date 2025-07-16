import React, { useState } from 'react';
import logo from '../assets/logo1.png'; // Your logo path

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow max-w-5xl rounded-full mx-auto w-full bg-white relative z-50">
      {/* Logo */}
     <img
  src={logo}
  alt="Logo"
  className="h-14 w-auto object-contain"  // ✅ Increase height from h-10 to h-14 or h-16
/>


      {/* Nav Menu */}
      <nav
        id="menu"
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-full ${
          menuOpen ? 'max-md:w-full' : 'max-md:w-0'
        } transition-[width] bg-white/50 backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-normal`}
      >
        <a className="hover:text-indigo-600" href="#">Learning</a>
        <a className="hover:text-indigo-600" href="#">Solo practice</a>
        <a className="hover:text-indigo-600" href="#">Pricing</a>
        <a className="hover:text-indigo-600" href="#">Invite Friends</a>

        {/* Close Menu Button */}
        <button
          id="closeMenu"
          onClick={() => setMenuOpen(false)}
          className="md:hidden text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      {/* Right Buttons */}
      <div className="flex items-center space-x-4">
        {/* Circle Icon */}
        <button className="size-8 flex items-center justify-center hover:bg-gray-100 transition border border-slate-300 rounded-md">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 10.39a2.889 2.889 0 1 0 0-5.779 2.889 2.889 0 0 0 0 5.778M7.5 1v.722m0 11.556V14M1 7.5h.722m11.556 0h.723m-1.904-4.596-.511.51m-8.172 8.171-.51.511m-.001-9.192.51.51m8.173 8.171.51.511"
              stroke="#353535" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Signup Button */}
        <a className="hidden md:flex bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition" href="#">
          Sign up
        </a>

        {/* Open Menu Button */}
        <button
          id="openMenu"
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
