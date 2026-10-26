import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Sparkles,
  Brain,
  MessageSquare,
  Play,
  Zap,
  ArrowRight,
  Layers,
  Monitor,
  Database,
  ChevronDown,
  Download,
  Wand2,
  Grid,
  Menu,
  X,
} from 'lucide-react';

/* ─── Inline GitHub SVG ─── */
const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

interface LandingPageProps {
  onGetStarted: () => void;
}

/* ─── Example prompts for the interactive prompt box ─── */
const EXAMPLE_PROMPTS = [
  'Create a video explaining how neural networks learn',
  'Animate the Fibonacci sequence with golden spiral',
  'Visualize binary search on a sorted array',
  'Show Fourier series building a square wave',
  'Explain eigenvalues with geometric transformations',
];

/* ─── Feature showcase data ─── */
const FEATURES = [
  {
    title: 'Describe Anything',
    subtitle: 'Your words become animations',
    description:
      'Explain any mathematical concept, algorithm, or idea in plain English. Our AI instantly transforms your description into a beautiful, professional animation video.',
    icon: Brain,
    gradient: 'from-blue-500 to-cyan-400',
    bullets: [
      'Works with any math or science topic',
      'No technical knowledge required',
      'Handles complex multi-scene videos',
    ],
    videoSrc: '/demo_videos/demo1.mp4',
  },
  {
    title: 'Instant Video Output',
    subtitle: 'Ready in seconds, not hours',
    description:
      'Your animation is generated and rendered automatically in the cloud. No software to install, no waiting — watch your video play back instantly in the built-in player.',
    icon: Video,
    gradient: 'from-purple-500 to-pink-400',
    bullets: [
      'Cloud-rendered in seconds',
      'Built-in video player with full controls',
      'Download MP4 to share anywhere',
    ],
    videoSrc: '/demo_videos/demo2.mp4',
  },
  {
    title: 'Conversational Refinement',
    subtitle: 'Iterate and perfect through chat',
    description:
      'Not quite right? Just tell the AI what to change. Modify scenes, adjust timing, add elements, or take a completely new direction — all through natural conversation.',
    icon: MessageSquare,
    gradient: 'from-emerald-500 to-teal-400',
    bullets: [
      'Multi-turn conversation memory',
      'Refine animations with follow-up prompts',
      'Full history of every iteration',
    ],
    videoSrc: '/demo_videos/demo3.mp4',
  },
];

/* ─── How it works steps ─── */
const STEPS = [
  {
    num: '01',
    title: 'Describe Your Idea',
    desc: 'Type what you want to visualize — a concept, algorithm, equation, or any idea you want to bring to life as an animation.',
    icon: Wand2,
  },
  {
    num: '02',
    title: 'AI Creates Your Video',
    desc: 'Our AI understands your intent and automatically produces a polished, professional animation video — no manual work needed.',
    icon: Sparkles,
  },
  {
    num: '03',
    title: 'Watch & Download',
    desc: 'Play your animation instantly in the built-in player. Download the MP4 to share, or refine it with follow-up prompts.',
    icon: Download,
  },
];

/* ─── Stats row ─── */
const STATS = [
  { value: 'AI', label: 'Powered' },
  { value: '< 30s', label: 'Avg. Render Time' },
  { value: 'MP4', label: 'Export Format' },
  { value: '∞', label: 'Creative Possibilities' },
];

/* ─── Tech stack ─── */
const TECH = [
  { name: 'React', icon: Monitor, desc: 'Frontend' },
  { name: 'FastAPI', icon: Zap, desc: 'Backend' },
  { name: 'AI Engine', icon: Brain, desc: 'Generation' },
  { name: 'Renderer', icon: Video, desc: 'Video Output' },
  { name: 'MongoDB', icon: Database, desc: 'Storage' },
  { name: 'Vite', icon: Layers, desc: 'Tooling' },
];

/* ─── FAQ data ─── */
const FAQ = [
  {
    q: 'What kind of animations can I create?',
    a: 'Mathematical visualizations, algorithm walkthroughs, geometric transformations, graph theory, calculus, physics simulations, data structures — virtually any concept you can describe.',
  },
  {
    q: 'Do I need any technical knowledge?',
    a: 'Not at all! Just describe what you want in plain English. The AI handles everything behind the scenes and delivers a finished video.',
  },
  {
    q: 'How long does it take to get a video?',
    a: 'Most animations are ready in under 30 seconds. Complex multi-scene videos may take slightly longer.',
  },
  {
    q: 'Can I download the generated videos?',
    a: 'Yes! Every video can be downloaded as an MP4 file directly from the built-in player — share it anywhere.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. All conversations and videos are tied to your authenticated account with industry-standard encryption and security.',
  },
];

/* ─── FAQ Accordion Item ─── */
const FaqItem: React.FC<{ item: (typeof FAQ)[0]; idx: number }> = ({ item, idx }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.06 }}
      className="border-b border-white/[0.06]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 sm:py-6 text-left group"
      >
        <span className="text-sm sm:text-base font-semibold text-slate-200 pr-6 group-hover:text-white transition-colors">
          {item.q}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180 text-[#38bdf8]' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 sm:pb-6 text-xs sm:text-sm leading-relaxed text-slate-400">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════
   LANDING PAGE COMPONENT
   ════════════════════════════════════════════════════════════ */
export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const [promptValue, setPromptValue] = useState('');
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cycle example prompts
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActivePromptIdx((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020813] text-white selection:bg-[#38bdf8]/30">
      {/* ─── Cosmic Starry Space Background Canvas ─── */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[750px] sm:h-[850px] overflow-hidden">
        {/* Deep starry space gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#010610] via-[#00172e] to-[#020813]" />

        {/* Nebulae flares & galaxy ambient glows */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 h-[500px] sm:h-[700px] w-[600px] sm:w-[1000px] rounded-full bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-purple-600/10 blur-[120px] sm:blur-[160px]" />
        <div className="absolute top-[200px] right-[-100px] h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-amber-500/10 blur-[140px] sm:blur-[180px]" />

        {/* Rocket fiery trajectory light trail across night sky */}
        <div className="absolute top-[80px] right-[-50px] w-[400px] sm:w-[600px] h-[250px] sm:h-[350px] pointer-events-none opacity-80">
          <div className="w-full h-full bg-gradient-to-tr from-amber-500/0 via-amber-500/20 to-white/60 blur-[30px] rotate-[-25deg] transform translate-y-12" />
        </div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/0 via-[#020813]/60 to-[#020813]" />
      </div>

      {/* ═══════════ NAVBAR ═══════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4 sm:py-5 lg:px-10"
      >
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#00406c] border border-[#005a96] shadow-lg shadow-[#00406c]/30">
            <Video className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight font-outfit text-white">
            Animo<span className="text-[#38bdf8]">Concepto</span>
          </span>
        </Link>

        {/* Center: Desktop MPA Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <Link to="/features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link to="/blog" className="hover:text-white transition-colors">
            Blog
          </Link>
          <Link to="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
        </div>

        {/* Right: Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="https://github.com/Priyesh1311421/AnimoConcepto"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-[#002e4e] bg-[#001a2c] text-slate-300 transition-colors hover:text-white hover:border-[#00406c]"
            title="GitHub Repository"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <button
            onClick={() => navigate('/auth')}
            className="hidden xs:inline-flex rounded-full border border-[#002e4e] bg-[#001a2c] px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-300 transition-all hover:bg-[#00253e] hover:text-white"
          >
            Login
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/auth')}
            className="rounded-full bg-[#00406c] border border-[#005a96] px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-bold shadow-lg shadow-[#00406c]/30 transition-all hover:bg-[#005a96]"
          >
            Sign up free
          </motion.button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-[#002e4e] bg-[#001a2c] text-slate-300 hover:text-white transition-colors"
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {/* ─── Mobile Navigation Drawer Overlay ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="relative z-30 border-b border-[#002e4e] bg-[#001424]/95 backdrop-blur-xl px-6 py-6 md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 hover:text-[#38bdf8] transition-colors py-1"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 hover:text-[#38bdf8] transition-colors py-1"
              >
                Pricing
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 hover:text-[#38bdf8] transition-colors py-1"
              >
                Blog
              </Link>
              <Link
                to="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 hover:text-[#38bdf8] transition-colors py-1"
              >
                Docs
              </Link>
              <div className="pt-3 border-t border-[#002e4e] flex items-center justify-between">
                <a
                  href="https://github.com/Priyesh1311421/AnimoConcepto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth');
                  }}
                  className="rounded-full border border-[#002e4e] bg-[#001a2c] px-4 py-1.5 text-xs font-semibold text-slate-300"
                >
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16 pb-20 sm:pb-24 lg:px-12 md:pt-24 md:pb-32">
        <div className="max-w-3xl text-left">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.1] sm:leading-[1.05] tracking-tight font-outfit text-white break-words"
          >
            Animation
            <br />
            generation at
            <br />
            <span className="bg-gradient-to-r from-white via-sky-200 to-[#38bdf8] bg-clip-text text-transparent">
              your fingertips
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-300 font-normal"
          >
            Create breathtaking animations with AI that understands your vision.
            No design skills needed—just describe what you imagine and
            watch it come to life.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth')}
              className="flex items-center justify-center gap-2.5 rounded-xl bg-[#00406c] hover:bg-[#005a96] border border-[#005a96] px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-[#00406c]/40 transition-all text-center"
            >
              <Grid className="h-4.5 w-4.5 text-[#38bdf8]" />
              <span>Try for free</span>
            </motion.button>

            <Link
              to="/docs"
              className="flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base font-semibold text-slate-300 hover:text-white transition-colors group py-2"
            >
              <span>Read Documentation</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>

          {/* Interactive Prompt Box */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 sm:mt-14 max-w-xl w-full"
          >
            <div className="relative flex items-center rounded-2xl border border-[#002e4e] bg-[#001a2c]/90 p-1.5 sm:p-2 backdrop-blur-md shadow-2xl">
              <input
                type="text"
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                placeholder={EXAMPLE_PROMPTS[activePromptIdx]}
                className="flex-1 bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none font-medium min-w-0"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-[#00406c] hover:bg-[#005a96] border border-[#005a96] px-3.5 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white transition-colors shrink-0"
              >
                <span>Generate</span>
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#38bdf8]" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ STATS ROW ═══════════ */}
      <section className="relative z-10 border-y border-[#002e4e] bg-[#001a2c]/40">
        <div className="mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-[#002e4e]">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center py-6 sm:py-10 px-3 sm:px-4"
            >
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit md:text-4xl text-white">
                {stat.value}
              </span>
              <span className="mt-1 sm:mt-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400 text-center">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURE SECTIONS (alternating) ═══════════ */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 lg:px-10 space-y-16 sm:space-y-24 md:space-y-32">
        {FEATURES.map((feat, idx) => {
          const isReversed = idx % 2 !== 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col gap-8 sm:gap-12 lg:flex-row lg:items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Text side */}
              <div className="flex-1 space-y-4 sm:space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#00253e] border border-[#002e4e] shadow-lg shrink-0">
                    <feat.icon className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#38bdf8]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                    {feat.subtitle}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit md:text-4xl lg:text-[2.75rem] leading-tight">
                  {feat.title}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-400 max-w-lg">
                  {feat.description}
                </p>
                <ul className="space-y-2 sm:space-y-2.5 pt-1 sm:pt-2">
                  {feat.bullets.map((bullet, bi) => (
                    <li key={bi} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onGetStarted}
                  className="mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-full border border-[#002e4e] bg-[#001a2c] px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#38bdf8] transition-all hover:bg-[#00253e] hover:border-[#00406c]"
                >
                  <span>Create now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>

              {/* Visual side — real video preview card */}
              <div className="flex-1 flex justify-center w-full">
                <div className="relative w-full max-w-md aspect-video rounded-2xl border border-[#002e4e] bg-[#001a2c] shadow-2xl shadow-black/60 overflow-hidden group">
                  <video
                    src={feat.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-contain bg-black"
                  />
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#002e4e] bg-[#00111c]/80 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold text-[#38bdf8] backdrop-blur-md">
                    <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-[#38bdf8]" />
                    <span>Live AI Video Preview</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="relative z-10 border-y border-[#002e4e] bg-[#001a2c]/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit md:text-5xl">
              How it works
            </h2>
            <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
              Three simple steps from idea to animation video.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border border-[#002e4e] bg-[#001a2c] p-6 sm:p-8 transition-all duration-300 hover:border-[#00406c] hover:bg-[#002137]"
              >
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white/[0.1] font-outfit group-hover:text-[#38bdf8]/30 transition-colors">
                    {step.num}
                  </span>
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#00253e] border border-[#002e4e] group-hover:border-[#00406c] transition-all">
                    <step.icon className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-slate-400 group-hover:text-[#38bdf8] transition-colors" />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-outfit">{step.title}</h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TECH STACK ═══════════ */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 lg:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit md:text-4xl">
            Built with modern tools
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {TECH.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-2 sm:gap-3 rounded-xl border border-[#002e4e] bg-[#001a2c] p-4 sm:p-6 transition-all hover:border-[#00406c] hover:bg-[#002137]"
            >
              <tech.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#38bdf8]" />
              <span className="text-xs sm:text-sm font-bold text-white font-outfit text-center">{tech.name}</span>
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-slate-400 text-center">
                {tech.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ FAQ ACCORDION ═══════════ */}
      <section className="relative z-10 border-t border-[#002e4e] bg-[#001a2c]/20 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit md:text-4xl">
              Frequently asked questions
            </h2>
          </motion.div>

          <div>
            {FAQ.map((item, idx) => (
              <FaqItem key={idx} item={item} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#002e4e] bg-gradient-to-br from-[#00253e] to-[#00111c] p-8 sm:p-14 md:p-20 text-center shadow-2xl">
          <div className="pointer-events-none absolute top-0 right-0 h-60 w-60 rounded-full bg-[#00406c]/30 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-60 w-60 rounded-full bg-[#002e4e]/30 blur-[100px]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit md:text-5xl">
              Start creating animations
              <br />
              <span className="text-[#38bdf8]">with AI today</span>
            </h2>
            <p className="mx-auto mt-4 sm:mt-5 max-w-md text-slate-400 text-sm sm:text-base">
              Join AnimoConcepto and turn your mathematical ideas into stunning visual animations in seconds.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={onGetStarted}
                className="rounded-full bg-[#00406c] border border-[#005a96] px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-bold shadow-xl shadow-[#00406c]/40 transition-all hover:bg-[#005a96]"
              >
                Create now — It's free
              </motion.button>
              <a
                href="https://github.com/Priyesh1311421/AnimoConcepto"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-slate-300 transition-all hover:bg-white/[0.06] hover:text-white"
                >
                  <GithubIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                  <span>View on GitHub</span>
                </motion.div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative z-10 border-t border-[#002e4e] bg-[#00111c] px-4 sm:px-6 py-8 sm:py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:gap-5 md:flex-row text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00406c] border border-[#005a96]">
              <Video className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-400 font-outfit">
              Animo<span className="text-slate-300">Concepto</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AnimoConcepto · Built with React, FastAPI, Manim & Gemini AI
          </p>
          <a
            href="https://github.com/Priyesh1311421/AnimoConcepto"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-white"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
