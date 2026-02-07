import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Trophy, Clock, ChevronRight } from 'lucide-react';
import Header from '@/components/common/Header';
import { cn } from '@/lib/utils';

const categoryConfig = {
  rules: { icon: BookOpen, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
  techniques: { icon: Brain, color: 'bg-emerald-500', bgColor: 'bg-emerald-50' },
  history: { icon: Clock, color: 'bg-amber-500', bgColor: 'bg-amber-50' },
  strategy: { icon: Trophy, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

export default function Quizzes() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => base44.entities.Quiz.list(),
  });

  const filteredQuizzes = quizzes.filter(q => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', 'rules', 'techniques', 'history', 'strategy'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      <Header title="Cricket Quizzes" showSettings={false} />
      
      <div className="px-6 py-4 max-w-lg mx-auto space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quizzes..."
            className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none"
          />
          <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Test Your Knowledge</h2>
              <p className="text-amber-100 text-sm">Learn while you play!</p>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all",
                selectedCategory === cat
                  ? "bg-amber-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600"
              )}
            >
              {cat === 'all' ? 'All Quizzes' : cat}
            </button>
          ))}
        </div>

        {/* Quiz List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No quizzes available yet.</p>
            </motion.div>
          ) : (
            filteredQuizzes.map((quiz, index) => {
              const config = categoryConfig[quiz.category] || categoryConfig.rules;
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(createPageUrl(`QuizPlayer?id=${quiz.id}`))}
                  className={cn(
                    "p-4 rounded-2xl border-2 cursor-pointer transition-all",
                    config.bgColor,
                    "border-transparent hover:border-slate-200"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                      config.color
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{quiz.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-slate-500">
                          {quiz.questions?.length || 0} questions
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                          difficultyColors[quiz.difficulty]
                        )}>
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-slate-400 self-center" />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}