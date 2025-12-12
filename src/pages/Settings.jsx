import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  User, 
  Shield,
  Trash2,
  LogOut,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Settings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [ageRange, setAgeRange] = useState('13-14');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (progress) {
      setDisplayName(progress.display_name || '');
      setSkillLevel(progress.skill_level || 'beginner');
      setAgeRange(progress.age_range || '13-14');
    } else if (user) {
      setDisplayName(user.full_name?.split(' ')[0] || '');
    }
  }, [progress, user]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!user?.email) return;

      const updateData = {
        display_name: displayName,
        skill_level: skillLevel,
        age_range: ageRange,
      };

      if (progress?.id) {
        await base44.entities.UserProgress.update(progress.id, updateData);
      } else {
        await base44.entities.UserProgress.create({
          user_email: user.email,
          ...updateData,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      toast.success('Settings saved!');
    },
  });

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-xl font-bold text-slate-800 mt-2">Settings</h1>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-slate-800">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your nickname"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="skillLevel">Skill Level</Label>
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - Just starting out</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Know the basics</SelectItem>
                  <SelectItem value="advanced">Advanced - Experienced player</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ageRange">Age Range</Label>
              <Select value={ageRange} onValueChange={setAgeRange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11-12">11-12 years</SelectItem>
                  <SelectItem value="13-14">13-14 years</SelectItem>
                  <SelectItem value="15+">15+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="w-full bg-emerald-500 hover:bg-emerald-600 mt-4"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Your Privacy</h3>
              <p className="text-sm text-blue-700">
                We only collect the information needed to track your progress. 
                Your data is safe and never shared with others.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-slate-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </motion.div>

        {/* App Info */}
        <div className="text-center text-sm text-slate-400 pt-4">
          <p>SmartCrick Coach v1.0</p>
          <p>Made with 🏏 for young cricketers</p>
        </div>
      </div>
    </div>
  );
}