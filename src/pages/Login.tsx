import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/magicui/magic-card";
import { Meteors } from "@/components/magicui/meteors";
import { useTheme } from "@/components/ThemeProvider";

interface LoginProps {
  onBack: () => void;
  onSuccess: () => void;
  onHome: () => void;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

interface WebhookResponse {
  data: any;
}

export function Login({ onBack, onSuccess, onHome }: LoginProps) {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const response = await fetch('https://tavs.app.n8n.cloud/webhook/bf9c8b45-6f1a-4024-b173-a6ccc01aa34f', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const contentType = response.headers.get('Content-Type');
          let responseData;
          
          if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
          } else {
            responseData = await response.text();
          }
          
          console.log('Login response:', responseData);
          
          // Check if login is successful based on webhook response
          // Expected format: [{"login": "true"}]
          let loginSuccessful = false;
          
          if (Array.isArray(responseData) && responseData.length > 0 && responseData[0] && responseData[0].login === "true") {
            loginSuccessful = true;
          } else if (typeof responseData === 'string') {
            // Try to parse as JSON if it's a string
            try {
              const parsed = JSON.parse(responseData);
              if (Array.isArray(parsed) && parsed.length > 0 && parsed[0] && parsed[0].login === "true") {
                loginSuccessful = true;
              }
            } catch (e) {
              // Parsing failed, login is not successful
              loginSuccessful = false;
            }
          }
          
          if (loginSuccessful) {
            // Login successful - call success callback to trigger notification and redirect
            if (onSuccess) {
              onSuccess();
            }
            
            // Reset form after successful login
            setFormData({
              email: '',
              password: ''
            });
          } else {
            // Login failed - show notification for wrong email/password combination
            if ((window as any).addWebhookNotification) {
              (window as any).addWebhookNotification('error');
            }
          }
        } else {
          const errorData = await response.text();
          console.error('Login failed:', errorData);
          alert('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please check your connection and try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const closeModal = () => {
    setShowResponse(false);
    setWebhookResponse(null);
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 md:px-8 lg:px-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Meteors number={30} />
      </div>
      
      {/* Success Modal */}
      {showResponse && webhookResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-sm md:max-w-md">
            <MagicCard
              gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
              className="p-0 transform transition-all duration-500 ease-out scale-100 opacity-100"
            >
              <div className="p-4 md:p-8 text-center">
                {/* Success Icon */}
                <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                  Login Successful!
                </h2>
                
                {/* Webhook Response Section */}
                <div className="bg-gray-800/50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <p className="text-gray-300 text-xs md:text-sm mb-2">Server Response:</p>
                  <div className="bg-gray-900/50 rounded px-2 md:px-3 py-2 text-left">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto break-all">
                      {typeof webhookResponse.data === 'string' 
                        ? webhookResponse.data 
                        : JSON.stringify(webhookResponse.data, null, 2)
                      }
                    </pre>
                  </div>
                </div>
                
                {/* Close Button */}
                <Button 
                  onClick={closeModal}
                  className="w-full text-white hover:opacity-90 text-sm md:text-base"
                  style={{ backgroundColor: '#C08CF1' }}
                >
                  Continue
                </Button>
              </div>
            </MagicCard>
          </div>
        </div>
      )}
      
      {/* Logo in top left */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
        <button onClick={onHome} className="cursor-pointer">
          <img src="/assets/image2.png" alt="Logo" className="w-10 h-11 md:w-12 md:h-13" />
        </button>
      </div>
      
      {/* Centered form */}
      <div className="w-full max-w-xs sm:max-w-sm">
        <Card className="p-0 shadow-none border-none">
          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-0"
          >
            <CardHeader className="border-b border-border p-4 md:p-6">
              <CardTitle className="text-white text-lg md:text-xl">Login</CardTitle>
              <CardDescription className="text-gray-300 text-sm md:text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-white">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="p-4 md:p-6 border-t border-border">
              <Button 
                type="submit" 
                className="w-full text-white hover:opacity-90 disabled:opacity-50 text-sm md:text-base"
                style={{ backgroundColor: '#C08CF1' }}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </CardFooter>
          </MagicCard>
        </Card>
      </div>
    </div>
  );
}