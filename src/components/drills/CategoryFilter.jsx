import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', label: 'All', emoji: '🏏' },
  { id: 'batting', label: 'Batting', emoji: '🏏' },
  { id: 'bowling', label: 'Bowling', emoji: '🎯' },
  { id: 'fielding', label: 'Fielding', emoji: '🧤' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
];

export default function CategoryFilter({ selected, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef(null);

  const selectedIndex = categories.findIndex(cat => cat.id === selected);

  useEffect(() => {
    if (sliderRef.current && selectedIndex >= 0) {
      const slider = sliderRef.current;
      const itemWidth = slider.scrollWidth / categories.length;
      slider.scrollTo({ left: itemWidth * selectedIndex - (slider.clientWidth / 2) + (itemWidth / 2), behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(cat.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 shrink-0",
            selected === cat.id
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          <span>{cat.emoji}</span>
          <span className="text-sm font-medium">{cat.label}</span>
        </motion.button>
      ))}
    </div>
  );
}