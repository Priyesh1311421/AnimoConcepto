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
      <header className="relative z-20 border-b border-[#002e4e] bg-[#001a2c]/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-full border border-[#002e4e] bg-[#00111c] px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-[#002137] hover:text-white hover:border-[#00406c]"
          >
            <ArrowLeft className="h-4 w-4 text-[#38bdf8]" />
            <span>Back to Home</span>
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00406c] border border-[#005a96]">
              <Video className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight font-outfit">
              Animo<span className="text-[#38bdf8]">Concepto</span>
            </span>
          </Link>

          <button
            onClick={() => navigate('/auth')}
            className="rounded-full bg-[#00406c] hover:bg-[#005a96] border border-[#005a96] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#00406c]/30 transition-all"
          >
            Try for free
          </button>
        </div>
      </header>

      {/* Hero Header */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#002e4e] bg-[#001a2c] px-4 py-1.5 text-xs text-[#38bdf8] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-outfit">
            Everything you need to create
            <br />
            <span className="text-[#38bdf8]">stunning AI animations</span>
          </h1>
          <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto">
            Discover the full suite of features designed to turn complex concepts into professional mathematical videos effortlessly.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="rounded-2xl border border-[#002e4e] bg-[#001a2c] p-6 shadow-xl hover:border-[#00406c] transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00253e] border border-[#002e4e] mb-5 text-[#38bdf8]">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-outfit mb-2">{f.title}</h3>
              <p className="text-xs leading-relaxed text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Back Home CTA Footer */}
        <div className="mt-20 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full border border-[#002e4e] bg-[#001a2c] px-8 py-3.5 text-sm font-bold text-slate-300 hover:bg-[#00253e] hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4 text-[#38bdf8]" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </main>
    </div>
  );
};
