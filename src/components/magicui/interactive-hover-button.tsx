import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface InteractiveHoverButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const InteractiveHoverButton: React.FC<InteractiveHoverButtonProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <button
      className={cn(
        "group relative overflow-hidden rounded-full px-8 py-4 text-lg font-medium transition-all duration-500 ease-in-out",
        "border border-gray-300 bg-white text-black transition-colors duration-500 ease-in-out",
        "hover:bg-black hover:text-white hover:border-black",
        "flex items-center gap-2",
        className,
      )}
      onClick={onClick}
    >
      {/* Dot that appears before hover */}
      <div className="w-1.5 h-1.5 bg-black rounded-full group-hover:opacity-0 group-hover:scale-0 transition-all duration-300 ease-in-out" />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Arrow that appears on hover */}
      <ArrowRight className="w-4 h-4 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out transform translate-x-2 group-hover:translate-x-0" />
    </button>
  );
};