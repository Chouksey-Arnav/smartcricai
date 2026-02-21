import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const PULL_THRESHOLD = 80;

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (isRefreshing || window.scrollY > 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;
    
    if (distance > 0 && distance < 150) {
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      
      try {
        await onRefresh();
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 500);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 flex items-center justify-center"
            style={{ height: `${Math.min(pullDistance, 80)}px` }}
          >
            <div className="bg-emerald-500 rounded-full p-2">
              <RefreshCw 
                className={cn(
                  "w-5 h-5 text-white",
                  (isRefreshing || pullDistance > PULL_THRESHOLD) && "animate-spin"
                )} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div style={{ transform: `translateY(${pullDistance}px)`, transition: isRefreshing ? 'none' : 'transform 0.2s' }}>
        {children}
      </div>
    </div>
  );
}