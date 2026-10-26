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
            onClick={() => navigate('/auth')}
            className="rounded-full bg-[#00406c] hover:bg-[#005a96] border border-[#005a96] px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs font-bold text-white shadow-lg shadow-[#00406c]/30 transition-all shrink-0"
          >
            Try for free
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#002e4e] bg-[#001a2c] px-3.5 sm:px-4 py-1.5 text-xs text-[#38bdf8] mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Documentation & Guides</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-outfit leading-tight">
            AnimoConcepto Documentation
          </h1>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Learn how to write effective prompts, understand the animation engine, and integrate exported Manim scripts.
          </p>
        </motion.div>

        {/* Doc Sections */}
        <div className="space-y-4 sm:space-y-8">
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
              className="rounded-2xl border border-[#002e4e] bg-[#001a2c] p-5 sm:p-8 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#00253e] border border-[#002e4e] text-[#38bdf8] shrink-0">
                  <sec.icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white font-outfit">{sec.title}</h3>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 sm:pl-13">{sec.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Back Home CTA */}
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
