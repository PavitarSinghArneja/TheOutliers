import React from "react";
import { cn } from "@/lib/utils";

interface PulsatingButtonProps {
  children: React.ReactNode;
  className?: string;
  pulseColor?: string;
  duration?: string;
  onClick?: () => void;
}

export const PulsatingButton: React.FC<PulsatingButtonProps> = ({
  children,
  className,
  pulseColor = "#C08CF1",
  duration = "1.5s",
  onClick,
}) => {
  return (
    <button
      className={cn(
        "relative text-center cursor-pointer flex justify-center items-center rounded-md text-white px-6 py-3 font-medium border-2",
        className,
      )}
      style={{
        borderColor: pulseColor,
        backgroundColor: 'transparent',
      }}
      onClick={onClick}
    >
      <div className="relative z-10">{children}</div>
      {/* Subtle pulsating ring */}
      <div
        className="absolute inset-0 rounded-md opacity-20"
        style={{
          backgroundColor: pulseColor,
          animation: `pulse-ring 2s ease-in-out infinite`,
        }}
      />
    </button>
  );
};