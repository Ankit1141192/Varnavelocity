import React, { useState } from 'react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo1.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const navLinkStyle = ({ isActive }) =>
    `hover:text-indigo-600 transition ${
      isActive ? 'text-indigo-600 font-semibold' : 'text-gray-900'
    }`;

  return (
    <>
      {/* Shining animation styles */}
      <style>{`
        @keyframes shine {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .button-bg {
          background: conic-gradient(from 0deg, #00F5FF, #000, #000, #00F5FF, #000, #000, #000, #00F5FF);
          background-size: 300% 300%;
          animation: shine 6s ease-out infinite;
        }
      `}</style>

      <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow max-w-5xl rounded-full mx-auto w-full bg-white relative z-50">
        {/* Logo */}
        <img src={logo} alt="Logo" className="h-14 w-auto object-contain" />

        {/* Nav Menu */}
        <nav
          className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-full ${
            menuOpen ? 'max-md:w-full' : 'max-md:w-0'
          } transition-[width] bg-white/50 backdrop-blur flex-col md:flex-row flex gap-8 text-sm font-normal`}
        >
          <NavLink to="/typingtest" className={navLinkStyle}>
            Solo practice
          </NavLink>
          <NavLink to="/learning" className={navLinkStyle}>
            Learning
          </NavLink>
          <NavLink to="/pricing" className={navLinkStyle}>
            Pricing
          </NavLink>
          <NavLink to="/colloboration" className={navLinkStyle}>
            Invite Friends
          </NavLink>

          {/* Close Button for mobile */}
          <button onClick={() => setMenuOpen(false)} className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </nav>

        {/* Right-side buttons */}
        <div className="flex items-center space-x-4">
          {/* Icon */}
          <button className="size-8 flex items-center justify-center hover:bg-gray-100 transition border border-slate-300 rounded-md">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 10.39a2.889 2.889 0 1 0 0-5.779 2.889 2.889 0 0 0 0 5.778M7.5 1v.722m0 11.556V14M1 7.5h.722m11.556 0h.723m-1.904-4.596-.511.51m-8.172 8.171-.51.511m-.001-9.192.51.51m8.173 8.171.51.511"
                stroke="#353535" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Clerk Auth Buttons */}
          {user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div
              onClick={openSignIn}
              className="hidden md:flex button-bg rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100 cursor-pointer"
            >
              <button className="px-8 text-sm py-2.5 text-white rounded-full font-medium bg-gray-800">
                Login
              </button>
            </div>
          )}

          {/* Open Menu for mobile */}
          <button onClick={() => setMenuOpen(true)} className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
    </>
  );
};

export default Navbar;
