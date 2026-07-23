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
            <span>Simple Transparent Pricing</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-outfit">
            Start creating videos for free
          </h1>
          <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto">
            Choose a plan that fits your creation needs — no hidden fees or unexpected charges.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              className={`relative rounded-3xl border p-8 flex flex-col justify-between ${
                plan.popular
                  ? 'border-[#005a96] bg-gradient-to-b from-[#00253e] to-[#001a2c] shadow-2xl shadow-[#00406c]/40'
                  : 'border-[#002e4e] bg-[#001a2c] shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#00406c] border border-[#005a96] px-4 py-1 text-[10px] font-extrabold text-[#38bdf8] uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white font-outfit">{plan.name}</h3>
                <p className="mt-2 text-xs text-slate-400">{plan.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-outfit">{plan.price}</span>
                  <span className="text-xs text-slate-400">/{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-3.5">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-xs text-slate-300">
                      <Check className="h-4 w-4 text-[#38bdf8] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate('/auth')}
                className={`mt-10 w-full rounded-full py-3.5 text-xs font-bold transition-all ${
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
