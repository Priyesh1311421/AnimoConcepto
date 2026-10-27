import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Video, Sparkles } from 'lucide-react';

export const PricingPage: React.FC = () => {
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
            <span>Simple Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-outfit leading-tight">
            Start creating videos for free
          </h1>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Choose a plan that fits your creation needs — no hidden fees or unexpected charges.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              name: 'Starter / Free',
              price: '$0',
              period: 'forever',
              desc: 'Perfect for exploring AI mathematical animation generation.',
              features: [
                'Unlimited AI prompt generations',
                'Fast 480p/720p MP4 rendering',
                'Standard cloud queue priority',
                'Built-in video player & download',
              ],
              cta: 'Get Started Free',
              popular: false,
            },
            {
              name: 'Pro Creator',
              price: '$19',
              period: 'per month',
              desc: 'For educators, creators, and researchers needing high-res output.',
              features: [
                'Full 1080p 60fps HD rendering',
                'Priority GPU queue (< 15s renders)',
                'Multi-scene script editor',
                'Custom watermarks & branding',
                'Export raw Python scripts',
              ],
              cta: 'Upgrade to Pro',
              popular: true,
            },
            {
              name: 'Team / Enterprise',
              price: '$49',
              period: 'per month',
              desc: 'Dedicated GPU clusters for teams, universities, and institutions.',
              features: [
                'Unlimited 4K ultra-HD rendering',
                'Dedicated GPU rendering instance',
                'Team collaboration workspace',
                'Custom API access & webhooks',
                '24/7 dedicated support',
              ],
              cta: 'Contact Sales',
              popular: false,
            },
          ].map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-3xl border p-6 sm:p-8 flex flex-col justify-between ${
                plan.popular
                  ? 'border-[#005a96] bg-gradient-to-b from-[#00253e] to-[#001a2c] shadow-2xl shadow-[#00406c]/40 md:scale-105'
                  : 'border-[#002e4e] bg-[#001a2c] shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#00406c] border border-[#005a96] px-4 py-1 text-[10px] font-extrabold text-[#38bdf8] uppercase tracking-widest whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-outfit">{plan.name}</h3>
                <p className="mt-2 text-xs text-slate-400">{plan.desc}</p>
                <div className="mt-5 sm:mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">{plan.price}</span>
                  <span className="text-xs text-slate-400">/{plan.period}</span>
                </div>

                <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-3.5">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-xs text-slate-300">
                      <Check className="h-4 w-4 text-[#38bdf8] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate('/auth?mode=signup')}
                className={`mt-8 sm:mt-10 w-full rounded-full py-3 sm:py-3.5 text-xs font-bold transition-all ${
                  plan.popular
                    ? 'bg-[#00406c] hover:bg-[#005a96] text-white border border-[#005a96] shadow-lg shadow-[#00406c]/30'
                    : 'bg-[#00111c] hover:bg-[#002137] text-white border border-[#002e4e]'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Back to Home CTA */}
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
