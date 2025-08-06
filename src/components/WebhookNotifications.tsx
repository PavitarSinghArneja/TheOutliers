import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

interface WebhookItem {
  id: string;
  type: 'registration' | 'login' | 'warning' | 'error';
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
  data?: any;
}

interface WebhookNotificationsProps {
  className?: string;
  onAddNotification?: (notification: WebhookItem) => void;
}

const Notification = ({ name, description, icon, color, time, type }: WebhookItem) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[350px] cursor-pointer overflow-hidden rounded-2xl p-3",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white/10 backdrop-blur-md border border-white/20",
        "dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-8 items-center justify-center rounded-xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-sm">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-sm font-medium text-white">
            <span className="text-xs sm:text-sm">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-300">{time}</span>
          </figcaption>
          <p className="text-xs font-normal text-white/80">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function WebhookNotifications({ className }: WebhookNotificationsProps) {
  const [notifications, setNotifications] = useState<WebhookItem[]>([]);

  // Function to add new notification (will be called from parent components)
  const addNotification = (type: 'registration' | 'login' | 'warning' | 'error', data?: any) => {
    let name, description, icon, color;
    
    if (type === 'warning') {
      name = 'email registered';
      description = 'please login instead';
      icon = '⚠️';
      color = '#FF6B35';
    } else if (type === 'error') {
      name = 'login failed';
      description = 'wrong email, pass combination';
      icon = '⚠️';
      color = '#DC2626'; // Red color background
    } else {
      name = type === 'registration' ? 'user registered' : 'user logged in';
      description = type === 'registration' ? 'new member joined' : 'welcome back';
      icon = type === 'registration' ? '🎉' : '👋';
      color = '#1E86FF';
    }
    
    const newNotification: WebhookItem = {
      id: Date.now().toString(),
      type,
      name,
      description,
      icon,
      color,
      time: 'now',
      data
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep only last 5
    
    // Auto-remove this notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== newNotification.id));
    }, 5000);
  };

  // Expose the function globally so other components can use it
  useEffect(() => {
    (window as any).addWebhookNotification = addNotification;
    return () => {
      delete (window as any).addWebhookNotification;
    };
  }, []);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex h-auto w-[380px] flex-col overflow-hidden",
        className,
      )}
    >
      {notifications.map((item) => (
        <Notification {...item} key={item.id} />
      ))}
    </div>
  );
}