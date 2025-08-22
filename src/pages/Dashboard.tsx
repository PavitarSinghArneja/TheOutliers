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
      {/* Background Image - Different for mobile vs desktop */}
      <div className="absolute inset-0">
        {/* Mobile Background - dash-mob image */}
        <img 
          src="/assets/dash-mob.jpeg" 
          alt="Background" 
          className="lg:hidden w-full h-full object-cover object-center"
        />
        
        {/* Desktop Background - yourein image focused on "outliers" text */}
        <img 
          src="/assets/yourein.png" 
          alt="Background" 
          className="hidden lg:block w-full h-full object-cover object-center"
          style={{ 
            objectPosition: 'center 40%',
            transform: 'scale(1.2)'
          }}
        />
      </div>
      
      {/* Logo in top left */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
        <button 
          onClick={() => {
            console.log('Dashboard logo clicked, calling onHome');
            console.log('onHome function:', onHome);
            onHome();
          }} 
          className="cursor-pointer bg-transparent border-none p-1 hover:opacity-80 transition-opacity"
          style={{ outline: 'none' }}
        >
          <img src="/assets/imagetrans.png" alt="Logo" className="w-10 h-11 md:w-12 md:h-13 pointer-events-none" />
        </button>
      </div>
      
      {/* Mobile: Text at bottom left */}
      <div className="lg:hidden relative z-10 h-screen flex flex-col">
        {/* Spacer to push content to bottom */}
        <div className="flex-1"></div>
        
        {/* Bottom left content */}
        <div className="px-4 pb-4 pt-4 flex-shrink-0">
          <div className="text-left max-w-md">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              it's <br/> time!
            </h1>
            <div className="flex justify-start">
              <InteractiveHoverButton 
                className="px-4 py-3 text-sm font-medium"
                onClick={onExploreTracks}
              >
                explore tracks
              </InteractiveHoverButton>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Original layout */}
      <div className="hidden lg:flex relative z-10 min-h-screen items-end justify-start px-12 pb-16">
        <div className="text-left max-w-md w-full">
          <h1 className="text-8xl xl:text-9xl font-bold text-white mb-8 leading-tight">
            it's <br/> time!
          </h1>
          <div className="flex justify-start">
            <InteractiveHoverButton 
              className="px-6 py-3 text-base font-medium"
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