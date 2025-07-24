import React from 'react';

const Pricing = ({ theme = "light" }) => {
  return (
    <div className={`py-20 max-w-5xl mx-auto px-4 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
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
          background: conic-gradient(from 0deg, #00F5FF, #FF00C7, #FFD700, #00FF85, #8A2BE2, #00F5FF);
          background-size: 300% 300%;
          animation: shine 4s ease-out infinite;
        }

        .dark .button-bg-inner {
          background: #1f2937;
        }

        .light .button-bg-inner {
          background: #374151;
        }
      `}</style>

      <h1 className={`text-center text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}>
        Simple, Scalable Pricing
      </h1>
      <p className={`text-center md:text-lg mt-2 ${
        theme === "dark" ? "text-gray-300" : "text-gray-600"
      }`}>
        Start improving your typing speed today. Upgrade as your productivity grows.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mt-10">
        {/* Free Plan */}
        <PlanCard
          theme={theme}
          title="Free"
          price="$0/mo"
          description="Perfect for solo learners"
          features={[
            { text: '1 typing workspace', available: true },
            { text: 'Basic speed analytics', available: false },
            { text: 'Email support', available: true },
            { text: 'Team collaboration', available: false },
            { text: 'Priority assistance', available: false },
            { text: 'Cloud save & history', available: false },
          ]}
          button={
            <div className="button-bg rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100 w-full mt-6">
              <button className={`w-full text-sm py-2.5 text-white rounded-full font-medium ${
                theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-800 hover:bg-gray-700"
              }`}>
                Free
              </button>
            </div>
          }
        />

        {/* Pro Plan */}
        <PlanCard
          theme={theme}
          title="Pro"
          price="$79/mo"
          description="For growing teams & power users"
          popular={true}
          features={[
            { text: 'Unlimited typing workspaces', available: true },
            { text: 'Advanced speed & error analytics', available: true },
            { text: 'Email support', available: true },
            { text: 'Real-time team collaboration', available: true },
            { text: 'Priority support', available: false },
            { text: 'Unlimited cloud storage', available: false },
          ]}
          button={
            <div className="button-bg rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100 w-full mt-6">
              <button className={`w-full text-sm py-2.5 text-white rounded-full font-medium ${
                theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-800 hover:bg-gray-700"
              }`}>
                Pay for Pro
              </button>
            </div>
          }
        />

        {/* Enterprise Plan */}
        <PlanCard
          theme={theme}
          title="Enterprise"
          price="Contact us"
          description="Custom solutions for large teams"
          features={[
            { text: 'Unlimited workspaces & users', available: true },
            { text: 'Deep analytics dashboard', available: true },
            { text: 'Dedicated onboarding', available: true },
            { text: 'Live team collaboration', available: true },
            { text: '24/7 priority support', available: true },
            { text: 'Unlimited cloud history & exports', available: true },
          ]}
          button={
            <div className="button-bg rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100 w-full mt-6">
              <button className={`w-full text-sm py-2.5 text-white rounded-full font-medium ${
                theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-800 hover:bg-gray-700"
              }`}>
                Pay for Enterprise
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

const PlanCard = ({ theme, title, price, description, features, button, popular = false }) => (
  <div className={`rounded-2xl border p-6 flex flex-col justify-between relative transition-all duration-300 hover:shadow-xl ${
    theme === "dark" 
      ? `border-gray-700 ${popular ? "bg-gradient-to-br from-gray-800 to-gray-900 border-indigo-500 shadow-lg shadow-indigo-500/20" : "bg-gradient-to-br from-gray-800 to-gray-900"}`
      : `border-gray-200 ${popular ? "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-300 shadow-lg shadow-indigo-200/50" : "bg-gradient-to-br from-gray-50 to-gray-100"}`
  }`}>
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
          Most Popular
        </span>
      </div>
    )}
    
    <div className={`flex flex-col items-center border-b pb-6 ${
      theme === "dark" ? "border-gray-600" : "border-gray-300"
    }`}>
      <span className={`mb-6 text-lg font-semibold ${
        theme === "dark" ? "text-white" : "text-gray-800"
      }`}>
        {title}
      </span>
      <span className={`mb-3 text-4xl font-bold ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}>
        {price}
      </span>
      <span className={`text-center ${
        theme === "dark" ? "text-gray-300" : "text-gray-600"
      }`}>
        {description}
      </span>
    </div>
    
    <div className="space-y-4 py-9 flex-grow">
      {features.map((item, idx) => (
        <FeatureItem key={idx} theme={theme} text={item.text} available={item.available} />
      ))}
    </div>
    
    {button && <div className="mt-auto">{button}</div>}
  </div>
);

const FeatureItem = ({ theme, text, available }) => (
  <div className="flex items-center gap-3">
    <span
      className={`grid size-5 place-content-center rounded-full text-sm transition-colors ${
        available 
          ? 'bg-indigo-500 text-white shadow-sm' 
          : theme === "dark" 
            ? 'bg-gray-600 text-gray-400' 
            : 'bg-gray-200 text-gray-500'
      }`}
    >
      {available ? (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="1em"
          width="1em"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ) : (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="1em"
          width="1em"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      )}
    </span>
    <span className={`text-sm ${
      theme === "dark" ? "text-gray-300" : "text-gray-600"
    }`}>
      {text}
    </span>
  </div>
);

export default Pricing;