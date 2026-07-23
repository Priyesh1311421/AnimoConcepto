import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Code2, Video, Sparkles, Terminal, FileCode } from 'lucide-react';

export const DocsPage: React.FC = () => {
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

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#002e4e] bg-[#001a2c] px-4 py-1.5 text-xs text-[#38bdf8] mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Documentation & Guides</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-outfit">
            AnimoConcepto Documentation
          </h1>
          <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto">
            Learn how to write effective prompts, understand the animation engine, and integrate exported Manim scripts.
          </p>
        </motion.div>

        {/* Doc Sections */}
        <div className="space-y-8">
          {[
            {
              title: '1. Prompting Best Practices',
              icon: Sparkles,
              content:
                'Be specific about mathematical shapes, transformations, and timing. For example: "Create a 2D scene with a blue circle scaling to radius 2 over 3 seconds, followed by a label text saying Radius = 2".',
            },
            {
              title: '2. Multi-turn Iteration',
              icon: Terminal,
              content:
                'Your prompt history is preserved in each conversation. You can send follow-up messages like "Change the circle color to yellow" or "Add a title text at the top", and the AI will refactor the existing scene code accordingly.',
            },
            {
              title: '3. Manim Community Edition Compatibility',
              icon: Code2,
              content:
                'Generated scripts use standard Manim Community Edition syntax. All scenes subclass GeneratedScene(Scene) and construct inside construct(self).',
            },
            {
              title: '4. Video Formats & Quality',
              icon: FileCode,
              content:
                'Renders are output as MP4 files encoded with h264 codec at 480p/720p/1080p resolutions, ready for download or presentation embedding.',
            },
          ].map((sec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-[#002e4e] bg-[#001a2c] p-8 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00253e] border border-[#002e4e] text-[#38bdf8]">
                  <sec.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white font-outfit">{sec.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 pl-13">{sec.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Back Home CTA */}
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
