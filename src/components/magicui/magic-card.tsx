import React, { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className,
  gradientColor = "#262626",
}) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mounted) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className={cn("relative overflow-hidden rounded-lg border bg-background", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-background",
        "before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500",
        "before:bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),_var(--gradient-color),transparent_40%)]",
        "hover:before:opacity-100",
        className
      )}
      style={{
        "--gradient-color": gradientColor,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};