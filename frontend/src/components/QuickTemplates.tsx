import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Binary, RefreshCw, Orbit, ArrowUpRight, Sparkles } from 'lucide-react';

interface QuickTemplatesProps {
  onSelectPrompt: (prompt: string) => void;
}

const TEMPLATES = [
  {
    category: 'Machine Learning',
    title: 'Explain Neural Networks',
    description: 'Animate input vectors flowing through weights and activation functions.',
    prompt: 'create a video to explain neural networks with input layers, weights, and activations',
    icon: Brain,
    badge: 'Popular',
  },
  {
    category: 'Computer Science',
    title: 'Binary Search Visualizer',
    description: 'Narrow down search interval pointers on a sorted list with midpoint highlights.',
    prompt: 'create a video to visualize binary search index narrowing on a sorted array',
    icon: Binary,
    badge: 'Algorithm',
  },
  {
    category: 'Applied Mathematics',
    title: 'Fourier Series Circles',
    description: 'Show orbiting vector epicycles constructively drawing a square wave.',
    prompt: 'create a video demonstrating fourier series sum of rotating vector circles drawing a square wave',
    icon: RefreshCw,
    badge: 'Math',
  },
  {
    category: 'Linear Algebra',
    title: '2D Matrix Transformation',
    description: 'Visualize basis vectors i-hat and j-hat warping the coordinate grid.',
    prompt: 'create a video showing linear transformation of a 2D grid space scaling and rotating basis vectors',
    icon: Orbit,
    badge: 'Geometry',
  },
];

export const QuickTemplates: React.FC<QuickTemplatesProps> = ({ onSelectPrompt }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-outfit">
            Starter Concepts & Templates
          </h3>
        </div>
        <span className="text-[11px] text-slate-500">Click to load</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TEMPLATES.map((tmpl, idx) => (
          <motion.button
            key={idx}
            whileHover={{ y: -2, borderColor: 'rgba(56, 189, 248, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPrompt(tmpl.prompt)}
            className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#0d1017] p-4 text-left transition-all duration-200 hover:bg-[#121622] hover:shadow-lg focus-visible:ring-1 focus-visible:ring-sky-500"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <tmpl.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                    {tmpl.category}
                  </span>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-medium text-slate-400">
                  {tmpl.badge}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors font-outfit">
                {tmpl.title}
              </h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                {tmpl.description}
              </p>
            </div>

            <div className="mt-3.5 flex items-center gap-1 text-[11px] font-semibold text-sky-400 opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Use template</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
