import React from 'react';
import { Shield } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  label: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-full bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 text-white shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 group z-[999999]"
      title={label}
    >
      <div className="relative">
        <Shield className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
      <span className="font-semibold text-sm tracking-wide bg-gradient-to-r from-blue-100 to-slate-200 bg-clip-text text-transparent group-hover:from-white group-hover:to-blue-200">
        {label}
      </span>
    </button>
  );
};

export default FloatingButton;
