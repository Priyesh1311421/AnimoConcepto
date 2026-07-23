import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Newspaper, Video, Sparkles } from 'lucide-react';

export const BlogPage: React.FC = () => {
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
            <Newspaper className="h-3.5 w-3.5" />
            <span>Latest Articles & Articles</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-outfit">
            AnimoConcepto Blog
          </h1>
          <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto">
            Insights on AI animation generation, mathematical visualization, and education technology.
          </p>
        </motion.div>

        {/* Blog Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              date: 'July 22, 2026',
              category: 'AI & Machine Learning',
              title: 'How Gemini 2.0 Generates Executable Manim Code',
              excerpt: 'An inside look at prompt engineering and strict AST validation pipelines for generating error-free Python animations.',
            },
            {
              date: 'July 18, 2026',
              category: 'Education Technology',
              title: 'Visualizing Complex Calculus in 30 Seconds',
              excerpt: 'Why mathematical animations double student retention rates compared to static textbook diagrams.',
            },
            {
              date: 'July 10, 2026',
              category: 'Product Updates',
              title: 'Introducing Multi-Turn Conversational Animation Refinement',
              excerpt: 'Iterate on your videos through continuous conversation — change colors, timing, and object bounds dynamically.',
            },
            {
              date: 'June 28, 2026',
              category: 'Community Showcase',
              title: 'Top 10 Mathematical Visualizations Created This Month',
              excerpt: 'From Fourier series to transformer attention maps, explore the best community generated videos.',
            },
          ].map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-[#002e4e] bg-[#001a2c] p-8 shadow-xl hover:border-[#00406c] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-bold text-[#38bdf8] uppercase tracking-wider">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white font-outfit mb-3">{post.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{post.excerpt}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#002e4e] flex items-center gap-1 text-xs font-bold text-[#38bdf8]">
                <span>Read Full Article</span>
                <span>→</span>
              </div>
            </motion.article>
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
