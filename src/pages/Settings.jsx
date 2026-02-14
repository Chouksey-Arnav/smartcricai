import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, LogOut, ChevronRight, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
        { icon: User, label: 'Profile Settings', action: () => setShowProfileSettings(true) },
        { icon: Bell, label: 'Notifications', action: () => {} },
      ]
    },
    {
      title: 'App',
      items: [
        { icon: Shield, label: 'Privacy', action: () => setShowPrivacy(true) },
        { icon: darkMode ? Sun : Moon, label: 'Dark Mode', action: 'toggle', isToggle: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 pb-24">
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
                  <div
                    key={index}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-800">{item.label}</span>
                    </div>
                    {item.isToggle ? (
                      <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                    ) : (
                      <button onClick={item.action}>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </button>
                    )}
                  </div>
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

      {/* Privacy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p>
              <strong>Your Data is Safe:</strong> Everything you input, save, and track in this app stays private and is stored securely.
            </p>
            <p>
              <strong>Not Shared:</strong> Your personal training data, progress, and statistics are never shared with third parties or other users.
            </p>
            <p>
              <strong>Your Control:</strong> You have full control over your data and can delete your account and all associated data anytime.
            </p>
            <p>
              <strong>Secure Storage:</strong> All data is encrypted and stored using industry-standard security protocols.
            </p>
          </div>
          <Button onClick={() => setShowPrivacy(false)} className="w-full">
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      {/* Profile Settings Dialog */}
      <Dialog open={showProfileSettings} onOpenChange={setShowProfileSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <p className="text-slate-900 dark:text-white font-semibold">{user?.full_name || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <p className="text-slate-900 dark:text-white font-semibold">{user?.email || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
              <p className="text-slate-900 dark:text-white font-semibold capitalize">{user?.role || 'user'}</p>
            </div>
            <Button 
              onClick={() => {
                setShowProfileSettings(false);
                navigate(createPageUrl('Profile'));
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              View Full Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}