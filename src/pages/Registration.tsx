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

interface RegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
  onLoginRedirect?: () => void;
  onHome: () => void;
}

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  college: string;
  course: string;
  city: string;
  age: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

interface WebhookResponse {
  data: any;
  password: string;
}

export function Registration({ onBack, onSuccess, onLoginRedirect, onHome }: RegistrationProps) {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsapp: '',
    linkedin: '',
    college: '',
    course: '',
    city: '',
    age: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Generate alphanumeric password
  const generatePassword = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // WhatsApp validation
    const phoneRegex = /^[+]?[\d\s-()]{10,}$/;
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!phoneRegex.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Please enter a valid phone number';
    }

    // LinkedIn validation
    if (!formData.linkedin.trim()) {
      newErrors.linkedin = 'LinkedIn profile is required';
    }

    // College validation
    if (!formData.college.trim()) {
      newErrors.college = 'College is required';
    }

    // Course validation
    if (!formData.course.trim()) {
      newErrors.course = 'Course is required';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // Age validation
    const age = parseInt(formData.age);
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(age) || age < 16 || age > 100) {
      newErrors.age = 'Please enter a valid age (16-100)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Generate password before sending
      const passwordToSend = generatePassword();
      const dataToSend = {
        ...formData,
        password: passwordToSend
      };

      try {
        const response = await fetch('https://pzon8n.app.n8n.cloud/webhook/a5bc2a96-fb8b-4dde-b7a0-d562b93fbd7d', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          const contentType = response.headers.get('Content-Type');
          let responseData;
          
          if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
          } else {
            responseData = await response.text();
          }
          
          console.log('Registration response:', responseData);
          
          // Check webhook response format: [{"new": "yes"/"no"}] or "Welcome to The Outliers <3" text
          let isNewUser = false;
          
          if (Array.isArray(responseData) && responseData.length > 0 && responseData[0] && responseData[0].new === "yes") {
            isNewUser = true;
          } else if (typeof responseData === 'string') {
            // Check if it's the welcome message
            if (responseData.includes("Welcome to The Outliers <3")) {
              isNewUser = true;
            } else {
              // Try to parse as JSON if it's a string
              try {
                const parsed = JSON.parse(responseData);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0] && parsed[0].new === "yes") {
                  isNewUser = true;
                }
              } catch (e) {
                // Parsing failed, treat as not new user
                isNewUser = false;
              }
            }
          }
          
          if (isNewUser) {
            // Registration successful - show modal with password
            setWebhookResponse({
              data: responseData,
              password: passwordToSend
            });
            setShowResponse(true);
            
            // Call success callback to trigger notification
            if (onSuccess) {
              onSuccess();
            }
          } else {
            // Email already registered - show warning notification
            if ((window as any).addWebhookNotification) {
              (window as any).addWebhookNotification('warning');
            }
          }
        } else {
          const errorData = await response.text();
          console.error('Registration failed:', errorData);
          alert('Registration failed. Please try again.');
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
    // Reset form after closing modal
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      linkedin: '',
      college: '',
      course: '',
      city: '',
      age: '',
      password: ''
    });
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-12 py-8 overflow-y-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Meteors number={30} />
      </div>
      
      {/* Success Modal */}
      {showResponse && webhookResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={closeModal} />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-md">
            <MagicCard
              gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
              className="p-0 border border-white/20"
            >
              <div className="p-6 text-center">
                {/* Success Icon */}
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                {/* Title */}
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#C08CF1' }}>
                  welcome to The Outliers
                </h2>
                
                {/* Success Message */}
                <p className="text-gray-300 text-sm mb-6">
                  you're officially part of something different.
                </p>
                
                {/* Password Section */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-4 mb-4 border border-white/10">
                  <p className="text-gray-300 text-sm mb-2">your permanent password:</p>
                  <div className="bg-black/50 rounded px-3 py-2 font-mono text-purple-400 text-lg tracking-wider border border-purple-500/30">
                    {webhookResponse.password}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">save this - you'll need it to login</p>
                </div>
                
                {/* Close Button */}
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => {
                      closeModal();
                      if (onLoginRedirect) {
                        onLoginRedirect();
                      }
                    }}
                    className="px-6 py-2 text-white hover:opacity-90 font-medium text-sm rounded-lg transition-all duration-200"
                    style={{ backgroundColor: '#C08CF1' }}
                  >
                    let's go
                  </Button>
                </div>
              </div>
            </MagicCard>
          </div>
        </div>
      )}
      
      {/* Logo in top left */}
      <div className="absolute top-6 left-6 z-10">
        <button onClick={onHome} className="cursor-pointer">
          <img src="/assets/image2.png" alt="Logo" className="w-12 h-13" />
        </button>
      </div>
      
      {/* Centered form */}
      <div className="w-full max-w-4xl mt-16">
        <Card className="p-0 shadow-none border-none">
          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-0"
          >
            <CardHeader className="border-b border-border p-6">
              <CardTitle className="text-white">Join The Outliers</CardTitle>
              <CardDescription className="text-gray-300">
                Fill in your details to become part of our community
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-white">Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                    </div>
                    
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
                  </div>
                  
                  {/* Row 2: WhatsApp and LinkedIn */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="whatsapp" className="text-white">WhatsApp Number *</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="+1234567890"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        className={errors.whatsapp ? 'border-red-500' : ''}
                      />
                      {errors.whatsapp && <span className="text-red-500 text-sm">{errors.whatsapp}</span>}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="linkedin" className="text-white">LinkedIn Profile *</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        className={errors.linkedin ? 'border-red-500' : ''}
                      />
                      {errors.linkedin && <span className="text-red-500 text-sm">{errors.linkedin}</span>}
                    </div>
                  </div>
                  
                  {/* Row 3: College and Course */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="college" className="text-white">College *</Label>
                      <Input
                        id="college"
                        type="text"
                        placeholder="Your college/university"
                        value={formData.college}
                        onChange={(e) => handleInputChange('college', e.target.value)}
                        className={errors.college ? 'border-red-500' : ''}
                      />
                      {errors.college && <span className="text-red-500 text-sm">{errors.college}</span>}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="course" className="text-white">Course *</Label>
                      <Input
                        id="course"
                        type="text"
                        placeholder="Your course/major"
                        value={formData.course}
                        onChange={(e) => handleInputChange('course', e.target.value)}
                        className={errors.course ? 'border-red-500' : ''}
                      />
                      {errors.course && <span className="text-red-500 text-sm">{errors.course}</span>}
                    </div>
                  </div>
                  
                  {/* Row 4: City and Age */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="city" className="text-white">City *</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Your city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="age" className="text-white">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className={errors.age ? 'border-red-500' : ''}
                      />
                      {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="p-6 border-t border-border">
              <div className="w-full space-y-3">
                <Button 
                  type="submit" 
                  className="w-full text-white hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#C08CF1' }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </Button>
                <Button 
                  type="button"
                  className="w-full text-white hover:opacity-90"
                  style={{ backgroundColor: '#C08CF1' }}
                  onClick={onLoginRedirect}
                >
                  Login Instead
                </Button>
              </div>
            </CardFooter>
          </MagicCard>
        </Card>
      </div>
    </div>
  );
}