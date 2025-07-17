import React from 'react';

const Pricing = () => {
  return (
    <div className="py-20 max-w-5xl mx-auto px-4">
      <h1 className="text-center text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
        Simple, Scalable Pricing
      </h1>
      <p className="text-center text-gray-400 md:text-lg mt-2">
        Start improving your typing speed today. Upgrade as your productivity grows.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mt-10">
        {/* Free Plan */}
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="flex flex-col items-center border-b border-gray-300 pb-6">
            <span className="mb-6 text-gray-800">Free</span>
            <span className="mb-3 text-4xl font-medium">$0/mo</span>
            <span className="text-gray-500">Perfect for solo learners</span>
          </div>
          <div className="space-y-4 py-9">
            {[
              { text: '1 typing workspace', available: true },
              { text: 'Basic speed analytics', available: false },
              { text: 'Email support', available: true },
              { text: 'Team collaboration', available: false },
              { text: 'Priority assistance', available: false },
              { text: 'Cloud save & history', available: false },
            ].map((item, idx) => (
              <FeatureItem key={idx} text={item.text} available={item.available} />
            ))}
          </div>
        </div>

        {/* Pro Plan */}
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="flex flex-col items-center border-b border-gray-300 pb-6">
            <span className="mb-6 text-gray-800">Pro</span>
            <span className="mb-3 text-4xl font-medium">$79/mo</span>
            <span className="text-gray-500">For growing teams & power users</span>
          </div>
          <div className="space-y-4 py-9">
            {[
              { text: 'Unlimited typing workspaces', available: true },
              { text: 'Advanced speed & error analytics', available: true },
              { text: 'Email support', available: true },
              { text: 'Real-time team collaboration', available: true },
              { text: 'Priority support', available: false },
              { text: 'Unlimited cloud storage', available: false },
            ].map((item, idx) => (
              <FeatureItem key={idx} text={item.text} available={item.available} />
            ))}
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="flex flex-col items-center border-b border-gray-300 pb-6">
            <span className="mb-6 text-gray-800">Enterprise</span>
            <span className="mb-3 text-4xl font-medium">Contact us</span>
            <span className="text-gray-500">Custom solutions for large teams</span>
          </div>
          <div className="space-y-4 py-9">
            {[
              { text: 'Unlimited workspaces & users', available: true },
              { text: 'Deep analytics dashboard', available: true },
              { text: 'Dedicated onboarding', available: true },
              { text: 'Live team collaboration', available: true },
              { text: '24/7 priority support', available: true },
              { text: 'Unlimited cloud history & exports', available: true },
            ].map((item, idx) => (
              <FeatureItem key={idx} text={item.text} available={item.available} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature item component
const FeatureItem = ({ text, available }) => {
  return (
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
};

export default Pricing;
