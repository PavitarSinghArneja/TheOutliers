import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TracksProps {
  onBack: () => void;
  onHome: () => void;
}

export function Tracks({ onBack, onHome }: TracksProps) {
  const [showImages, setShowImages] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Start the animation after component mounts
    const timer = setTimeout(() => {
      setShowImages(true);
    }, 500);

    // Check screen size
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Animation variants for dropping images
  const dropVariants = {
    hidden: { 
      y: -50, 
      opacity: 0,
      scale: 0.95
    },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.3,
        type: "tween",
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  // Track data with content for each track
  const trackImages = [
    { 
      id: 1, 
      title: "code red", 
      src: "tracks/red.jpeg",
      heading: "genetic espionage and bio-security",
      description: "discover the power of genes to shape the future",
      detail: "step into the shadowy world of genetic espionage, where DNA is both the weapon and the code to crack. from designer pathogens to bio-surveillance, students must decode threats and defend the future of humanity—one gene at a time."
    },
    { 
      id: 2, 
      title: "catalyst", 
      src: "tracks/blue.jpeg",
      heading: "designing health for a world on edge",
      description: "from idea to impact—design the future of preventive health",
      detail: "in a world racing to prevent the next crisis, students will prototype bold biotech and ai-driven solutions that keep people healthy before they fall sick. from gene-based diagnostics to predictive wearables, they’ll turn cutting-edge science into startup ideas that reimagine public health from the ground up."
    },
    { 
      id: 3, 
      title: "UNwell", 
      src: "tracks/yellow.jpeg",
      heading: "MUN-style simulation",
      description: "who controls the crisis—the people, or the profits?",
      detail: "from ultra-processed foods to addictive additives, delegates navigate a world where public health policy is quietly shaped by industry influence. students will debate regulations, confront lobbying, and rethink the balance between national welfare and global market power."
    },
    { 
      id: 4, 
      title: "grey matter", 
      src: "tracks/green.jpeg",
      heading: "ethics in a post-pandemic world",
      description: "the ethics of mandatory genomic surveillance in a post-pandemic world",
      detail: "in the aftermath of a global pandemic, the world turns to biotech to prevent the next one—but at what cost? students will debate sweeping policies like mandatory DNA screening, grappling with the ethical trade-offs between collective safety and personal freedom."
}];

  // Default content when no track is hovered
  const defaultContent = {
    heading: "choose the track that excites you.",
    description: "maybe you wanna build an app.",
    detail: "no idea is too big, or too small. we don't care if you're growing organs in the dish, or engineering glow in the dark bananas. <span className=\"text-white font-medium\">pursue your passions.</span>"
  };

  // Get current content based on hovered track
  const currentContent = hoveredTrack !== null 
    ? trackImages.find(track => track.id === hoveredTrack) || defaultContent
    : defaultContent;

  return (
    <div className="h-screen bg-black flex flex-col lg:flex-row relative overflow-hidden">
      {/* Logo in top left */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
        <button onClick={onHome} className="cursor-pointer">
          <img src="/assets/imagetrans.png" alt="Logo" className="w-10 h-11 md:w-12 md:h-13" />
        </button>
      </div>
      
      {/* Mobile: Text content at top - always shows default text */}
      <div className="lg:hidden bg-black px-4 py-4 pt-20 flex-1 flex items-center justify-start order-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-left max-w-lg w-full"
        >
          {/* Main heading */}
          <motion.h2 
            className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight"
            dangerouslySetInnerHTML={{ __html: defaultContent.heading }}
          />
          
          {/* Description text */}
          <motion.p 
            className="text-gray-300 text-sm md:text-base leading-relaxed mb-3"
          >
            {defaultContent.description}
          </motion.p>
          
          {/* Detail text */}
          <motion.p 
            className="text-gray-400 text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: defaultContent.detail }}
          />
        </motion.div>
      </div>

      {/* Mobile: Cropped image rows at bottom */}
      <div className="lg:hidden flex flex-col justify-end order-2 flex-shrink-0 pb-5">
        {trackImages.map((track, index) => {
          const isSelected = hoveredTrack === track.id;
          
          return (
            <motion.div
              key={track.id}
              custom={index}
              variants={dropVariants}
              initial="hidden"
              animate={showImages ? "visible" : "hidden"}
              className="relative cursor-pointer transition-all duration-500 ease-in-out overflow-hidden"
              style={{
                height: isSelected ? '300px' : '80px'
              }}
              onClick={() => setHoveredTrack(isSelected ? null : track.id)}
            >
              {/* Text overlay for expanded image - shows above the image */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="absolute top-0 left-0 right-0 z-10 bg-black/80 p-4 shadow-lg"
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="max-w-lg">
                    <h3 
                      className="text-white text-sm font-bold mb-1 leading-tight drop-shadow-md"
                      dangerouslySetInnerHTML={{ __html: track.heading }}
                    />
                    <p className="text-gray-300 text-xs leading-relaxed mb-1 drop-shadow-sm">
                      {track.description}
                    </p>
                    <p 
                      className="text-gray-400 text-xs leading-relaxed drop-shadow-sm"
                      dangerouslySetInnerHTML={{ __html: track.detail }}
                    />
                  </div>
                </motion.div>
              )}
              
              <motion.div
                className="w-full h-full relative"
                animate={{
                  scale: isSelected ? 1.02 : 1,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <img
                  src={track.src}
                  alt={track.title}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center center'
                  }}
                />
                
                {/* Overlay with title for non-selected items */}
                <motion.div 
                  className="absolute inset-0 bg-black/30 flex items-center justify-center"
                  animate={{
                    opacity: isSelected ? 0 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span 
                    className="text-white text-base font-bold tracking-wider text-center px-4"
                  >
                    {track.title}
                  </motion.span>
                </motion.div>
                
                {/* Selected overlay */}
                <motion.div 
                  className="absolute inset-0 bg-black/20"
                  animate={{
                    opacity: isSelected ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: Images in flex row */}
      <div className="hidden lg:flex flex-1 order-2">
        {trackImages.map((track, index) => {
          const isHovered = hoveredTrack === track.id;
          const isAnyHovered = hoveredTrack !== null;
          
          // Calculate flex basis for desktop - hovered track takes 60%, others share 40%
          let flexBasis = '25%'; // Default: each takes 25%
          if (isAnyHovered && isLargeScreen) {
            if (isHovered) {
              flexBasis = '60%'; // Hovered track takes 60%
            } else {
              flexBasis = '13.33%'; // Other tracks share remaining 40% (40/3 ≈ 13.33%)
            }
          }
          
          return (
            <motion.div
              key={track.id}
              custom={index}
              variants={dropVariants}
              initial="hidden"
              animate={showImages ? "visible" : "hidden"}
              className="relative group cursor-pointer transition-all duration-500 ease-in-out"
              style={{ 
                flexBasis: isLargeScreen ? flexBasis : 'auto'
              }}
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              {/* Image container */}
              <div className="h-screen overflow-hidden">
                <motion.img
                  src={track.src}
                  alt={track.title}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                
                {/* Overlay on hover */}
                <motion.div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span 
                    className="text-white text-2xl font-bold tracking-wider text-center px-4"
                    animate={{
                      scale: isHovered ? 1 : 0.8,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
                  >
                    {track.title}
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: Text content on right side */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center px-8 xl:px-16 order-3">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-left max-w-lg"
        >
          {/* Main heading */}
          <motion.h1 
            className="text-4xl xl:text-6xl font-bold text-white mb-8 leading-tight"
            key={hoveredTrack || 'default'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            dangerouslySetInnerHTML={{ __html: currentContent.heading }}
          />
          
          {/* Description text */}
          <motion.div 
            className="text-gray-300 text-lg leading-relaxed mb-8 space-y-1"
            key={`desc-${hoveredTrack || 'default'}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            <p>{currentContent.description}</p>
          </motion.div>
          
          {/* Bottom text */}
          <motion.p 
            className="text-gray-400 text-base leading-relaxed"
            key={`detail-${hoveredTrack || 'default'}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            dangerouslySetInnerHTML={{ __html: currentContent.detail }}
          />
        </motion.div>
      </div>
    </div>
  );
}