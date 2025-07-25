import React from 'react';

const Testimonials = ({ theme = 'light' }) => {
   const cardsData = [
    {
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
      name: 'Briar Martin',
      handle: '@briartypes',
      date: 'April 20, 2025',
      quote: 'VernVelocity helped me improve my WPM by 30%. It’s sleek, fast, and motivating!'
    },
    {
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      name: 'Avery Johnson',
      handle: '@averywrites',
      date: 'May 10, 2025',
      quote: 'With VernVelocity, my accuracy skyrocketed. It’s the best typing platform I’ve used.'
    },
    {
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
      name: 'Jordan Lee',
      handle: '@jordantalks',
      date: 'June 5, 2025',
      quote: 'Perfect tool for anyone serious about improving their typing speed. Love the UI!'
    },
    {
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
      name: 'Taylor Brooks',
      handle: '@typetaylor',
      date: 'July 1, 2025',
      quote: 'Typing with VernVelocity feels like a game. It keeps me coming back every day.'
    },
  ];

  // Theme-based styles
  const themeStyles = {
    light: {
      background: 'bg-white',
      cardBackground: 'bg-white',
      text: 'text-gray-900',
      subText: 'text-slate-500',
      quoteText: 'text-gray-800',
      gradientLeft: 'bg-gradient-to-r from-white to-transparent',
      gradientRight: 'bg-gradient-to-l from-white to-transparent',
      shadow: 'shadow hover:shadow-lg'
    },
    dark: {
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800',
      text: 'text-gray-100',
      subText: 'text-gray-400',
      quoteText: 'text-gray-200',
      gradientLeft: 'bg-gradient-to-r from-gray-900 to-transparent',
      gradientRight: 'bg-gradient-to-l from-gray-900 to-transparent',
      shadow: 'shadow-lg hover:shadow-xl'
    }
  };

  const currentTheme = themeStyles[theme];

  const CreateCard = ({ card }) => (
    <div className={`p-4 rounded-lg mx-4 transition-all duration-200 w-72 shrink-0 ${currentTheme.cardBackground} ${currentTheme.shadow}`}>
      <div className="flex gap-2">
        <img className="size-11 rounded-full" src={card.image} alt={card.name} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className={`font-medium ${currentTheme.text}`}>{card.name}</p>
            <svg className="mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="#2196F3" />
            </svg>
          </div>
          <span className={`text-xs ${currentTheme.subText}`}>{card.handle}</span>
        </div>
      </div>
      <p className={`text-sm py-4 ${currentTheme.quoteText}`}>{card.quote}</p>
      <div className={`flex items-center justify-between text-xs ${currentTheme.subText}`}>
        <div className="flex items-center gap-1">
          <span>Posted on</span>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition-colors">
            <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
              <path d="m.027 0 4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0zM1.44.688h1.504l6.64 8.624H8.082z" fill="currentColor" />
            </svg>
          </a>
        </div>
        <p>{card.date}</p>
      </div>
    </div>
  );

  return (
    <div className={currentTheme.background}>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 25s linear infinite;
        }

        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>

      <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
        <div className={`absolute left-0 top-0 h-full w-20 z-10 pointer-events-none ${currentTheme.gradientLeft}`}></div>
        <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className={`absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none ${currentTheme.gradientRight}`}></div>
      </div>

      <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
        <div className={`absolute left-0 top-0 h-full w-20 z-10 pointer-events-none ${currentTheme.gradientLeft}`}></div>
        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className={`absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none ${currentTheme.gradientRight}`}></div>
      </div>
    </div>
  );
};

export default Testimonials;