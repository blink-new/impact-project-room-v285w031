import React from 'react';
import { Leaf } from 'lucide-react';

interface SharedHeaderProps {
  onNavigateToHome: () => void;
  title?: string;
  children?: React.ReactNode;
}

const SharedHeader: React.FC<SharedHeaderProps> = ({ onNavigateToHome, title, children }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* KickImpact Logo - Always on the left */}
        <button 
          onClick={onNavigateToHome}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/kickimpact-logo.png" 
            alt="KickImpact Logo" 
            className="h-12 w-auto object-contain"
          />
          <span className="text-xl font-bold text-[#243D66]">
            Kick<span className="text-[#D97A45]">Impact</span>
          </span>
        </button>

        {/* Title */}
        {title && (
          <h1 className="text-2xl font-bold text-[#243D66] flex-1 text-center">
            {title}
          </h1>
        )}

        {/* Additional content (buttons, etc.) */}
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
    </header>
  );
};

export default SharedHeader;