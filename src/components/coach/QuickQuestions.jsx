import React from 'react';
import { motion } from 'framer-motion';

const quickQuestions = [
  "How do I improve my batting stance?",
  "Tips for bowling swing?",
  "How to catch better?",
  "Pre-match warm up routine?",
  "How to stay focused while batting?",
  "Best drills for beginners?",
];

export default function QuickQuestions({ onSelect }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500 font-medium">Quick questions:</p>
      <div className="flex flex-wrap gap-2">
        {quickQuestions.map((question, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(question)}
            className="px-3 py-2 bg-white border border-emerald-200 rounded-full text-sm text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            {question}
          </motion.button>
        ))}
      </div>
    </div>
  );
}