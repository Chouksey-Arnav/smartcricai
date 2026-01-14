import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const handleLogout = () => {
    base44.auth.logout();
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', action: () => navigate('/Profile') },
        { icon: Bell, label: 'Notifications', action: () => {} },
      ]
    },
    {
      title: 'App',
      items: [
        { icon: Shield, label: 'Privacy', action: () => {} },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <Header title="Settings" showSettings={false} />

      <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-bold text-xl">{user?.full_name || 'User'}</h2>
              <p className="text-emerald-100 text-sm">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-3 bg-slate-50 border-b">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                {section.title}
              </h3>
            </div>
            <div className="divide-y">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-800">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full h-14 bg-red-500 hover:bg-red-600 text-lg"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>

        <p className="text-center text-xs text-slate-400">
          App Version 1.0.0
        </p>
      </div>
    </div>
  );
}