import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ChevronDown, Copy, Check } from 'lucide-react';

interface CodeViewerProps {
  code: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/5 bg-[#121222]/80 backdrop-blur-sm">
      {/* Header Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors duration-200"
      >
        <div className="flex items-center gap-2.5 text-slate-300">
          <Code2 className="h-4.5 w-4.5 text-brand-400" />
          <span className="text-xs font-semibold uppercase tracking-wider font-outfit">Show Manim Script</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-500"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      {/* Code Container Accordion */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="relative p-4">
              {/* Copy button overlay */}
              <button
                onClick={handleCopy}
                className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900 hover:border-brand-500/40 transition-all"
                title="Copy Script"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>

              {/* Code display */}
              <pre className="max-h-80 overflow-y-auto rounded-lg bg-black/40 p-4 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
                <code className="block select-text whitespace-pre overflow-x-auto">{code}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
