import React from 'react';

const Pricing = () => {
  return (
    <div className="py-20 max-w-5xl mx-auto px-4">
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
      `}</style>

      <h1 className="text-center text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
        Simple, Scalable Pricing
      </h1>
      <p className="text-center text-gray-400 md:text-lg mt-2">
        Start improving your typing speed today. Upgrade as your productivity grows.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mt-10">
        {/* Free Plan */}
        <PlanCard
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
              <button className="w-full text-sm py-2.5 text-white rounded-full font-medium bg-gray-800">
                Free
              </button>
            </div>
          }
        />

        {/* Pro Plan */}
        <PlanCard
          title="Pro"
          price="$79/mo"
          description="For growing teams & power users"
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
              <button className="w-full text-sm py-2.5 text-white rounded-full font-medium bg-gray-800">
                Pay for Pro
              </button>
            </div>
          }
        />

        {/* Enterprise Plan */}
        <PlanCard
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
              <button className="w-full text-sm py-2.5 text-white rounded-full font-medium bg-gray-800">
                Pay for Enterprise
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

const PlanCard = ({ title, price, description, features, button }) => (
  <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col justify-between">
    <div className="flex flex-col items-center border-b border-gray-300 pb-6">
      <span className="mb-6 text-gray-800">{title}</span>
      <span className="mb-3 text-4xl font-medium">{price}</span>
      <span className="text-gray-500 text-center">{description}</span>
    </div>
    <div className="space-y-4 py-9">
      {features.map((item, idx) => (
        <FeatureItem key={idx} text={item.text} available={item.available} />
      ))}
    </div>
    {button && <div className="mt-auto">{button}</div>}
  </div>
);

const FeatureItem = ({ text, available }) => (
  <div className="flex items-center gap-3">
    <span
      className={`grid size-5 place-content-center rounded-full text-sm ${
        available ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-600'
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
    <span className="text-sm text-gray-400">{text}</span>
  </div>
);

export default Pricing;
