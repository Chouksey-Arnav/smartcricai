import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ALL_MENTAL_ROUTINES } from '@/components/mental/MentalRoutinesData';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/common/Header';

export default function AdminSeedMentals() {
  const [seeding, setSeeding] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState([]);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const handleSeed = async () => {
    setSeeding(true);
    setLog([]);
    let count = 0;

    // First check what already exists
    const existing = await base44.entities.MentalRoutine.list('-created_date', 200);
    const existingTitles = new Set(existing.map(r => r.title));

    for (const routine of ALL_MENTAL_ROUTINES) {
      if (existingTitles.has(routine.title)) {
        setLog(prev => [...prev, `⏭ Skipped (exists): ${routine.title}`]);
        count++;
        setProgress(Math.round((count / ALL_MENTAL_ROUTINES.length) * 100));
        continue;
      }
      await base44.entities.MentalRoutine.create(routine);
      setLog(prev => [...prev, `✅ Created: ${routine.title}`]);
      count++;
      setProgress(Math.round((count / ALL_MENTAL_ROUTINES.length) * 100));
    }

    setDone(true);
    setSeeding(false);
  };

  const handleClearAndReseed = async () => {
    if (!confirm('This will delete ALL existing global mental routines and reseed. Continue?')) return;
    setSeeding(true);
    setLog(['Clearing existing routines...']);

    const existing = await base44.entities.MentalRoutine.list('-created_date', 200);
    const global = existing.filter(r => !r.created_by);
    for (const r of global) {
      await base44.entities.MentalRoutine.delete(r.id);
    }
    setLog(prev => [...prev, `Deleted ${global.length} routines. Reseeding...`]);

    let count = 0;
    for (const routine of ALL_MENTAL_ROUTINES) {
      await base44.entities.MentalRoutine.create(routine);
      count++;
      setProgress(Math.round((count / ALL_MENTAL_ROUTINES.length) * 100));
      setLog(prev => [...prev, `✅ ${routine.title}`]);
    }
    setDone(true);
    setSeeding(false);
  };

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-500">Admin only</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header title="Seed Mental Routines" />
      <div className="px-6 py-6 max-w-lg mx-auto space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-bold text-lg mb-2">Mental Routines Seeder</h2>
          <p className="text-slate-600 text-sm mb-4">Total routines in data: <strong>{ALL_MENTAL_ROUTINES.length}</strong></p>
          
          {progress > 0 && (
            <div className="mb-4">
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-slate-500 mt-1">{progress}%</p>
            </div>
          )}

          {done && <p className="text-emerald-600 font-bold mb-4">✅ All done! Go check Mental Training.</p>}

          <div className="flex gap-3">
            <Button onClick={handleSeed} disabled={seeding} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
              {seeding ? 'Seeding...' : 'Seed (Skip Existing)'}
            </Button>
            <Button onClick={handleClearAndReseed} disabled={seeding} variant="destructive" className="flex-1">
              Clear & Reseed All
            </Button>
          </div>
        </div>

        {log.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow max-h-96 overflow-y-auto">
            {log.map((l, i) => (
              <p key={i} className="text-xs text-slate-600 font-mono">{l}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}