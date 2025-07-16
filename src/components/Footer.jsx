import React from 'react';
import logo from '../assets/logo1.png';

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30">

   
        <div className="flex flex-col items-start gap-4 max-w-sm">
          <img src={logo} alt="Typing Test Logo" className="w-[150px] h-[105px] object-contain" />
          <p className="text-sm text-gray-600 italic">
            Just type at your own pace — no pressure! We'll calculate your true typing speed and accuracy automatically.
          </p>
          <div className="flex gap-3 mt-1">
            {/* Twitter */}
            <a href="#" aria-label="Twitter">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M19.167 2.5a9.1 9.1 0 0 1-2.617 1.275 3.733 3.733 0 0 0-6.55 2.5v.833a8.88 8.88 0 0 1-7.5-3.775s-3.333 7.5 4.167 10.833a9.7 9.7 0 0 1-5.834 1.667C8.333 20 17.5 15.833 17.5 6.25q0-.35-.067-.692A6.43 6.43 0 0 0 19.167 2.5"
                  stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* GitHub */}
            <a href="#" aria-label="GitHub">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M7.5 15.833c-4.167 1.25-4.167-2.084-5.833-2.5m11.666 5v-3.225a2.8 2.8 0 0 0-.783-2.175c2.616-.292 5.366-1.283 5.366-5.833a4.53 4.53 0 0 0-1.25-3.125 4.22 4.22 0 0 0-.075-3.142s-.983-.292-3.258 1.233a11.15 11.15 0 0 0-5.833 0C5.225.541 4.242.833 4.242.833a4.22 4.22 0 0 0-.075 3.142 4.53 4.53 0 0 0-1.25 3.15c0 4.516 2.75 5.508 5.366 5.833a2.8 2.8 0 0 0-.783 2.15v3.225"
                  stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M13.333 6.667a5 5 0 0 1 5 5V17.5H15v-5.833a1.667 1.667 0 0 0-3.334 0V17.5H8.333v-5.833a5 5 0 0 1 5-5M5 7.5H1.667v10H5zM3.333 5a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"
                  stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

       
        <div className="w-full md:w-1/2 flex flex-wrap md:flex-nowrap justify-between gap-8 md:gap-0">
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">RESOURCES</h2>
            <ul className="text-sm text-gray-500 space-y-2">
              <li><a href="#">Learning</a></li>
              <li><a href="#">Tutorials</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">COMPANY</h2>
            <ul className="text-sm text-gray-500 space-y-2">
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>

   
      <p className="py-4 text-center text-xs md:text-sm text-gray-500">
        Copyright 2025 © <a href="#" className="text-blue-600">Varnavelocity</a>. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
