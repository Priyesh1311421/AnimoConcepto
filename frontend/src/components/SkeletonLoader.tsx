import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export const SkeletonLoader: React.FC = () => {
  const [step, setStep] = useState(0);

  // Simulate progress over time for the progress bar
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 3000),
      setTimeout(() => setStep(2), 7000),
      setTimeout(() => setStep(3), 15000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-xl backdrop-blur-sm">
      {/* Video Player Skeleton Placeholder */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900/60 border border-white/5 flex flex-col items-center justify-center">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" style={{ backgroundSize: '200% 100%' }} />
        
        {/* Pulsing play icon and circle */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 border border-brand-500/20 animate-pulse text-brand-400 shadow-lg shadow-brand-500/10">
            <Play className="h-6 w-6 fill-brand-400" />
          </div>
          <span className="text-xs font-medium text-slate-500 tracking-wider">generating the video</span>
        </div>

        {/* Bottom loading indicator */}
        <div className="absolute bottom-4 left-4 right-4 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ 
              width: step === 0 ? '25%' : step === 1 ? '55%' : step === 2 ? '85%' : '98%' 
            }}
            transition={{ duration: 4 }}
            className="h-full bg-gradient-to-r from-brand-500 to-indigo-400 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
