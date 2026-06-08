import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, AlertCircle, Loader2, Video } from 'lucide-react';
import { api } from '../utils/api';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await api.login(email, password);
        onAuthSuccess();
      } else {
        await api.register(email, password);
        setRegistered(true);
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0b0b14] px-4 text-white">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />

      {/* Brand logo header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col items-center text-center"
      >
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-lg shadow-brand-500/30">
          <Video className="h-8 w-8 text-white" />
        </div>
        <h1 className="bg-gradient-to-r from-white via-indigo-200 to-brand-400 bg-clip-text text-4xl font-black tracking-tight text-transparent font-outfit">
          AnimoConcepto
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-xs">
          Generate stunning Manim mathematical and explanatory animations with AI.
        </p>
      </motion.div>

      {/* Main glassmorphic card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Toggle tabs */}
        <div className="mb-6 flex rounded-lg bg-black/30 p-1">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
              setRegistered(false);
            }}
            className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all duration-300 ${
              isLogin
                ? 'bg-gradient-to-r from-brand-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError(null);
              setRegistered(false);
            }}
            className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all duration-300 ${
              !isLogin
                ? 'bg-gradient-to-r from-brand-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {registered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-400"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Registration successful! Please sign in with your credentials.</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-black/20 py-2.5 pr-4 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-black/20 py-2.5 pr-4 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2.5 pr-4 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-500 py-3 text-sm font-bold shadow-lg shadow-brand-500/20 transition-all duration-300 hover:shadow-brand-500/30 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-[#0b0b14] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
