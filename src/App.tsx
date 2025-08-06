import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tracks } from './pages/Tracks';
import { ThemeProvider } from './components/ThemeProvider';
import { WebhookNotifications } from './components/WebhookNotifications';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const totalPages = 8; // Total number of knowmore images

  // Check for existing session on app load
  useEffect(() => {
    const savedSession = localStorage.getItem('outliersSession');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        if (sessionData.isLoggedIn && sessionData.timestamp) {
          // Check if session is still valid (24 hours)
          const sessionAge = Date.now() - sessionData.timestamp;
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          if (sessionAge < twentyFourHours) {
            setIsLoggedIn(true);
            // If user was on dashboard and we're on home, redirect them there
            if (sessionData.lastPage === 'dashboard' && location.pathname === '/') {
              navigate('/dashboard');
            }
          } else {
            // Session expired, clear it
            localStorage.removeItem('outliersSession');
          }
        }
      } catch (error) {
        // Invalid session data, clear it
        localStorage.removeItem('outliersSession');
      }
    }
  }, [location.pathname, navigate]);

  // Save session to localStorage
  const saveSession = (loggedIn: boolean, page?: string) => {
    if (loggedIn) {
      const sessionData = {
        isLoggedIn: true,
        timestamp: Date.now(),
        lastPage: page || location.pathname.substring(1) || 'home'
      };
      localStorage.setItem('outliersSession', JSON.stringify(sessionData));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('outliersSession');
      setIsLoggedIn(false);
    }
  };

  // Handle navigation to home while preserving session
  const handleHomeNavigation = () => {
    console.log('handleHomeNavigation called, isLoggedIn:', isLoggedIn);
    if (isLoggedIn) {
      // Save current session but navigate to home
      saveSession(true, 'home');
    }
    console.log('Navigating to home page');
    navigate('/');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.5
  };

  // Home page component
  const HomePage = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen flex"
      >
          {/* Logo in top left */}
          <div className="absolute top-6 left-6 z-10">
            <img src="/assets/image2.png" alt="Logo" className="w-12 h-13" />
          </div>
          
          {/* Left side - Dark with content */}
          <div className="w-1/3 bg-black flex items-end justify-start px-6 pb-16">
            <div className="text-left max-w-md">
              {/* Main Heading */}
              <h1 className="text-5xl font-bold text-white mb-8 leading-tight">
                hi, this is <br/> The Outliers.
              </h1>
              
              {/* Subtitle/Body Text */}
              <p className="text-md text-gray-300 mb-12 leading-relaxed">
               this is where the boldest biology students come to play, solve, and stand out. where biology meets ideas, innovation, and imagination. <button onClick={() => setShowPdfModal(true)} className="text-white underline hover:opacity-80 transition-opacity duration-200 bg-transparent border-none cursor-pointer">know more...</button>
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        saveSession(true, 'dashboard');
                        navigate('/dashboard');
                      }}
                      className="px-6 py-3 text-sm font-medium transition-colors duration-200 text-white hover:opacity-90"
                      style={{ backgroundColor: '#C08CF1' }}
                    >
                      go to dashboard
                    </button>
                    <button
                      onClick={() => {
                        saveSession(false);
                        navigate('/');
                      }}
                      className="border border-white text-white px-6 py-3 text-sm font-medium hover:bg-white hover:text-black transition-colors duration-200"
                    >
                      logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/registration')}
                      className="px-6 py-3 text-sm font-medium transition-colors duration-200 text-white hover:opacity-90"
                      style={{ backgroundColor: '#C08CF1' }}
                    >
                      ready to join
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="border border-white text-white px-6 py-3 text-sm font-medium hover:bg-white hover:text-black transition-colors duration-200"
                    >
                      login
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Right side - Colorful background */}
          <div className="w-2/3 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src="/assets/home.jpg" 
                alt="Background" 
                className="w-full h-full object-cover"
              />
              {/* Optional overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );

  return (
    <ThemeProvider defaultTheme="dark">
      <WebhookNotifications />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={
          <AnimatePresence mode="wait">
            <motion.div
              key="registration"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Registration 
                onBack={() => navigate('/')} 
                onHome={handleHomeNavigation}
                onSuccess={() => {
                  // Add notification
                  if ((window as any).addWebhookNotification) {
                    (window as any).addWebhookNotification('registration');
                  }
                  // Don't auto-redirect anymore, let user choose via button
                }}
                onLoginRedirect={() => navigate('/login')}
              />
            </motion.div>
          </AnimatePresence>
        } />
        <Route path="/login" element={
          <AnimatePresence mode="wait">
            <motion.div
              key="login"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Login 
                onBack={() => navigate('/')}
                onHome={handleHomeNavigation}
                onSuccess={() => {
                  // Add notification
                  if ((window as any).addWebhookNotification) {
                    (window as any).addWebhookNotification('login');
                  }
                  // Save session and redirect to dashboard
                  saveSession(true, 'dashboard');
                  navigate('/dashboard');
                }}
              />
            </motion.div>
          </AnimatePresence>
        } />
        <Route path="/dashboard" element={
          <AnimatePresence mode="wait">
            <motion.div
              key="dashboard"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Dashboard 
                onBack={() => navigate('/')} 
                onHome={() => {
                  console.log('Dashboard onHome called, navigating to home');
                  handleHomeNavigation();
                }}
                onExploreTracks={() => {
                  saveSession(true, 'tracks');
                  navigate('/tracks');
                }}
              />
            </motion.div>
          </AnimatePresence>
        } />
        <Route path="/tracks" element={
          <AnimatePresence mode="wait">
            <motion.div
              key="tracks"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Tracks 
                onBack={() => navigate('/')} 
                onHome={handleHomeNavigation}
              />
            </motion.div>
          </AnimatePresence>
        } />
      </Routes>
      
      {/* Slideshow Modal */}
      <AnimatePresence>
        {showPdfModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Left Navigation Button - Outside slideshow */}
            <button
              onClick={() => setCurrentPdfPage(Math.max(1, currentPdfPage - 1))}
              disabled={currentPdfPage <= 1}
              className="absolute left-[5%] top-1/2 transform -translate-y-1/2 z-30 text-white hover:text-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200 text-5xl font-bold drop-shadow-lg"
            >
              &lt;
            </button>
            
            {/* Right Navigation Button - Outside slideshow */}
            <button
              onClick={() => setCurrentPdfPage(Math.min(totalPages, currentPdfPage + 1))}
              disabled={currentPdfPage >= totalPages}
              className="absolute right-[5%] top-1/2 transform -translate-y-1/2 z-30 text-white hover:text-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200 text-5xl font-bold drop-shadow-lg"
            >
              &gt;
            </button>

            {/* Close Button - Outside slideshow, diagonal center */}
            <button
              onClick={() => setShowPdfModal(false)}
              className="absolute top-[5%] right-[5%] z-30 text-white hover:text-gray-300 transition-colors duration-200 text-5xl font-bold drop-shadow-lg"
            >
              ×
            </button>

            {/* Modal Content - 80% of page */}
            <motion.div 
              className="relative w-[80%] h-[80%] bg-black overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              
              {/* Image Viewer Container - No padding, full space */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Image Content Area - Full Space */}
                <img
                  src={`/assets/knowmore/${currentPdfPage}.jpg`}
                  alt={`Know More - Page ${currentPdfPage}`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Page Info */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                Page {currentPdfPage} of {totalPages}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;