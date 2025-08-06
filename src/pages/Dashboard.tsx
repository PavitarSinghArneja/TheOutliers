import React from 'react';
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

interface DashboardProps {
  onBack: () => void;
  onExploreTracks: () => void;
  onHome: () => void;
}

export function Dashboard({ onBack, onExploreTracks, onHome }: DashboardProps) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/assets/yourein.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Logo in top left */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={() => {
            console.log('Dashboard logo clicked, calling onHome');
            console.log('onHome function:', onHome);
            onHome();
          }} 
          className="cursor-pointer bg-transparent border-none p-1 hover:opacity-80 transition-opacity"
          style={{ outline: 'none' }}
        >
          <img src="/assets/imagetrans.png" alt="Logo" className="w-12 h-13 pointer-events-none" />
        </button>
      </div>
      
      {/* Bottom-aligned text on left side - matching App.tsx layout */}
      <div className="relative z-10 min-h-screen flex items-end justify-start px-12 pb-16">
        <div className="text-left max-w-md">
          <h1 className="text-9xl font-bold text-white mb-8 leading-tight">
            it's <br/> time!
          </h1>
          <div className="flex gap-4">
            <InteractiveHoverButton 
              className="px-6 py-3 text-sm font-medium"
              onClick={onExploreTracks}
            >
              explore tracks
            </InteractiveHoverButton>
          </div>
        </div>
      </div>
    </div>
  );
}