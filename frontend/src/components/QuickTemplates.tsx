import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Binary, RefreshCw, Orbit } from 'lucide-react';

interface QuickTemplatesProps {
  onSelectPrompt: (prompt: string) => void;
}

const TEMPLATES = [
  {
    title: 'Explain LLMs',
    description: 'Create an animation explaining embeddings, transformers, or text tokens.',
    prompt: 'create a video to explain llms',
    icon: Brain,
    color: 'border-[#002e4e] bg-[#001a2c] text-[#38bdf8] hover:border-[#00406c]',
  },
  {
    title: 'Binary Search Visualizer',
    description: 'Animate target comparison and pointer bounds division.',
    prompt: 'create a video to visualize binary search index narrowing on a sorted array',
    icon: Binary,
    color: 'border-[#002e4e] bg-[#001a2c] text-[#38bdf8] hover:border-[#00406c]',
  },
  {
    title: 'Fourier Series Circles',
    description: 'Animate multiple rotating vectors drawing a complex wave.',
    prompt: 'create a video demonstrating fourier series sum of rotating vector circles drawing a square wave',
    icon: RefreshCw,
    color: 'border-[#002e4e] bg-[#001a2c] text-[#38bdf8] hover:border-[#00406c]',
  },
  {
    title: 'Linear Transformation',
    description: 'Visualize matrix grid warping, translation, and vector transformation.',
    prompt: 'create a video showing linear transformation of a 2D grid space scaling and rotating basis vectors',
    icon: Orbit,
    color: 'border-[#002e4e] bg-[#001a2c] text-[#38bdf8] hover:border-[#00406c]',
  },
];

export const QuickTemplates: React.FC<QuickTemplatesProps> = ({ onSelectPrompt }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-12 flex flex-col justify-center min-h-full">
      <div className="text-center mb-6 sm:mb-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#002e4e] bg-[#001a2c] px-3.5 sm:px-4 py-1.5 text-xs text-[#38bdf8] mb-3 sm:mb-4"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Select a starter prompt below</span>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-sky-100 to-[#38bdf8] bg-clip-text text-transparent font-outfit">
          What would you like to animate?
        </h2>
        <p className="mt-2 text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
          Describe the mathematical concept or algorithm, and our engine will code and render the animation using Manim.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((tmpl, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPrompt(tmpl.prompt)}
            className={`flex items-start gap-4 rounded-2xl border bg-gradient-to-br p-5 text-left transition-all duration-300 ${tmpl.color} hover:bg-white/[0.02]`}
          >
            <div className="rounded-xl bg-black/20 p-3 shrink-0">
              <tmpl.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">{tmpl.title}</h3>
              <p className="mt-1 text-slate-400 text-xs leading-relaxed">{tmpl.description}</p>
              <div className="mt-3.5 inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider opacity-60 hover:opacity-100">
                <span>Try prompt</span>
                <span className="text-xs">→</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
