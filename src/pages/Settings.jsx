import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, LogOut, ChevronRight, Moon, Sun, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { createPageUrl } from '@/utils';
import toast from 'react-hot-toast';

export default function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1 = warn, 2 = confirm email
  const [deleteEmailInput, setDeleteEmailInput] = useState('');

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
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
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
  });

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleDeleteAccount = async () => {
    if (deleteStep === 1) {
      setDeleteStep(2);
      return;
    }
    // Step 2: verify email matches
    if (user?.email && deleteEmailInput.trim().toLowerCase() !== user.email.toLowerCase()) {
      toast.error('Email does not match. Please try again.');
      return;
    }
    try {
      await base44.auth.deleteUser();
      toast.success('Account deleted successfully');
      setShowDeleteConfirm(false);
      setTimeout(() => {
        base44.auth.logout();
      }, 1000);
    } catch (error) {
      toast.error('Failed to delete account. Please try again or contact support.');
      setShowDeleteConfirm(false);
    }
  };

  const handleCloseDeleteDialog = (open) => {
    if (!open) {
      setDeleteStep(1);
      setDeleteEmailInput('');
    }
    setShowDeleteConfirm(open);
  };

  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', action: () => setShowProfile(true) },
        { icon: Bell, label: 'Notifications', action: () => toast('Notifications coming soon!') },
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 pb-24">
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
              <h2 className="font-bold text-xl">{user?.full_name || 'Guest User'}</h2>
              <p className="text-emerald-100 text-sm">{user?.email || 'Not logged in'}</p>
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
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-700 border-b dark:border-slate-600">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide">
                {section.title}
              </h3>
            </div>
            <div className="divide-y dark:divide-slate-700">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                    </div>
                    {item.isToggle ? (
                      <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                    ) : (
                      <button onClick={item.action}>
                        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-50 dark:bg-red-950 rounded-3xl shadow-xl overflow-hidden border-2 border-red-200 dark:border-red-800"
        >
          <div className="px-6 py-3 bg-red-100 dark:bg-red-900 border-b border-red-200 dark:border-red-800">
            <h3 className="font-bold text-red-700 dark:text-red-300 text-sm uppercase tracking-wide">
              Danger Zone
            </h3>
          </div>
          <div className="p-6">
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              className="w-full h-12 bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Account
            </Button>
          </div>
        </motion.div>

        {/* Logout */}
        {user && (
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full h-14 bg-red-500 hover:bg-red-600 text-lg"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        )}

        <p className="text-center text-xs text-slate-400">
          SmartCrick AI • Version 1.0.0
        </p>
      </div>

      {/* Delete Account Confirmation — Multi-Step */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={handleCloseDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              {deleteStep === 1 ? 'Delete Account?' : 'Confirm Account Deletion'}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                {deleteStep === 1 ? (
                  <>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      ⚠️ This action is <strong>permanent and irreversible.</strong>
                    </p>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                      <li>All your XP, streaks, and progress will be deleted</li>
                      <li>All your saved workouts and drills will be removed</li>
                      <li>Your leaderboard ranking will disappear</li>
                      <li>Your mental training history will be erased</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">
                      To confirm, please type your email address:
                      <strong className="block text-slate-800 dark:text-white mt-1">{user?.email}</strong>
                    </p>
                    <input
                      type="email"
                      value={deleteEmailInput}
                      onChange={(e) => setDeleteEmailInput(e.target.value)}
                      placeholder="Enter your email to confirm"
                      aria-label="Confirm your email to delete account"
                      className="w-full px-4 py-3 border-2 border-red-300 rounded-xl text-sm focus:outline-none focus:border-red-500 dark:bg-slate-800 dark:text-white"
                    />
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel aria-label="Cancel account deletion">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 min-h-[44px]"
              aria-label={deleteStep === 1 ? 'Continue to confirm deletion' : 'Permanently delete my account'}
            >
              {deleteStep === 1 ? 'Continue →' : 'Delete My Account Forever'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Privacy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Everything you say and do in Smart Cricket AI is always saved to personalize your experience, 
              but your data is private and is <strong>never used by anyone else</strong>. We respect your privacy 
              and keep all your training data secure and confidential.
            </p>
          </div>
          <Button onClick={() => setShowPrivacy(false)}>
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      {/* Profile Settings Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Name</label>
              <p className="text-slate-800 dark:text-slate-200 font-semibold">{user?.full_name || 'Guest'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Email</label>
              <p className="text-slate-600 dark:text-slate-400">{user?.email || 'Not logged in'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Account Type</label>
              <p className="text-slate-600 dark:text-slate-400 capitalize">{user?.role || 'Guest'}</p>
            </div>
            {user && (
              <Button onClick={() => {
                setShowProfile(false);
                navigate(createPageUrl('Profile'));
              }} className="w-full">
                View Full Profile
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}