import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Video, MessageSquare, Zap, Shield, Sparkles, Wand2, Download } from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#00111c] text-white selection:bg-[#38bdf8]/30 relative overflow-x-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-[#00406c]/[0.2] blur-[150px]" />

      {/* Header with Back Button */}
      <header className="relative z-20 border-b border-[#002e4e] bg-[#001a2c]/80 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#002e4e] bg-[#00111c] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-300 transition-all hover:bg-[#002137] hover:text-white hover:border-[#00406c] shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#38bdf8]" />
            <span className="hidden xs:inline">Back to Home</span>
            <span className="xs:hidden">Home</span>
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#00406c] border border-[#005a96] shrink-0">
              <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight font-outfit">
              Animo<span className="text-[#38bdf8]">Concepto</span>
            </span>
          </Link>

          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="rounded-full bg-[#00406c] hover:bg-[#005a96] border border-[#005a96] px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs font-bold text-white shadow-lg shadow-[#00406c]/30 transition-all shrink-0"
          >
            Try for free
          </button>
        </div>
      </header>

      {/* Hero Header */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#002e4e] bg-[#001a2c] px-3.5 sm:px-4 py-1.5 text-xs text-[#38bdf8] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-outfit leading-tight">
            Everything you need to create
            <br />
            <span className="text-[#38bdf8]">stunning AI animations</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Discover the full suite of features designed to turn complex concepts into professional mathematical videos effortlessly.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: 'Natural Language to Video',
              desc: 'Describe any algorithm, calculus theorem, or data structure in simple terms. Our AI handles script writing and rendering.',
              icon: Wand2,
            },
            {
              title: 'Instant Cloud Rendering',
              desc: 'High-performance cloud rendering outputs crisp 1080p MP4 videos in seconds without stressing your local GPU.',
              icon: Zap,
            },
            {
              title: 'Multi-turn Conversation',
              desc: 'Refine timing, add labels, modify colors, or add scenes through simple follow-up chat messages.',
              icon: MessageSquare,
            },
            {
              title: 'Code Visibility & Export',
              desc: 'Inspect the generated Python script powering your animation and export full high-res MP4 files for presentations.',
              icon: Download,
            },
            {
              title: 'Pre-built Templates',
              desc: 'Explore a library of ready-to-render templates for LLMs, Fourier series, binary search, and matrix algebra.',
              icon: Brain,
            },
            {
              title: 'Secure Account Vault',
              desc: 'Your history, prompt logs, and generated videos are securely saved in your personal account.',
              icon: Shield,
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-[#002e4e] bg-[#001a2c] p-5 sm:p-6 shadow-xl hover:border-[#00406c] transition-all"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#00253e] border border-[#002e4e] mb-4 sm:mb-5 text-[#38bdf8]">
                <f.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-outfit mb-2">{f.title}</h3>
              <p className="text-xs leading-relaxed text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Back Home CTA Footer */}
        <div className="mt-14 sm:mt-20 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full border border-[#002e4e] bg-[#001a2c] px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-300 hover:bg-[#00253e] hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4 text-[#38bdf8]" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </main>
    </div>
  );
};
