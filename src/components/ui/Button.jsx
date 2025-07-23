// components/ui/Button.jsx
export default function Button({ children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-8 text-sm py-2.5 text-white rounded-full font-medium bg-gray-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
