import React from 'react';
import logo from '../assets/logo1.png';

const Footer = ({ theme = "light" }) => {
  const isDarkMode = theme === "dark";

  return (
    <footer className={`px-6 md:px-16 lg:px-24 xl:px-32 w-full transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className={`flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-10 py-10 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        
        {/* Logo and Description Section */}
        <div className="flex flex-col items-start gap-4 max-w-sm lg:max-w-md">
          <img 
            src={logo} 
            alt="Typing Test Logo" 
            className="w-[150px] h-[105px] object-contain" 
          />
          <p className={`text-sm italic leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Just type at your own pace — no pressure! We'll calculate your true typing speed and accuracy automatically.
          </p>
          
          {/* Social Media Links */}
          <div className="flex gap-4 mt-2">
            {/* Twitter */}
            <a 
              href="#" 
              aria-label="Twitter"
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDarkMode 
                  ? 'hover:bg-gray-800' 
                  : 'hover:bg-blue-50'
              }`}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path 
                  d="M19.167 2.5a9.1 9.1 0 0 1-2.617 1.275 3.733 3.733 0 0 0-6.55 2.5v.833a8.88 8.88 0 0 1-7.5-3.775s-3.333 7.5 4.167 10.833a9.7 9.7 0 0 1-5.834 1.667C8.333 20 17.5 15.833 17.5 6.25q0-.35-.067-.692A6.43 6.43 0 0 0 19.167 2.5"
                  stroke={isDarkMode ? '#60A5FA' : '#2563EB'} 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </a>
            
            {/* GitHub */}
            <a 
              href="https://github.com/AnitBr17" 
              aria-label="GitHub"
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDarkMode 
                  ? 'hover:bg-gray-800' 
                  : 'hover:bg-gray-50'
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path 
                  d="M7.5 15.833c-4.167 1.25-4.167-2.084-5.833-2.5m11.666 5v-3.225a2.8 2.8 0 0 0-.783-2.175c2.616-.292 5.366-1.283 5.366-5.833a4.53 4.53 0 0 0-1.25-3.125 4.22 4.22 0 0 0-.075-3.142s-.983-.292-3.258 1.233a11.15 11.15 0 0 0-5.833 0C5.225.541 4.242.833 4.242.833a4.22 4.22 0 0 0-.075 3.142 4.53 4.53 0 0 0-1.25 3.15c0 4.516 2.75 5.508 5.366 5.833a2.8 2.8 0 0 0-.783 2.15v3.225"
                  stroke={isDarkMode ? '#60A5FA' : '#2563EB'} 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/anit-baranwal/" 
              aria-label="LinkedIn"
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDarkMode 
                  ? 'hover:bg-gray-800' 
                  : 'hover:bg-blue-50'
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path 
                  d="M13.333 6.667a5 5 0 0 1 5 5V17.5H15v-5.833a1.667 1.667 0 0 0-3.334 0V17.5H8.333v-5.833a5 5 0 0 1 5-5M5 7.5H1.667v10H5zM3.333 5a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"
                  stroke={isDarkMode ? '#60A5FA' : '#2563EB'} 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="w-full md:w-1/2 flex flex-wrap md:flex-nowrap justify-between gap-8 md:gap-0">
          <div>
            <h3 className={`font-semibold mb-4 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              RESOURCES
            </h3>
            <ul className={`text-sm space-y-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              <li>
                <a 
                  href="#" 
                  className={`transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:text-blue-400' 
                      : 'hover:text-blue-600'
                  }`}
                >
                  Learning
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:text-blue-400' 
                      : 'hover:text-blue-600'
                  }`}
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:text-blue-400' 
                      : 'hover:text-blue-600'
                  }`}
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:text-blue-400' 
                      : 'hover:text-blue-600'
                  }`}
                >
                  Community
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`font-semibold mb-4 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              COMPANY
            </h3>
            <ul className={`text-sm space-y-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              <li>
                <a 
                  href="#" 
                  className={`transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:text-blue-400' 
                      : 'hover:text-blue-600'
                  }`}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:text-blue-400' 
                      : 'hover:text-blue-600'
                  }`}
                >
                  Careers
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:text-blue-400' 
                      : 'hover:text-blue-600'
                  }`}
                >
                  Privacy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:text-blue-400' 
                      : 'hover:text-blue-600'
                  }`}
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className={`py-6 text-center -mx-6 md:-mx-16 lg:-mx-24 xl:-mx-32 mt-6 rounded-b-xl shadow-inner ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <p className={`text-sm md:text-base px-4 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          © 2025{' '}
          <a 
            href="#" 
            className={`font-medium hover:underline transition-all duration-200 ${
              isDarkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Varnavelocity
          </a>
          {' '}— Made with ❤️ by{' '}
          <a 
            href="#" 
            className={`font-semibold hover:underline transition-all duration-200 ${
              isDarkMode 
                ? 'text-purple-400 hover:text-purple-300' 
                : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            Ankit Kumar
          </a>
          {' '}and{' '}
          <a 
            href="#" 
            className={`font-semibold hover:underline transition-all duration-200 ${
              isDarkMode 
                ? 'text-purple-400 hover:text-purple-300' 
                : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            Anit Baranwal
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;