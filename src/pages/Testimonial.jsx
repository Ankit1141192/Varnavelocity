import React from 'react';

const testimonials = [
  {
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=600',
    quote: '“I learned touch typing on Varnavelocity and improved my speed tremendously!”',
    author: 'Rahul Sharma',
    role: 'Learned on Varnavelocity',
    speed: '72 WPM',
    accuracy: '98%',
  },
 
  {
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&auto=format&fit=crop',
    quote: '“Varnavelocity helped me become one of the fastest typists in my class!”',
      author: 'Sneha Verma',
    role: 'Learned on Varnavelocity',
    speed: '85 WPM',
    accuracy: '96%',
   
  },
   {
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600',
    quote: '“Thanks to Varnavelocity, I now type faster and with more confidence.”',
    author: 'Aman Gupta',
    role: 'Learned on Varnavelocity',
    speed: '90 WPM',
    accuracy: '99%',
  }
];

function Testimonial() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 font-[Poppins]">
      {testimonials.map((t, index) => (
        <div key={index} className="max-w-80 bg-black text-white rounded-2xl overflow-hidden">
          <div className="relative">
            <img
              src={t.image}
              alt="testimonial"
              className="h-[270px] w-full object-cover object-top rounded-2xl hover:scale-105 transition-all duration-300"
            />
            <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>
          <div className="px-4 pb-4">
            <p className="font-medium border-b border-gray-600 pb-5">{t.quote}</p>
            <p className="mt-4 font-semibold">— {t.author}</p>
            <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#E0724A] to-[#9938CA] text-transparent bg-clip-text">
              {t.role}
            </p>
            <p className="text-sm mt-1">Speed: <span className="text-green-400">{t.speed}</span></p>
            <p className="text-sm">Accuracy: <span className="text-blue-400">{t.accuracy}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Testimonial;
